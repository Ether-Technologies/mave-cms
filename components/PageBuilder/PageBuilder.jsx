// components/PageBuilder/PageBuilder.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../store/slices/pageSlice";

// Components
import PageHeader from "./Components/PageHeader";
import PageContent from "./Components/PageContent";
import PageLoadingStates from "./Components/PageLoadingStates";
import FloatingActionButtons from "./Components/FloatingActionButtons";
import PagePreview from "./PagePreview";

// Hooks
import { usePageOperations } from "./hooks/usePageOperations";
import { usePageEffects } from "./hooks/usePageEffects";

const PageBuilder = ({ pageId, editMode = false }) => {
  const dispatch = useDispatch();
  const { pageData, loading, error, isDirty, lastSaved } = useSelector(
    (state) => state.page
  );

  const { canUndo, canRedo } = useSelector((state) => state.history);
  const [preview, setPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(editMode);

  // Page operations
  const {
    fetchPageData,
    savePageData,
    handleSectionDuplicate,
    handleSectionDelete,
    handleAddSection,
    handleAddSectionAtPosition,
    handleSectionsUpdate,
    handleUndo,
    handleRedo,
  } = usePageOperations(pageId, pageData);

  // Page effects (keyboard shortcuts, auto-save, etc.)
  usePageEffects({
    pageId,
    isEditing,
    isDirty,
    onSave: () => savePageData(true),
    onUndo: handleUndo,
    onRedo: handleRedo,
    onFetchData: fetchPageData,
  });

  // Handle editing state changes
  const handleEditingStateChange = (editing) => {
    setIsEditing(editing);
  };

  // Reset loading state if data is available
  useEffect(() => {
    if (loading && pageData) {
      dispatch(setLoading(false));
    }
  }, [loading, pageData, dispatch]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (loading) {
      const timeoutId = setTimeout(() => {
        dispatch(setLoading(false));
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeoutId);
    }
  }, [loading, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading, Error, and No Data States */}
      <PageLoadingStates
        loading={loading}
        error={error}
        pageData={pageData}
        onRetry={fetchPageData}
      />

      {/* Main Page Content */}
      {pageData && (
        <>
          {/* Header */}
          <PageHeader
            isEditing={isEditing}
            isDirty={isDirty}
            canUndo={canUndo}
            canRedo={canRedo}
            onToggleEdit={() => setIsEditing(!isEditing)}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />

          {/* Main Content */}
          <PageContent
            pageData={pageData}
            isEditing={isEditing}
            onSectionsUpdate={handleSectionsUpdate}
            onSectionDuplicate={handleSectionDuplicate}
            onSectionDelete={handleSectionDelete}
            onEditingStateChange={handleEditingStateChange}
            onAddSection={handleAddSection}
            onAddSectionAtPosition={handleAddSectionAtPosition}
          />

          {/* Floating Action Buttons */}
          <FloatingActionButtons
            isEditing={isEditing}
            isDirty={isDirty}
            loading={loading}
            lastSaved={lastSaved}
            onSave={() => savePageData(true)}
            onPreview={() => setPreview(true)}
          />

          {/* Page Preview Modal */}
          <PagePreview
            pageData={pageData}
            open={preview}
            setOpen={setPreview}
          />
        </>
      )}
    </div>
  );
};

export default PageBuilder;
