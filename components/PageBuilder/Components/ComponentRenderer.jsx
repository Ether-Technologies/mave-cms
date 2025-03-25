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
import { useDispatch, useSelector } from "react-redux";
import { setPageData, setIsDirty } from "../../../store/slices/pageSlice";
import { Button, Popconfirm } from "antd";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";

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
};

const ComponentRenderer = React.memo(
  ({ component, index, sectionIndex, preview = false }) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    // Memoize the update and delete handlers
    const updateComponent = useCallback(
      (updatedComponent) => {
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === sectionIndex) {
              return {
                ...section,
                data: section.data.map((comp, compIdx) =>
                  compIdx === index ? updatedComponent : comp
                ),
              };
            }
            return section;
          }),
        };
        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      },
      [dispatch, pageData, sectionIndex, index]
    );

    const deleteComponent = useCallback(() => {
      const updatedPageData = {
        ...pageData,
        body: pageData.body.map((section, idx) => {
          if (idx === sectionIndex) {
            return {
              ...section,
              data: section.data.filter((_, compIdx) => compIdx !== index),
            };
          }
          return section;
        }),
      };
      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
    }, [dispatch, pageData, sectionIndex, index]);

    const handleDuplicate = useCallback(() => {
      const duplicateEvent = new CustomEvent("duplicateComponent", {
        detail: { componentIndex: index },
      });
      window.dispatchEvent(duplicateEvent);
    }, [index]);

    // Get the actual component type, handling both object and string formats
    const componentType = component.type?.type || component.type;

    // Memoize the component type check
    const SpecificComponent = useMemo(
      () => COMPONENT_MAP[componentType],
      [componentType]
    );

    if (!SpecificComponent) {
      console.warn(`Unknown component type: ${componentType}`);
      return null;
    }

    return (
      <Draggable draggableId={component._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`relative border border-gray-300 p-4 mb-4 ${
              snapshot.isDragging ? "shadow-lg" : ""
            }`}
          >
            <SpecificComponent
              component={component}
              updateComponent={updateComponent}
              deleteComponent={deleteComponent}
              preview={preview}
              onDuplicateElement={handleDuplicate}
            />
          </div>
        )}
      </Draggable>
    );
  }
);

ComponentRenderer.displayName = "ComponentRenderer";

export default ComponentRenderer;
