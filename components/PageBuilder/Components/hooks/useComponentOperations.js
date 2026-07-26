// components/PageBuilder/Components/hooks/useComponentOperations.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";
import { message } from "antd";

const getSectionsArray = (bodyData) => Object.values(bodyData || {});

const buildSectionsObject = (arr) =>
    arr.reduce((acc, section, i) => {
        acc[`section_${i + 1}`] = section;
        return acc;
    }, {});

// components is { media_1: {...}, text_1: {...}, ... } — rebuild as keyed object
const buildComponentsObject = (arr) =>
    arr.reduce((acc, comp, i) => {
        const prefix = typeof comp.type === "string" ? comp.type : "component";
        acc[`${prefix}_${i + 1}`] = comp;
        return acc;
    }, {});

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
                if (!pageData?.body?.data) {
                    message.error("Cannot add component - page data is not available");
                    return;
                }

                const sections = getSectionsArray(pageData.body.data);
                if (sectionIndex < 0 || sectionIndex >= sections.length) {
                    message.error("Cannot add component - invalid section");
                    return;
                }

                const section = sections[sectionIndex];
                const comps = Object.values(section.components || {});
                const updatedComps =
                    position !== null && position >= 0 && position <= comps.length
                        ? [...comps.slice(0, position), newComponent, ...comps.slice(position)]
                        : [...comps, newComponent];

                sections[sectionIndex] = {
                    ...section,
                    components: buildComponentsObject(updatedComps),
                };

                dispatch(setPageData({
                    ...pageData,
                    body: { ...pageData.body, data: buildSectionsObject(sections) },
                }));
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
                const sections = getSectionsArray(pageData.body?.data);
                sections[sectionIndex] = {
                    ...sections[sectionIndex],
                    components: buildComponentsObject(updatedComponents),
                };
                dispatch(setPageData({
                    ...pageData,
                    body: { ...pageData.body, data: buildSectionsObject(sections) },
                }));
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
                const sections = getSectionsArray(pageData.body?.data);
                sections[sectionIndex] = {
                    ...sections[sectionIndex],
                    components: buildComponentsObject(updatedComponents),
                };
                dispatch(setPageData({
                    ...pageData,
                    body: { ...pageData.body, data: buildSectionsObject(sections) },
                }));
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
                const sections = getSectionsArray(pageData.body?.data);
                sections[sectionIndex] = {
                    ...sections[sectionIndex],
                    components: buildComponentsObject(updatedComponents),
                };
                dispatch(setPageData({
                    ...pageData,
                    body: { ...pageData.body, data: buildSectionsObject(sections) },
                }));
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