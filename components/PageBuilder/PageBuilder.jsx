// components/PageBuilder/PageBuilder.jsx

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionWrapper from "./Sections/SectionWrapper";
import { Button, message, Spin, Alert, Modal } from "antd"; // Removed Tooltip for simplicity
import {
  SaveOutlined,
  EyeOutlined,
  EditOutlined,
  UndoOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons"; // Changed to EyeOutlined for Preview
import instance from "../../axios";
import PagePreview from "./PagePreview";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import {
  setPageData,
  setLoading,
  setError,
  setIsDirty,
  setLastSaved,
} from "../../store/slices/pageSlice";
import {
  pushToHistory,
  undo,
  redo,
  clearHistory,
  selectCanUndo,
  selectCanRedo,
} from "../../store/slices/historySlice";

const AUTOSAVE_DELAY = 30000; // 30 seconds

const PageBuilder = ({ pageId, editMode = false }) => {
  const dispatch = useDispatch();
  const { pageData, loading, error, isDirty, lastSaved } = useSelector(
    (state) => state.page
  );

  const { canUndo, canRedo } = useSelector((state) => state.history);
  const [preview, setPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(editMode); // Use editMode prop

  const router = useRouter();
  const initialLoadRef = useRef(true);

  // Fetch page data from the backend with error handling
  const fetchPageData = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      // Always fetch fresh data from server for editing
      const response = await instance.get(`/pages/${pageId}`);
      const data = response.data;

      // Normalize component types in the data
      if (data.body) {
        data.body = data.body.map((section) => ({
          ...section,
          data: section.data.map((component) => ({
            ...component,
            type:
              typeof component.type === "object"
                ? component.type.type
                : component.type,
          })),
        }));
      }

      dispatch(setPageData(data));
      dispatch(pushToHistory(data)); // Add initial state to history
      dispatch(setError(null));
    } catch (err) {
      console.error("❌ Error fetching page data:", err);
      dispatch(setError(err.message || "Failed to fetch page data"));
    } finally {
      dispatch(setLoading(false));
      initialLoadRef.current = false;
    }
  }, [pageId, dispatch]);

  // Save the page data to the backend with error handling
  const savePageData = async (showMessage = true) => {
    if (!pageData) {
      message.error("No page data to save.");
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await instance.put(`/pages/${pageData.id}`, pageData);

      // Handle axios response directly
      if (response.status === 200) {
        dispatch(setIsDirty(false));
        dispatch(setLastSaved(new Date().toISOString()));

        if (showMessage) {
          message.success("Page saved successfully");
        }
        return true;
      } else {
        throw new Error("Failed to save page");
      }
    } catch (err) {
      dispatch(setError(err.message || "Failed to save page"));
      if (showMessage) {
        message.error(
          "Failed to save page data: " + (err.message || "Unknown error")
        );
      }
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Handle undo/redo actions
  const handleUndo = () => {
    if (canUndo) {
      dispatch(undo());
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      dispatch(redo());
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (isDirty) {
          savePageData(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, isDirty]);

  // Debounced autosave function
  const debouncedAutosave = useCallback(
    debounce(async () => {
      if (isDirty && !isEditing) {
        await savePageData(false);
      }
    }, AUTOSAVE_DELAY),
    [isDirty, pageData, isEditing]
  );

  // Effect for autosave
  useEffect(() => {
    // Only save when explicitly triggered, not automatically
    return () => {
      debouncedAutosave.cancel();
    };
  }, [debouncedAutosave]);

  // Initial data fetch
  useEffect(() => {
    if (pageId) {
      fetchPageData();
    } else {
    }
  }, [pageId]);

  // Force loading to false on mount if pageData exists
  useEffect(() => {
    if (pageData && loading) {
      dispatch(setLoading(false));
    }
  }, []);

  // Update history when pageData changes
  useEffect(() => {
    if (!initialLoadRef.current && pageData) {
      dispatch(pushToHistory(pageData));
    }
  }, [pageData, dispatch]);

  // Handle browser/tab close or refresh
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle in-app navigation
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isDirty) {
        const confirmLeave = window.confirm(
          "All unsaved changes will be discarded. Do you want to leave?"
        );
        if (!confirmLeave) {
          throw "Route change aborted due to unsaved changes.";
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [isDirty, router.events]);

  // Set editing state when components are being edited
  const handleEditingStateChange = useCallback((editing) => {
    setIsEditing(editing);
  }, []);

  // Handle section updates (when components are added/modified)
  const handleSectionUpdate = useCallback(
    (sectionIndex, updatedSection) => {
      // Validate inputs
      if (sectionIndex === undefined || sectionIndex === null) {
        return;
      }

      if (!updatedSection) {
        return;
      }

      if (pageData && pageData.body && sectionIndex >= 0) {
        const updatedPageData = { ...pageData };

        // Ensure the sectionIndex is within bounds
        if (sectionIndex < updatedPageData.body.length) {
          // Create a new array instead of mutating the existing one
          updatedPageData.body = [
            ...updatedPageData.body.slice(0, sectionIndex),
            updatedSection,
            ...updatedPageData.body.slice(sectionIndex + 1),
          ];
          dispatch(setPageData(updatedPageData));
          dispatch(setIsDirty(true));
        }
      }
    },
    [pageData, dispatch]
  );

  // Handle component updates (legacy - kept for compatibility)
  const handleComponentUpdate = useCallback(
    (updatedComponent, componentIndex) => {
      if (pageData && pageData.body) {
        const updatedPageData = { ...pageData };
        // This will be handled by the Section component internally
        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [pageData, dispatch]
  );

  // Handle component deletion
  const handleComponentDelete = useCallback((componentIndex) => {
    // This is handled by the ComponentList components internally
    // The componentIndex is passed from ComponentList to SectionWrapper
    // and the actual deletion happens in the ComponentList components
  }, []);

  // Handle component duplication
  const handleComponentDuplicate = useCallback(
    (componentIndex) => {
      if (pageData && pageData.body) {
        const updatedPageData = { ...pageData };
        // This will be handled by the Section component internally
        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [pageData, dispatch]
  );

  // Handle adding new section
  const handleAddSection = useCallback(() => {
    if (pageData) {
      const newSection = {
        _id: `section_${Date.now()}`,
        title: `Section ${(pageData.body?.length || 0) + 1}`,
        data: [],
        sectionTitle: `Section ${(pageData.body?.length || 0) + 1}`,
      };

      const updatedPageData = {
        ...pageData,
        body: [...(pageData.body || []), newSection],
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
      message.success("New section added successfully");
    }
  }, [pageData, dispatch]);

  // Force loading to false if it gets stuck
  useEffect(() => {
    if (loading && pageData) {
      dispatch(setLoading(false));
    }
  }, [loading, pageData, dispatch]);

  // Force loading to false if pageData exists
  useEffect(() => {
    if (pageData && loading) {
      dispatch(setLoading(false));
    }
  }, [pageData, loading, dispatch]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        dispatch(setLoading(false));
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [loading, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
        <div className="ml-4">Loading page data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchPageData}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  // Show loading if pageData is not available yet
  if (!pageData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
        <div className="ml-4">Loading page data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Page Builder" : "Page Preview"}
            </h1>
            {isDirty && isEditing && (
              <div className="flex items-center gap-2 text-yellow-500">
                <ExclamationCircleOutlined />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}

            {!isEditing && (
              <div className="flex items-center gap-2 text-green-500">
                <span className="text-sm">
                  Preview Mode - Auto-refresh enabled
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  icon={<UndoOutlined />}
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="mavebutton"
                >
                  Undo
                </Button>
                <Button
                  icon={<RedoOutlined />}
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="mavebutton"
                >
                  Redo
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => setIsEditing(false)}
                  className="mavebutton"
                >
                  Preview
                </Button>
              </>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsEditing(true)}
                className="mavebutton"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="p-6">
          {pageData?.body?.length > 0 ? (
            <>
              {pageData.body.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-8">
                  <SectionWrapper
                    section={section}
                    sectionIndex={sectionIndex}
                    onSectionUpdate={handleSectionUpdate}
                    onComponentDelete={handleComponentDelete}
                    onComponentDuplicate={handleComponentDuplicate}
                    onEditingStateChange={handleEditingStateChange}
                  />
                </div>
              ))}
              {isEditing && (
                <div className="text-center py-8">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddSection}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 px-6 py-2 font-semibold"
                    size="large"
                  >
                    Add Section
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No sections found in this page.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add sections to start building your page.
              </p>
              {isEditing && (
                <div className="mt-4">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleAddSection}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 px-6 py-2 font-semibold"
                    size="large"
                  >
                    Add Section
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Page Preview Modal */}
      <PagePreview pageData={pageData} open={preview} setOpen={setPreview} />
    </div>
  );
};

export default PageBuilder;
