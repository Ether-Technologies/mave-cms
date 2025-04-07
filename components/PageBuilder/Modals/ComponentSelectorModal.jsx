// components/PageBuilder/Modals/ComponentSelectorModal.jsx

import React from "react";
import { Drawer } from "antd";
import Image from "next/image";

const componentOptions = [
  {
    type: "title",
    name: "Title",
    icon: "/icons/mave/font.svg",
    premium: false,
  },
  {
    type: "description",
    name: "Paragraph",
    icon: "/icons/mave/paragraph.svg",
    premium: false,
  },
  {
    type: "titledescription",
    name: "Title & Desc.",
    icon: "/icons/mave/textdescription.svg",
    premium: false,
  },
  {
    type: "media",
    name: "Media",
    icon: "/icons/mave/media.svg",
    premium: false,
  },
  { type: "menu", name: "Menu", icon: "/icons/mave/menus.svg", premium: false },
  {
    type: "navbar",
    name: "Navbar",
    icon: "/icons/mave/navbar.svg",
    premium: false,
  },
  {
    type: "slider",
    name: "Slider",
    icon: "/icons/mave/slider.svg",
    premium: false,
  },
  { type: "card", name: "Card", icon: "/icons/mave/cards.svg", premium: false },
  {
    type: "footer",
    name: "Footer",
    icon: "/icons/mave/footer.svg",
    premium: false,
  },
  {
    type: "video",
    name: "Video",
    icon: "/icons/mave/video.svg",
    premium: true,
  },
  {
    type: "table",
    name: "Table",
    icon: "/icons/mave/table.svg",
    premium: true,
  },
  {
    type: "accordion",
    name: "Accordion",
    icon: "/icons/mave/accordion.svg",
    premium: true,
  },
  {
    type: "button",
    name: "Button",
    icon: "/icons/mave/button.svg",
    premium: true,
  },
  {
    type: "gallery",
    name: "Gallery",
    icon: "/icons/mave/gallery.svg",
    premium: true,
  },
  {
    type: "google-map",
    name: "Google Map",
    icon: "/icons/mave/map.svg",
    premium: true,
  },
  {
    type: "iconlist",
    name: "Icon List",
    icon: "/icons/mave/iconlist.svg",
    premium: true,
  },
  {
    type: "testimonial",
    name: "Testimonial",
    icon: "/icons/mave/testimonial.svg",
    premium: true,
  },
  {
    type: "form",
    name: "Form",
    icon: "/icons/mave/exam.svg",
    premium: true,
  },
];

const ComponentSelectorModal = ({ isVisible, onClose, onSelectComponent }) => {
  const handleSelect = (componentType) => {
    const newComponent = { type: componentType };
    onSelectComponent(newComponent);
    onClose();
  };

  return (
    <Drawer
      title="Select Component Type"
      open={isVisible}
      onClose={onClose}
      placement="right"
    >
      <div className="grid grid-cols-2 gap-6">
        {componentOptions?.map((component) => (
          <div
            key={component.type}
            className="relative flex flex-col items-center justify-center cursor-pointer border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white transform hover:-translate-y-1 hover:scale-105"
            onClick={() => handleSelect(component.type)}
          >
            {/* Pro Badge */}
            {component.premium && (
              <div className="absolute top-2 right-2 flex items-center bg-gradient-to-r from-theme to-themedark text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                <svg
                  className="w-4 h-4 mr-1 z-50"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927C9.323 2.207 10.677 2.207 10.951 2.927L12.82 7.566a1 1 0 00.95.69h5.34c.969 0 1.371 1.24.588 1.81l-4.3 3.13a1 1 0 00-.364 1.118l1.65 5.067c.3.918-.755 1.688-1.54 1.118l-4.3-3.13a1 1 0 00-1.176 0l-4.3 3.13c-.785.57-1.84-.2-1.54-1.118l1.65-5.067a1 1 0 00-.364-1.118L2.294 9.156c-.783-.57-.38-1.81.588-1.81h5.34a1 1 0 00.95-.69l1.77-4.64z" />
                </svg>
                Pro
              </div>
            )}
            {/* Icon */}
            <Image
              src={component.icon}
              width={50}
              height={50}
              alt={component.name}
              className="object-contain"
            />
            {/* Name */}
            <h3 className="mt-4 text-lg font-semibold text-gray-600">
              {component.name}
            </h3>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default ComponentSelectorModal;
