// components/PageBuilder/Components/hooks/useComponentOperations.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";
import { message } from "antd";

export const useComponentOperations = ({
    componentsState,
    sectionIndex,
    onComponentsUpdate,
    onComponentDelete,
    onComponentDuplicate,
}) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    const addComponent = useCallback(
        (type, position = null) => {
            // Validate input
            if (!type) {
                console.error("❌ Invalid component type:", type);
                message.error("Invalid component type");
                return;
            }

            const newComponent = {
                _id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                type: type,
                value: "",
                settings: [],
                _mave: {
                    fontSize: "medium",
                    primaryColor: "#000000",
                    secondaryColor: "#000000",
                    textAlign: "left",
                    fontWeight: "normal",
                    isDualColor: false,
                    altText: null,
                },
            };

            if (onComponentsUpdate) {
                // Use new callback system
                let updatedComponents;
                if (position !== null && position >= 0 && position <= componentsState.length) {
                    // Insert at specific position
                    updatedComponents = [
                        ...componentsState.slice(0, position),
                        newComponent,
                        ...componentsState.slice(position)
                    ];
                } else {
                    // Add to end
                    updatedComponents = [...componentsState, newComponent];
                }
                onComponentsUpdate(updatedComponents);
            } else {
                // Fallback to old system
                if (!pageData || !pageData.body) {
                    console.error("❌ Cannot add component: pageData or body is null");
                    message.error("Cannot add component - page data is not available");
                    return;
                }

                if (sectionIndex < 0 || sectionIndex >= pageData.body.length) {
                    console.error(
                        "❌ Section index out of bounds:",
                        sectionIndex,
                        "body length:",
                        pageData.body.length
                    );
                    message.error("Cannot add component - invalid section");
                    return;
                }

                const updatedPageData = {
                    ...pageData,
                    body: pageData.body.map((section, idx) => {
                        if (idx === sectionIndex) {
                            let updatedData;
                            if (position !== null && position >= 0 && position <= (section.data || []).length) {
                                // Insert at specific position
                                updatedData = [
                                    ...(section.data || []).slice(0, position),
                                    newComponent,
                                    ...(section.data || []).slice(position)
                                ];
                            } else {
                                // Add to end
                                updatedData = [...(section.data || []), newComponent];
                            }
                            return {
                                ...section,
                                data: updatedData,
                            };
                        }
                        return section;
                    }),
                };

                dispatch(setPageData(updatedPageData));
                dispatch(setIsDirty(true));
            }

            message.success("Component added successfully");
        },
        [componentsState, onComponentsUpdate, pageData, sectionIndex, dispatch]
    );

    const handleComponentUpdate = useCallback(
        (updatedComponent, componentIndex) => {
            const updatedComponents = [...componentsState];
            updatedComponents[componentIndex] = updatedComponent;

            if (onComponentsUpdate) {
                onComponentsUpdate(updatedComponents);
            } else {
                // Fallback to old system
                const updatedPageData = {
                    ...pageData,
                    body: pageData.body.map((section, idx) => {
                        if (idx === sectionIndex) {
                            return {
                                ...section,
                                data: updatedComponents,
                            };
                        }
                        return section;
                    }),
                };

                dispatch(setPageData(updatedPageData));
                dispatch(setIsDirty(true));
            }
        },
        [componentsState, onComponentsUpdate, pageData, sectionIndex, dispatch]
    );

    const handleComponentDelete = useCallback(
        (componentIndex) => {
            if (sectionIndex === undefined || sectionIndex === null) {
                console.error("❌ Section index is undefined or null for component deletion:", sectionIndex);
                message.error("Cannot delete component - invalid section index.");
                return;
            }

            const updatedComponents = componentsState.filter(
                (_, index) => index !== componentIndex
            );

            if (onComponentsUpdate) {
                onComponentsUpdate(updatedComponents);
            } else if (onComponentDelete) {
                onComponentDelete(componentIndex);
            } else {
                // Fallback to old system
                const updatedPageData = {
                    ...pageData,
                    body: pageData.body.map((section, idx) => {
                        if (idx === sectionIndex) {
                            return {
                                ...section,
                                data: updatedComponents,
                            };
                        }
                        return section;
                    }),
                };

                dispatch(setPageData(updatedPageData));
                dispatch(setIsDirty(true));
            }
        },
        [
            componentsState,
            onComponentDelete,
            onComponentsUpdate,
            pageData,
            sectionIndex,
            dispatch,
        ]
    );

    const handleComponentDuplicate = useCallback(
        (componentIndex) => {
            const componentToDuplicate = componentsState[componentIndex];
            const duplicatedComponent = {
                ...componentToDuplicate,
                _id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };

            // Create new array without mutating
            const updatedComponents = [
                ...componentsState.slice(0, componentIndex + 1),
                duplicatedComponent,
                ...componentsState.slice(componentIndex + 1),
            ];

            if (onComponentsUpdate) {
                onComponentsUpdate(updatedComponents);
            } else if (onComponentDuplicate) {
                onComponentDuplicate(componentIndex);
            } else {
                // Fallback to old system
                const updatedPageData = {
                    ...pageData,
                    body: pageData.body.map((section, idx) => {
                        if (idx === sectionIndex) {
                            return {
                                ...section,
                                data: updatedComponents,
                            };
                        }
                        return section;
                    }),
                };

                dispatch(setPageData(updatedPageData));
                dispatch(setIsDirty(true));
            }
        },
        [
            componentsState,
            onComponentDuplicate,
            onComponentsUpdate,
            pageData,
            sectionIndex,
            dispatch,
        ]
    );

    return {
        addComponent,
        handleComponentUpdate,
        handleComponentDelete,
        handleComponentDuplicate,
    };
}; 