// components/PageBuilder/Components/ComponentRenderer.jsx

import React, { useState, useMemo, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import TextComponent from "./TextComponent";
import ParagraphComponent from "./ParagraphComponent";
import MediaComponent from "./MediaComponent";
import MenuComponent from "./MenuComponent";
import NavbarComponent from "./NavbarComponent";
import SliderComponent from "./SliderComponent";
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

const ComponentRenderer = React.memo(
  ({
    component,
    onUpdate,
    onDelete,
    onDuplicate,
    onEditingStateChange,
    preview = false,
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
              if (idx === component.sectionIndex) {
                return {
                  ...section,
                  data: section.data.map((comp, compIdx) =>
                    compIdx === component.index ? updatedComponent : comp
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
      if (onDelete) {
        onDelete();
      } else {
        // Fallback to old system
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === component.sectionIndex) {
              return {
                ...section,
                data: section.data.filter(
                  (_, compIdx) => compIdx !== component.index
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
            sectionIndex: component.sectionIndex,
            componentIndex: component.index,
          })
        );
      }
    }, [onDuplicate, dispatch, component]);

    // Get the component type
    const componentType = useMemo(() => {
      if (typeof component.type === "object") {
        return component.type.type;
      }
      return component.type;
    }, [component.type]);

    // Get the component to render
    const ComponentToRender = useMemo(() => {
      return COMPONENT_MAP[componentType] || null;
    }, [componentType]);

    if (!ComponentToRender) {
      console.warn(`Component type "${componentType}" not found`);
      return null;
    }

    // Pass editing state to components that need it
    const componentProps = {
      component,
      updateComponent,
      deleteComponent,
      preview,
      onDuplicateElement: handleDuplicate,
      onEditingStateChange: handleEditingStateChange,
    };

    return <ComponentToRender {...componentProps} />;
  }
);

ComponentRenderer.displayName = "ComponentRenderer";

export default ComponentRenderer;
