// components/PageBuilder/Components/ComponentRenderer.jsx

import React, { useState, useMemo, useCallback } from "react";
import TextComponent from "./TextComponent";
import ParagraphComponent from "./ParagraphComponent";
import MediaComponent from "./MediaComponent";
import MenuComponent from "./MenuComponent";
import NavbarComponent from "./NavbarComponent";
import SliderComponent from "./SliderComponent/SliderComponent";
import CardComponent from "./CardComponent";
import FooterComponent from "./FooterComponent";
import VideoComponent from "./VideoComponent";
import TableComponent from "./TableComponent";
import AccordionComponent from "./AccordionComponent";
import ButtonComponent from "./ButtonComponent";
import GalleryComponent from "./GalleryComponent";
import GoogleMapComponent from "./GoogleMapComponent";
import IconListComponent from "./IconListComponent/IconListComponent";
import TestimonialComponent from "./TestimonialComponent/TestimonialComponent";
import TitleDescriptionComponent from "./TitleDescriptionComponent";
import FormComponent from "./FormComponent";
import InfoBoxComponent from "./InfoBoxComponent/InfoBoxComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setPageData,
  setIsDirty,
  duplicateComponent,
} from "../../../store/slices/pageSlice";

const COMPONENT_MAP = {
  title: React.memo(TextComponent),
  description: React.memo(ParagraphComponent),
  titledescription: React.memo(TitleDescriptionComponent),
  media: React.memo(MediaComponent),
  menu: React.memo(MenuComponent),
  navbar: React.memo(NavbarComponent),
  slider: React.memo(SliderComponent),
  card: React.memo(CardComponent),
  footer: React.memo(FooterComponent),
  video: React.memo(VideoComponent),
  table: React.memo(TableComponent),
  accordion: React.memo(AccordionComponent),
  button: React.memo(ButtonComponent),
  gallery: React.memo(GalleryComponent),
  "google-map": React.memo(GoogleMapComponent),
  iconlist: React.memo(IconListComponent),
  testimonial: React.memo(TestimonialComponent),
  form: React.memo(FormComponent),
  infobox: React.memo(InfoBoxComponent),
};

// NestedComponentRenderer for handling nested components with data arrays
const NestedComponentRenderer = React.memo(
  ({
    component,
    updateComponent,
    deleteComponent,
    preview = false,
    isEditing = false,
    onDuplicateElement,
    onEditingStateChange,
  }) => {
    if (!component || !component.data || !Array.isArray(component.data)) {
      console.warn(
        "NestedComponentRenderer: Invalid component data",
        component
      );
      return null;
    }

    return (
      <div className="nested-component-container">
        {component.data.map((nestedComponent, index) => {
          // Get the component type for the nested component
          const nestedComponentType = (() => {
            if (!nestedComponent || !nestedComponent.type) {
              if (
                nestedComponent &&
                nestedComponent.data &&
                Array.isArray(nestedComponent.data)
              ) {
                return "nested";
              }
              return null;
            }
            if (typeof nestedComponent.type === "object") {
              return nestedComponent.type.type || null;
            }
            return nestedComponent.type;
          })();

          // Get the component to render
          const NestedComponentToRender =
            COMPONENT_MAP[nestedComponentType] || null;

          if (!NestedComponentToRender) {
            console.warn(
              `Nested component type "${nestedComponentType}" not found for component:`,
              nestedComponent
            );
            return null;
          }

          const nestedComponentProps = {
            component: nestedComponent,
            updateComponent: (updatedNestedComponent) => {
              const newData = [...component.data];
              newData[index] = updatedNestedComponent;
              updateComponent({ ...component, data: newData });
            },
            deleteComponent: () => {
              const newData = component.data.filter((_, idx) => idx !== index);
              updateComponent({ ...component, data: newData });
            },
            onDuplicate: () => {
              const newData = [...component.data];
              const duplicatedComponent = {
                ...nestedComponent,
                _id: `nested-${Date.now()}-${Math.random()}`,
              };
              newData.splice(index + 1, 0, duplicatedComponent);
              updateComponent({ ...component, data: newData });
            },
            preview,
            isEditing,
            onEditingStateChange,
          };

          return (
            <div
              key={nestedComponent._id || index}
              className="nested-component-item"
            >
              <NestedComponentToRender {...nestedComponentProps} />
            </div>
          );
        })}
      </div>
    );
  }
);

NestedComponentRenderer.displayName = "NestedComponentRenderer";

const ComponentRenderer = React.memo(
  ({
    component,
    onUpdate,
    onDelete,
    onDuplicate,
    onEditingStateChange,
    preview = false,
    isEditing = false,
    // Additional props that might be passed from PagePreview
    index,
    components,
    sectionIndex,
  }) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    // Handle editing state changes
    const handleEditingStateChange = useCallback(
      (editing) => {
        if (onEditingStateChange) {
          onEditingStateChange(editing);
        }
      },
      [onEditingStateChange]
    );

    // Memoize the update and delete handlers
    const updateComponent = useCallback(
      (updatedComponent) => {
        if (onUpdate) {
          onUpdate(updatedComponent);
        } else {
          // Fallback to old system
          const updatedPageData = {
            ...pageData,
            body: pageData.body.map((section, idx) => {
              const targetSectionIndex = component.sectionIndex ?? sectionIndex;
              const targetComponentIndex = component.index ?? index;

              if (idx === targetSectionIndex) {
                return {
                  ...section,
                  data: section.data.map((comp, compIdx) =>
                    compIdx === targetComponentIndex ? updatedComponent : comp
                  ),
                };
              }
              return section;
            }),
          };

          dispatch(setPageData(updatedPageData));
          dispatch(setIsDirty(true));
        }
      },
      [onUpdate, dispatch, pageData, component]
    );

    const deleteComponent = useCallback(() => {
      console.log("🔧 deleteComponent called in ComponentRenderer:", {
        hasOnDelete: !!onDelete,
        componentIndex: component.index ?? index,
        sectionIndex: component.sectionIndex ?? sectionIndex,
      });

      if (onDelete) {
        onDelete();
      } else {
        // Fallback to old system
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            const targetSectionIndex = component.sectionIndex ?? sectionIndex;
            const targetComponentIndex = component.index ?? index;

            if (idx === targetSectionIndex) {
              return {
                ...section,
                data: section.data.filter(
                  (_, compIdx) => compIdx !== targetComponentIndex
                ),
              };
            }
            return section;
          }),
        };
        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    }, [onDelete, dispatch, pageData, component]);

    const handleDuplicate = useCallback(() => {
      if (onDuplicate) {
        onDuplicate();
      } else {
        // Fallback to old system
        dispatch(
          duplicateComponent({
            sectionIndex: component.sectionIndex ?? sectionIndex,
            componentIndex: component.index ?? index,
          })
        );
      }
    }, [onDuplicate, dispatch, component]);

    // Get the component type
    const componentType = useMemo(() => {
      if (!component || !component.type) {
        // Check if this is a nested component with data
        if (component && component.data && Array.isArray(component.data)) {
          return "nested"; // Special type for nested components
        }
        return null;
      }
      if (typeof component.type === "object") {
        return component.type.type || null;
      }
      return component.type;
    }, [component?.type, component?.data]);

    // Get the component to render
    const ComponentToRender = useMemo(() => {
      if (!componentType) {
        return null;
      }
      if (componentType === "nested") {
        // Return a special component for nested data
        return NestedComponentRenderer;
      }
      return COMPONENT_MAP[componentType] || null;
    }, [componentType]);

    if (!component) {
      console.warn("Component is null or undefined");
      return null;
    }

    if (!ComponentToRender) {
      console.warn(
        `Component type "${componentType}" not found for component:`,
        component
      );
      return null;
    }

    // Pass editing state to components that need it
    const componentProps = {
      component,
      updateComponent,
      deleteComponent,
      preview,
      isEditing,
      onDuplicateElement: handleDuplicate,
      onEditingStateChange: handleEditingStateChange,
    };

    return <ComponentToRender {...componentProps} />;
  }
);

ComponentRenderer.displayName = "ComponentRenderer";

export default ComponentRenderer;
