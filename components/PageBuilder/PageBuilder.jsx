// components/PageBuilder/PageBuilder.jsx

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionList from "./Sections/SectionList";
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
          message.success("Page saved successfully!");
        }
      } else {
        throw new Error("Failed to save page");
      }
    } catch (err) {
      console.error("❌ Error saving page data:", err);
      message.error("Failed to save page. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isEditing) return;

      // Save on Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        savePageData();
      }

      // Undo on Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }

      // Redo on Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === "y")
      ) {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isEditing]);

  // Auto-save functionality
  const debouncedSave = useCallback(
    debounce(() => {
      if (isDirty && isEditing) {
        savePageData(false);
      }
    }, AUTOSAVE_DELAY),
    [isDirty, isEditing]
  );

  useEffect(() => {
    debouncedSave();
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && isEditing) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isEditing]);

  // Handle route changes
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (isDirty && isEditing) {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (!confirmed) {
          router.events.emit("routeChangeError");
          throw "Route change aborted";
        }
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => router.events.off("routeChangeStart", handleRouteChange);
  }, [isDirty, isEditing, router]);

  // Initial data fetch
  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId, fetchPageData]);

  // Handle section updates
  const handleSectionUpdate = useCallback(
    (sectionIndex, updatedSection) => {
      const updatedPageData = {
        ...pageData,
        body: pageData.body.map((section, idx) =>
          idx === sectionIndex ? updatedSection : section
        ),
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
      dispatch(pushToHistory(updatedPageData));
    },
    [pageData, dispatch]
  );

  // Handle component operations
  const handleComponentDelete = useCallback((componentIndex) => {
    // This will be handled by the individual sections
  }, []);

  const handleComponentDuplicate = useCallback((componentIndex) => {
    // This will be handled by the individual sections
  }, []);

  // Handle section operations
  const handleSectionDuplicate = useCallback(
    (sectionIndex) => {
      const sectionToDuplicate = pageData.body[sectionIndex];
      const duplicatedSection = {
        ...sectionToDuplicate,
        _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: `${sectionToDuplicate.title || `Section ${sectionIndex + 1}`} (Copy)`,
        data: sectionToDuplicate.data.map((component) => ({
          ...component,
          _id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
      };

      const updatedPageData = {
        ...pageData,
        body: [
          ...pageData.body.slice(0, sectionIndex + 1),
          duplicatedSection,
          ...pageData.body.slice(sectionIndex + 1),
        ],
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
      dispatch(pushToHistory(updatedPageData));
      message.success("Section duplicated successfully!");
    },
    [pageData, dispatch]
  );

  const handleSectionDelete = useCallback(
    (sectionIndex) => {
      const updatedPageData = {
        ...pageData,
        body: pageData.body.filter((_, idx) => idx !== sectionIndex),
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
      dispatch(pushToHistory(updatedPageData));
      message.success("Section deleted successfully!");
    },
    [pageData, dispatch]
  );

  // Handle editing state changes
  const handleEditingStateChange = useCallback((editing) => {
    setIsEditing(editing);
  }, []);

  // Handle adding new section
  const handleAddSection = useCallback(() => {
    const newSection = {
      _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `Section ${pageData.body.length + 1}`,
      data: [],
    };

    const updatedPageData = {
      ...pageData,
      body: [...pageData.body, newSection],
    };

    dispatch(setPageData(updatedPageData));
    dispatch(setIsDirty(true));
    dispatch(pushToHistory(updatedPageData));
    message.success("New section added successfully!");
  }, [pageData, dispatch]);

  // Handle sections update (for drag and drop)
  const handleSectionsUpdate = useCallback(
    (updatedSections) => {
      const updatedPageData = {
        ...pageData,
        body: updatedSections,
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
      dispatch(pushToHistory(updatedPageData));
    },
    [pageData, dispatch]
  );

  // Reset loading state if data is available
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
              <SectionList
                sections={pageData.body}
                setSections={handleSectionsUpdate}
                onSectionDuplicate={handleSectionDuplicate}
                onSectionDelete={handleSectionDelete}
                onEditingStateChange={handleEditingStateChange}
              />
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
