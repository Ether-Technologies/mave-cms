// components/PageBuilder/hooks/usePageOperations.js

import { useCallback } from "react";
import { useDispatch } from "react-redux";
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

// body.data is { section_1: {...}, section_2: {...}, ... }
const getSectionsArray = (bodyData) => Object.values(bodyData || {});

const buildSectionsObject = (arr) =>
    arr.reduce((acc, section, i) => {
        acc[`section_${i + 1}`] = section;
        return acc;
    }, {});

export const usePageOperations = (pageId, pageData) => {
    const dispatch = useDispatch();

    const fetchPageData = useCallback(async () => {
        try {
            dispatch(setLoading(true));
            const response = await instance.get(`/pages/${pageId}`);
            const data = response.data;

            if (data.body?.data) {
                Object.values(data.body.data).forEach((section) => {
                    Object.values(section.components || {}).forEach((comp) => {
                        if (typeof comp.type === "object") {
                            comp.type = comp.type.type;
                        }
                    });
                });
            }

            dispatch(setPageData(data));
            dispatch(pushToHistory(data));
            dispatch(setError(null));
        } catch (err) {
            console.error("❌ Error fetching page data:", err);
            dispatch(setError(err.message || "Failed to fetch page data"));
        } finally {
            dispatch(setLoading(false));
        }
    }, [pageId, dispatch]);

    const savePageData = useCallback(async (showMessage = true) => {
        if (!pageData) {
            message.error("No page data to save.");
            return;
        }
        if (!pageData.id) {
            message.error("No page ID to save.");
            return;
        }
        try {
            dispatch(setLoading(true));
            const response = await instance.put(`/pages/${pageData.id}`, pageData);
            if (response.status === 200) {
                dispatch(setIsDirty(false));
                dispatch(setLastSaved(new Date().toISOString()));
                if (showMessage) message.success("Page saved successfully!");
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

    const handleSectionDuplicate = useCallback(
        (sectionIndex) => {
            const sections = getSectionsArray(pageData.body?.data);
            const sectionToDuplicate = sections[sectionIndex];
            if (!sectionToDuplicate) return;

            const duplicatedSection = {
                ...sectionToDuplicate,
                _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: `${sectionToDuplicate.title || `Section ${sectionIndex + 1}`} (Copy)`,
                components: Object.fromEntries(
                    Object.entries(sectionToDuplicate.components || {}).map(([key, comp]) => [
                        key,
                        {
                            ...comp,
                            _id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        },
                    ])
                ),
            };

            const newSections = [
                ...sections.slice(0, sectionIndex + 1),
                duplicatedSection,
                ...sections.slice(sectionIndex + 1),
            ];

            const updatedPageData = {
                ...pageData,
                body: { ...pageData.body, data: buildSectionsObject(newSections) },
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
            const sections = getSectionsArray(pageData.body?.data);
            if (sectionIndex < 0 || sectionIndex >= sections.length) {
                message.error("Invalid section index.");
                return;
            }

            const updatedPageData = {
                ...pageData,
                body: {
                    ...pageData.body,
                    data: buildSectionsObject(sections.filter((_, idx) => idx !== sectionIndex)),
                },
            };

            dispatch(setPageData(updatedPageData));
            dispatch(setIsDirty(true));
            dispatch(pushToHistory(updatedPageData));
            message.success("Section deleted successfully!");
        },
        [pageData, dispatch]
    );

    const handleAddSection = useCallback(() => {
        const sections = getSectionsArray(pageData.body?.data);
        const newSection = {
            _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Section ${sections.length + 1}`,
            components: {},
        };

        const updatedPageData = {
            ...pageData,
            body: {
                ...pageData.body,
                data: buildSectionsObject([...sections, newSection]),
            },
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
        dispatch(pushToHistory(updatedPageData));
        message.success("New section added successfully!");
    }, [pageData, dispatch]);

    const handleAddSectionAtPosition = useCallback((position) => {
        const sections = getSectionsArray(pageData.body?.data);
        const newSection = {
            _id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title: `Section ${position + 1}`,
            components: {},
        };

        const newSections = [
            ...sections.slice(0, position),
            newSection,
            ...sections.slice(position),
        ].map((section, index) => ({
            ...section,
            title: section.title || `Section ${index + 1}`,
        }));

        const updatedPageData = {
            ...pageData,
            body: { ...pageData.body, data: buildSectionsObject(newSections) },
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
        dispatch(pushToHistory(updatedPageData));
        message.success("New section added successfully!");
    }, [pageData, dispatch]);

    // updatedSections can be array (from drag-and-drop) or object
    const handleSectionsUpdate = useCallback(
        (updatedSections) => {
            const data = Array.isArray(updatedSections)
                ? buildSectionsObject(updatedSections)
                : updatedSections;

            const updatedPageData = {
                ...pageData,
                body: { ...pageData.body, data },
            };

            dispatch(setPageData(updatedPageData));
            dispatch(setIsDirty(true));
            dispatch(pushToHistory(updatedPageData));
        },
        [pageData, dispatch]
    );

    const handleUndo = useCallback(() => dispatch(undo()), [dispatch]);
    const handleRedo = useCallback(() => dispatch(redo()), [dispatch]);

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
    };
};
