// components/PageBuilder/PageBuilder.jsx

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SectionList from "./Sections/SectionList";
import { Button, message, Spin } from "antd"; // Removed Tooltip for simplicity
import {
  SaveOutlined,
  EyeOutlined,
  UndoOutlined,
  RedoOutlined,
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

const PageBuilder = ({ pageId }) => {
  const dispatch = useDispatch();
  const { pageData, loading, error, isDirty, lastSaved } = useSelector(
    (state) => state.page
  );

  const { canUndo, canRedo } = useSelector((state) => state.history);
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const initialLoadRef = useRef(true);

  // Fetch page data from the backend with error handling
  const fetchPageData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await instance.get(`/pages/${pageId}`);
      const data = response.data;

      // Normalize component types in the data
      if (data.body) {
        data.body = data.body.map((section) => ({
          ...section,
          data: section.data.map((component) => ({
            ...component,
            type: component.type?.type || component.type, // Handle both object and string type
          })),
        }));
      }

      dispatch(setPageData(data));
      dispatch(pushToHistory(data)); // Add initial state to history
      dispatch(setError(null));
    } catch (err) {
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
      if (isDirty) {
        await savePageData(false);
      }
    }, AUTOSAVE_DELAY),
    [isDirty, pageData]
  );

  // Effect for autosave
  useEffect(() => {
    if (!initialLoadRef.current && isDirty) {
      debouncedAutosave();
    }
    return () => {
      debouncedAutosave.cancel();
    };
  }, [isDirty, debouncedAutosave]);

  // Initial data fetch
  useEffect(() => {
    if (pageId) {
      fetchPageData();
    }
  }, [pageId]);

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

  if (loading) {
    return (
      <div className="m-auto flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={fetchPageData} type="primary">
          Retry Loading
        </Button>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="text-center text-red-500">Error loading page data.</div>
    );
  }

  return (
    <div className="p-4 relative">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{pageData.page_name_en} Page</h1>
          {lastSaved && (
            <p className="text-sm text-gray-500">
              Last saved: {new Date(lastSaved).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            icon={<UndoOutlined />}
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl/⌘ + Z)"
          />
          <Button
            icon={<RedoOutlined />}
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl/⌘ + Y or Ctrl/⌘ + Shift + Z)"
          />
        </div>
      </div>

      {/* Section List */}
      <SectionList
        sections={pageData.body}
        setSections={(newSections) => {
          dispatch(setPageData({ ...pageData, body: newSections }));
        }}
      />

      {/* Floating Save Button */}
      <Button
        icon={<SaveOutlined style={{ fontSize: "1.5rem" }} />}
        onClick={() => savePageData(true)}
        className={`text-lg font-bold fixed bottom-16 right-10 px-4 py-6 rounded-full shadow-lg z-50 border-2 ${
          isDirty
            ? "bg-yellow-400 hover:bg-yellow-500"
            : "bg-theme hover:bg-theme"
        } text-black border-themedark`}
        title="Save (Ctrl/⌘ + S)"
      >
        {isDirty ? "Save*" : "Save"}
      </Button>

      {/* Floating Preview Button */}
      <Button
        icon={<EyeOutlined style={{ fontSize: "1.5rem" }} />}
        onClick={() => setPreview(true)}
        className="text-lg font-bold fixed bottom-16 right-40 bg-theme hover:bg-theme text-black p-4 rounded-full shadow-lg z-50 h-16 w-16 flex justify-center items-center border-2 border-themedark"
      />

      {/* Page Preview Modal */}
      <PagePreview pageData={pageData} open={preview} setOpen={setPreview} />
    </div>
  );
};

export default PageBuilder;
