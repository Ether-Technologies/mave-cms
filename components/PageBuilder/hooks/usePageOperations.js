// components/PageBuilder/hooks/usePageOperations.js

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import instance from "../../../axios";
import {
    setPageData,
    setLoading,
    setError,
    setIsDirty,
    setLastSaved,
} from "../../../store/slices/pageSlice";
import {
    pushToHistory,
    undo,
    redo,
} from "../../../store/slices/historySlice";

export const usePageOperations = (pageId, pageData) => {
    const dispatch = useDispatch();
    const isDirty = useSelector((state) => state.page.isDirty);
    const [autoSaveSettings, setAutoSaveSettings] = useState({
        autoSave: true,
        autoSaveInterval: 300 // 5 minutes default
    });
    const autoSaveTimerRef = useRef(null);
    const lastSaveTimeRef = useRef(null);

    // Fetch auto-save settings from API
    const fetchAutoSaveSettings = useCallback(async () => {
        try {
            const response = await instance.get('/settings');
            const settings = response.data;

            // Find content-settings configuration
            const contentSettings = settings.find(setting => setting.type === 'content-settings');

            if (contentSettings && contentSettings.config) {
                const config = contentSettings.config;
                setAutoSaveSettings({
                    autoSave: config.autoSave !== null ? config.autoSave : true,
                    autoSaveInterval: config.autoSaveInterval !== null ? config.autoSaveInterval : 300
                });
            } else {
                // Use defaults if no content-settings found
                setAutoSaveSettings({
                    autoSave: false,
                    autoSaveInterval: 300
                });
            }
        } catch (err) {
            console.error("❌ Error fetching auto-save settings:", err);
            // Use defaults on error
            setAutoSaveSettings({
                autoSave: false,
                autoSaveInterval: 300
            });
        }
    }, []);

    // Auto-save function
    const performAutoSave = useCallback(async () => {
        if (!isDirty || !pageData || !pageData.id) {
            return;
        }

        try {
            await instance.put(`/pages/${pageData.id}`, pageData);
            dispatch(setIsDirty(false));
            dispatch(setLastSaved(new Date().toISOString()));
            lastSaveTimeRef.current = Date.now();
            console.log("✅ Auto-save completed");
        } catch (err) {
            console.error("❌ Auto-save failed:", err);
        }
    }, [isDirty, pageData, dispatch]);

    // Set up auto-save timer
    useEffect(() => {
        if (!autoSaveSettings.autoSave || !pageData || !pageData.id) {
            return;
        }

        // Clear existing timer
        if (autoSaveTimerRef.current) {
            clearInterval(autoSaveTimerRef.current);
        }

        // Set up new timer
        const intervalMs = autoSaveSettings.autoSaveInterval * 1000; // Convert seconds to milliseconds
        autoSaveTimerRef.current = setInterval(() => {
            performAutoSave();
        }, intervalMs);

        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, [autoSaveSettings, pageData, performAutoSave]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (autoSaveTimerRef.current) {
                clearInterval(autoSaveTimerRef.current);
            }
        };
    }, []);

    // Fetch page data from the backend with error handling
    const fetchPageData = useCallback(async () => {
        try {
            dispatch(setLoading(true));

            // Fetch auto-save settings first
            await fetchAutoSaveSettings();

            // Always fetch fresh data from server for editing
            const response = await instance.get(`/pages/${pageId}`);
            const data = response.data;

            // Recursive function to normalize component types
            const normalizeComponentTypes = (components) => {
                if (!Array.isArray(components)) return components;

                return components.map((component) => {
                    // Handle the component's own type
                    const normalizedType = !component.type
                        ? null
                        : typeof component.type === "object"
                            ? component.type.type || null
                            : component.type;

                    // If component has nested data, recursively normalize it
                    if (component.data && Array.isArray(component.data)) {
                        return {
                            ...component,
                            type: normalizedType,
                            data: normalizeComponentTypes(component.data)
                        };
                    }

                    return {
                        ...component,
                        type: normalizedType
                    };
                });
            };

            // Normalize component types in the data and ensure body is always an array
            if (data.body && Array.isArray(data.body)) {
                data.body = data.body.map((section) => ({
                    ...section,
                    data: normalizeComponentTypes(section.data),
                }));
            } else {
                // Initialize body as empty array if it's null/undefined
                data.body = [];
            }

            dispatch(setPageData(data));
            dispatch(pushToHistory(data)); // Add initial state to history
            dispatch(setError(null));
        } catch (err) {
            console.error("❌ Error fetching page data:", err);
            dispatch(setError(err.message || "Failed to fetch page data"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [pageId, dispatch]);

    // Save the page data to the backend with error handling
    const savePageData = useCallback(async (showMessage = true) => {
        if (!pageData) {
            console.error("❌ No pageData available for saving");
            message.error("No page data to save.");
            return;
        }

        if (!pageData.id) {
            console.error("❌ No page ID available for saving");
            message.error("No page ID to save.");
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
    }, [pageData, dispatch]);

    // Handle section operations
    const handleSectionDuplicate = useCallback(
        (sectionIndex) => {
            if (!pageData || !pageData.body || !Array.isArray(pageData.body)) {
                console.error("❌ No pageData or pageData.body available for duplication");
                message.error("No page data available for duplication.");
                return;
            }

            if (sectionIndex < 0 || sectionIndex >= pageData.body.length) {
                console.error("❌ Invalid section index for duplication:", sectionIndex);
                message.error("Invalid section index for duplication.");
                return;
            }

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
                    ...(pageData.body || []).slice(0, sectionIndex + 1),
                    duplicatedSection,
                    ...(pageData.body || []).slice(sectionIndex + 1),
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
            if (!pageData || !pageData.body) {
                console.error("❌ No pageData or pageData.body available for deletion");
                message.error("No page data available for deletion.");
                return;
            }

            if (sectionIndex === undefined || sectionIndex === null) {
                console.error("❌ Section index is undefined or null:", sectionIndex);
                message.error("Invalid section index.");
                return;
            }

            if (sectionIndex < 0 || sectionIndex >= pageData.body.length) {
                console.error("❌ Invalid section index:", sectionIndex);
                message.error("Invalid section index.");
                return;
            }

            const updatedPageData = {
                ...pageData,
                body: (pageData.body || []).filter((_, idx) => idx !== sectionIndex),
            };

            dispatch(setPageData(updatedPageData));
            dispatch(setIsDirty(true));
            dispatch(pushToHistory(updatedPageData));
            message.success("Section deleted successfully!");
        },
        [pageData, dispatch]
    );

    // Handle adding new section
    const handleAddSection = useCallback(() => {
        if (!pageData) {
            console.error("❌ No pageData available for adding section");
            message.error("No page data available for adding section.");
            return;
        }

        // Ensure body is an array, initialize if null/undefined
        const currentBody = pageData.body || [];

        const newSection = {
            _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Section ${currentBody.length + 1}`,
            data: [],
        };

        const updatedPageData = {
            ...pageData,
            body: [...currentBody, newSection],
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
        dispatch(pushToHistory(updatedPageData));
        message.success("New section added successfully!");
    }, [pageData, dispatch]);

    // Handle adding new section at specific position
    const handleAddSectionAtPosition = useCallback((position) => {
        if (!pageData) {
            console.error("❌ No pageData available for adding section at position");
            message.error("No page data available for adding section at position.");
            return;
        }

        // Ensure body is an array, initialize if null/undefined
        const currentBody = pageData.body || [];

        const newSection = {
            _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Section ${position + 1}`,
            data: [],
        };

        const updatedPageData = {
            ...pageData,
            body: [
                ...currentBody.slice(0, position),
                newSection,
                ...currentBody.slice(position),
            ],
        };

        // Update section titles to reflect new positions
        updatedPageData.body = updatedPageData.body.map((section, index) => ({
            ...section,
            title: section.title || `Section ${index + 1}`,
        }));

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
        dispatch(pushToHistory(updatedPageData));
        message.success("New section added successfully!");
    }, [pageData, dispatch]);

    // Handle sections update (for drag and drop)
    const handleSectionsUpdate = useCallback(
        (updatedSections) => {
            if (!pageData) {
                console.error("❌ No pageData available for updating sections");
                message.error("No page data available for updating sections.");
                return;
            }

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

    // Handle undo/redo
    const handleUndo = useCallback(() => {
        dispatch(undo());
    }, [dispatch]);

    const handleRedo = useCallback(() => {
        dispatch(redo());
    }, [dispatch]);

    return {
        fetchPageData,
        savePageData,
        handleSectionDuplicate,
        handleSectionDelete,
        handleAddSection,
        handleAddSectionAtPosition,
        handleSectionsUpdate,
        handleUndo,
        handleRedo,
        autoSaveSettings,
        performAutoSave,
    };
}; 