// components/PageBuilder/hooks/usePageEffects.js

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";

const AUTOSAVE_DELAY = 30000; // 30 seconds

export const usePageEffects = ({
    pageId,
    isEditing,
    isDirty,
    onSave,
    onUndo,
    onRedo,
    onFetchData,
}) => {
    const router = useRouter();
    const [autoSaveEnabled] = useState(true);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isEditing) return;

            // Save on Ctrl+S
            if ((e.ctrlKey || e.metaKey) && e.key === "s") {
                e.preventDefault();
                onSave();
            }

            // Undo on Ctrl+Z
            if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                onUndo();
            }

            // Redo on Ctrl+Shift+Z or Ctrl+Y
            if (
                ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) ||
                ((e.ctrlKey || e.metaKey) && e.key === "y")
            ) {
                e.preventDefault();
                onRedo();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isEditing, onSave, onUndo, onRedo]);

    // Auto-save functionality - only trigger when isDirty changes, not on every render
    const debouncedSave = useCallback(
        debounce(() => {
            if (isDirty && isEditing && autoSaveEnabled) {
                onSave(false);
            }
        }, AUTOSAVE_DELAY),
        [isDirty, isEditing, onSave, autoSaveEnabled]
    );

    useEffect(() => {
        if (isDirty && isEditing && autoSaveEnabled) {
            debouncedSave();
        }
        return () => debouncedSave.cancel();
    }, [isDirty, isEditing, debouncedSave, autoSaveEnabled]);

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

    // Initial data fetch - only run once when pageId changes
    useEffect(() => {
        if (pageId) {
            onFetchData();
        }
    }, [pageId]); // Remove onFetchData from dependencies to prevent infinite loops
}; 