import React, { useState, useEffect } from "react";
import { Button, Modal, Popconfirm, Input, Radio, Select, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../RichTextEditor";
import instance from "../../../axios";

/**
 * TitleDescriptionComponent
 *
 * Props:
 * - component._mave contains {
 *     title,        // string
 *     altTitle,     // string
 *     description,  // HTML string
 *     altDescription, // HTML string
 *     linkType,     // "page" | "independent"
 *     link,         // string (if independent)
 *     linkPageId,   // number (if page)
 *   }
 * - preview: boolean (if true, just display read-only mode)
 * - updateComponent: function(componentData)
 * - deleteComponent: function()
 * - pages: array of page objects (like [{id, page_name_en, slug}, ...])
 */
const TitleDescriptionComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  // Local form data
  const [isEditing, setIsEditing] = useState(false);
  const [pages, setPages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    altTitle: "",
    description: "",
    altDescription: "",
    linkType: "independent",
    link: "",
    linkPageId: null,
  });

  // Fetch pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await instance.get("/pages");
        setPages(data);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };
    fetchPages();
  }, []);

  // On mount or whenever component changes, sync local state
  useEffect(() => {
    if (component?._mave) {
      const {
        title = "",
        altTitle = "",
        description = "",
        altDescription = "",
        linkType = "independent",
        link = "",
        linkPageId = null,
      } = component._mave;
      setFormData({
        title,
        altTitle,
        description,
        altDescription,
        linkType,
        link,
        linkPageId,
      });
    }
  }, [component]);

  // ---------------------
  //   HANDLERS
  // ---------------------
  const handleDelete = () => {
    deleteComponent();
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDiscard = () => {
    // Reset to original
    if (component?._mave) {
      const orig = component._mave;
      setFormData({
        title: orig.title || "",
        altTitle: orig.altTitle || "",
        description: orig.description || "",
        altDescription: orig.altDescription || "",
        linkType: orig.linkType || "independent",
        link: orig.link || "",
        linkPageId: orig.linkPageId || null,
      });
    }
    setIsEditing(false);
    message.info("Changes discarded.");
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      Modal.error({ title: "Validation Error", content: "Title is required." });
      return;
    }
    // If linkType="page", build link from the selected page (like in CreateCardForm).
    let finalLink = formData.link;
    if (formData.linkType === "page") {
      const selectedPage = pages.find((p) => p.id === formData.linkPageId);
      if (!selectedPage) {
        Modal.error({
          title: "Validation Error",
          content: "Please select a page.",
        });
        return;
      }
      finalLink = `/${selectedPage.slug}?page_id=${selectedPage.id}&pageName=${selectedPage.page_name_en}`;
    } else {
      // If independent, just use what's typed in formData.link
      if (!formData.link.trim()) {
        Modal.error({
          title: "Validation Error",
          content: "Please enter a valid link.",
        });
        return;
      }
    }

    // Construct new _mave object
    const newMaveData = {
      ...formData,
      link: finalLink,
    };

    // Update parent component data
    updateComponent({
      ...component,
      _mave: newMaveData,
    });

    message.success("Data updated successfully.");
    setIsEditing(false);
  };

  // Update local form fields
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // If in preview mode, show read-only
  if (preview) {
    const {
      title,
      altTitle,
      description,
      altDescription,
      linkType,
      link,
      linkPageId,
    } = formData;
    return (
      <div className="border p-4 rounded-md bg-white">
        <h3 className="text-xl font-semibold mb-2">Title & Description</h3>
        {/* Title + Alt Title */}
        <div className="text-theme font-bold">
          {title || "No Title"}
          {altTitle ? ` / ${altTitle}` : ""}
        </div>
        {/* Description */}
        <div
          className="mt-2"
          dangerouslySetInnerHTML={{ __html: description || "No Description" }}
        />
        {/* Alt Description */}
        {altDescription && (
          <div
            className="mt-2 italic"
            dangerouslySetInnerHTML={{ __html: altDescription }}
          />
        )}
        {/* Link info */}
        {link && (
          <p className="mt-2">
            <strong>Link: </strong>
            {linkType === "page" ? (
              <>
                Page #{linkPageId} → <span>{link}</span>
              </>
            ) : (
              <span>{link}</span>
            )}
          </p>
        )}
      </div>
    );
  }

  // Otherwise, show editing or display mode
  const {
    title,
    altTitle,
    description,
    altDescription,
    linkType,
    link,
    linkPageId,
  } = formData;

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">
            Title & Description Component
          </h3>
        </div>
        <div>
          {!isEditing ? (
            <>
              {component?._mave && (
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleEditClick}
                  className="mavebutton"
                >
                  Change
                </Button>
              )}
              <Button
                icon={<CopyFilled />}
                onClick={onDuplicateElement}
                className="mavebutton"
              />
              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Popconfirm>
            </>
          ) : (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={handleSave}
                className="mavebutton"
              >
                Done
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleDiscard}
                className="mavecancelbutton"
              >
                Discard
              </Button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          {/* Title Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Title (Optional)
            </label>
            <Input
              value={altTitle}
              onChange={(e) => handleChange("altTitle", e.target.value)}
              placeholder="Enter alternative title"
            />
          </div>

          {/* Description Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <RichTextEditor
              defaultValue={description}
              onChange={(html) => handleChange("description", html)}
              editMode={true}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Description (Optional)
            </label>
            <RichTextEditor
              defaultValue={altDescription}
              onChange={(html) => handleChange("altDescription", html)}
              editMode={true}
            />
          </div>

          {/* Link Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link Type
            </label>
            <Radio.Group
              value={linkType}
              onChange={(e) => handleChange("linkType", e.target.value)}
            >
              <Radio value="independent">Independent Link</Radio>
              <Radio value="page">Page Link</Radio>
            </Radio.Group>
          </div>

          {linkType === "independent" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link URL
              </label>
              <Input
                value={link}
                onChange={(e) => handleChange("link", e.target.value)}
                placeholder="Enter URL"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Page
              </label>
              <Select
                value={linkPageId}
                onChange={(value) => handleChange("linkPageId", value)}
                placeholder="Select a page"
                className="w-full"
              >
                {pages.map((page) => (
                  <Select.Option key={page.id} value={page.id}>
                    {page.page_name_en}
                  </Select.Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Title + Alt Title */}
          <div className="text-theme font-bold">
            {title || "No Title"}
            {altTitle ? ` / ${altTitle}` : ""}
          </div>
          {/* Description */}
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{
              __html: description || "No Description",
            }}
          />
          {/* Alt Description */}
          {altDescription && (
            <div
              className="mt-2 italic"
              dangerouslySetInnerHTML={{ __html: altDescription }}
            />
          )}
          {/* Link info */}
          {link && (
            <p className="mt-2">
              <strong>Link: </strong>
              {linkType === "page" ? (
                <>
                  Page #{linkPageId} → <span>{link}</span>
                </>
              ) : (
                <span>{link}</span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TitleDescriptionComponent;
