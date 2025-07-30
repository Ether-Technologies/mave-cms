// components/PageBuilder/Components/hooks/useComponentOperations.js

import { useCallback, useEffect } from "react";
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

    // Debug sectionIndex
    useEffect(() => {
        console.log("🔧 useComponentOperations received sectionIndex:", sectionIndex);
    }, [sectionIndex]);

    const addComponent = useCallback(
        (type) => {
            console.log("🔧 addComponent called:", {
                type,
                sectionIndex,
                componentsCount: componentsState.length,
            });

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

            console.log("🔧 Created new component:", newComponent);

            if (onComponentsUpdate) {
                // Use new callback system
                const updatedComponents = [...componentsState, newComponent];
                console.log(
                    "🔧 Calling onComponentsUpdate with:",
                    updatedComponents.length,
                    "components"
                );
                console.log("🔧 Updated components array:", updatedComponents);
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
                            return {
                                ...section,
                                data: [...(section.data || []), newComponent],
                            };
                        }
                        return section;
                    }),
                };

                console.log("🔧 Updated page data:", updatedPageData);
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
            console.log("🔧 handleComponentDelete called with:", {
                componentIndex,
                sectionIndex,
                componentsCount: componentsState.length,
                hasOnComponentsUpdate: !!onComponentsUpdate,
                hasOnComponentDelete: !!onComponentDelete
            });

            if (sectionIndex === undefined || sectionIndex === null) {
                console.error("❌ Section index is undefined or null for component deletion:", sectionIndex);
                message.error("Cannot delete component - invalid section index.");
                return;
            }

            const updatedComponents = componentsState.filter(
                (_, index) => index !== componentIndex
            );

            console.log("🔧 Updated components count:", updatedComponents.length);

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