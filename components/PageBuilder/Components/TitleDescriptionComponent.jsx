import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Popconfirm,
  Input,
  Radio,
  Select,
  message,
  Space,
  Tooltip,
  Collapse,
  ColorPicker,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  LinkOutlined,
  GlobalOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../RichTextEditor";
import instance from "../../../axios";

const { Panel } = Collapse;

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
  const [isHovered, setIsHovered] = useState(false);
  const [pages, setPages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    altTitle: "",
    description: "",
    altDescription: "",
    linkType: "independent",
    link: "",
    linkPageId: null,
    isExternal: false,
    target: "_self",
    // New styling properties
    titleColor: "#000000",
    altTitleColor: "#000000",
    isDualColor: false,
    titleFontSize: "medium",
    titleFontWeight: "normal",
    titleAlign: "left",
    showAltContent: false,
    // Alternative content for dual color parts
    altTitleFirst: "",
    altTitleSecond: "",
  });

  // Fetch pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const { data } = await instance.get("/pages");
        setPages(data);
      } catch (error) {
        console.error("Error fetching pages:", error);
        message.error("Failed to fetch pages");
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
        isExternal = false,
        target = "_self",
        titleColor = "#000000",
        altTitleColor = "#000000",
        isDualColor = false,
        titleFontSize = "medium",
        titleFontWeight = "normal",
        titleAlign = "left",
        showAltContent = false,
        altTitleFirst = "",
        altTitleSecond = "",
      } = component._mave;
      setFormData({
        title,
        altTitle,
        description,
        altDescription,
        linkType,
        link,
        linkPageId,
        isExternal,
        target,
        titleColor,
        altTitleColor,
        isDualColor,
        titleFontSize,
        titleFontWeight,
        titleAlign,
        showAltContent,
        altTitleFirst,
        altTitleSecond,
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
        isExternal: orig.isExternal || false,
        target: orig.target || "_self",
        titleColor: orig.titleColor || "#000000",
        altTitleColor: orig.altTitleColor || "#000000",
        isDualColor: orig.isDualColor || false,
        titleFontSize: orig.titleFontSize || "medium",
        titleFontWeight: orig.titleFontWeight || "normal",
        titleAlign: orig.titleAlign || "left",
        showAltContent: orig.showAltContent || false,
        altTitleFirst: orig.altTitleFirst || "",
        altTitleSecond: orig.altTitleSecond || "",
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

  const getFontSizeClass = (size) => {
    switch (size) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-base";
      case "large":
        return "text-lg";
      case "xlarge":
        return "text-xl";
      case "2xlarge":
        return "text-2xl";
      case "3xlarge":
        return "text-3xl";
      default:
        return "text-base";
    }
  };

  // If in preview mode, show read-only
  if (preview) {
    const {
      title,
      altTitle,
      description,
      altDescription,
      link,
      isExternal,
      target,
    } = formData;
    return (
      <div className="border p-4 rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-2">Title & Description</h3>
        <div className="space-y-4">
          <div
            className={`${getFontSizeClass(formData.titleFontSize)}`}
            style={{
              color: formData.titleColor,
              fontWeight: formData.titleFontWeight,
              textAlign: formData.titleAlign,
            }}
          >
            {title || "No Title"}
            {formData.isDualColor && altTitle && (
              <span
                style={{
                  color: formData.altTitleColor,
                  fontWeight: formData.titleFontWeight,
                }}
                className="ml-2"
              >
                / {altTitle}
              </span>
            )}
          </div>
          {formData.showAltContent &&
            formData.isDualColor &&
            (formData.altTitleFirst || formData.altTitleSecond) && (
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">
                  Alternative Title:
                </div>
                <div
                  className={`${getFontSizeClass(formData.titleFontSize)}`}
                  style={{
                    color: formData.titleColor,
                    fontWeight: formData.titleFontWeight,
                    textAlign: formData.titleAlign,
                  }}
                >
                  {formData.altTitleFirst || "No Alternative First Part"}
                  {formData.altTitleSecond && (
                    <span
                      style={{
                        color: formData.altTitleColor,
                        fontWeight: formData.titleFontWeight,
                      }}
                      className="ml-2"
                    >
                      / {formData.altTitleSecond}
                    </span>
                  )}
                </div>
              </div>
            )}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: description || "No Description",
            }}
          />
          {formData.showAltContent && altDescription && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">
                Alternative Content:
              </div>
              <div
                className="prose max-w-none italic text-gray-600"
                dangerouslySetInnerHTML={{ __html: altDescription }}
              />
            </div>
          )}
          {link && (
            <div className="flex items-center gap-2 text-brand-dark">
              <LinkOutlined />
              <a
                href={link}
                target={target}
                rel={isExternal ? "noopener noreferrer" : ""}
                className="hover:underline"
              >
                {link}
              </a>
            </div>
          )}
        </div>
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
    isExternal,
    target,
  } = formData;

  return (
    <div
      className={`border rounded-lg bg-white transition-all duration-200 ${
        isHovered ? "shadow-md" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <DragOutlined className="text-xl text-gray-400 cursor-move hover:text-gray-600 transition-colors" />
            <h3 className="text-lg font-semibold text-gray-700">
              Title & Description Component
            </h3>
          </div>
          <Space>
            {!isEditing ? (
              <>
                {component?._mave && (
                  <Tooltip title="Edit component">
                    <Button
                      icon={<EditOutlined />}
                      onClick={handleEditClick}
                      className="mavebutton"
                    >
                      Edit
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="Duplicate component">
                  <Button
                    icon={<CopyFilled />}
                    onClick={onDuplicateElement}
                    className="mavebutton"
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete Component"
                  description="Are you sure you want to delete this component?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Delete component">
                    <Button icon={<DeleteOutlined />} danger />
                  </Tooltip>
                </Popconfirm>
              </>
            ) : (
              <>
                <Tooltip title="Save changes">
                  <Button
                    icon={<CheckOutlined />}
                    onClick={handleSave}
                    className="mavebutton"
                  >
                    Save
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleDiscard}
                    className="mavecancelbutton"
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            )}
          </Space>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Collapse defaultActiveKey={["1", "2", "3"]} ghost>
              <Panel header="Title Settings" key="1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="Enter title"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Dual Color Title
                    </label>
                    <Switch
                      checked={formData.isDualColor}
                      onChange={(checked) =>
                        handleChange("isDualColor", checked)
                      }
                    />
                  </div>
                  {formData.isDualColor && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Second Part Title
                        </label>
                        <Input
                          value={formData.altTitle}
                          onChange={(e) =>
                            handleChange("altTitle", e.target.value)
                          }
                          placeholder="Enter second part title"
                          className="w-full"
                        />
                      </div>
                      {formData.showAltContent && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Alternative First Part Title
                            </label>
                            <Input
                              value={formData.altTitleFirst}
                              onChange={(e) =>
                                handleChange("altTitleFirst", e.target.value)
                              }
                              placeholder="Enter alternative first part title"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Alternative Second Part Title
                            </label>
                            <Input
                              value={formData.altTitleSecond}
                              onChange={(e) =>
                                handleChange("altTitleSecond", e.target.value)
                              }
                              placeholder="Enter alternative second part title"
                              className="w-full"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title Color
                      </label>
                      <ColorPicker
                        value={formData.titleColor}
                        onChange={(color) =>
                          handleChange("titleColor", color.toHexString())
                        }
                        className="w-full"
                      />
                    </div>
                    {formData.isDualColor && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternative Title Color
                        </label>
                        <ColorPicker
                          value={formData.altTitleColor}
                          onChange={(color) =>
                            handleChange("altTitleColor", color.toHexString())
                          }
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Size
                      </label>
                      <Select
                        value={formData.titleFontSize}
                        onChange={(value) =>
                          handleChange("titleFontSize", value)
                        }
                        className="w-full"
                      >
                        <Select.Option value="small">Small</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="large">Large</Select.Option>
                        <Select.Option value="xlarge">X-Large</Select.Option>
                        <Select.Option value="2xlarge">2X-Large</Select.Option>
                        <Select.Option value="3xlarge">3X-Large</Select.Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Font Weight
                      </label>
                      <Select
                        value={formData.titleFontWeight}
                        onChange={(value) =>
                          handleChange("titleFontWeight", value)
                        }
                        className="w-full"
                      >
                        <Select.Option value="normal">Normal</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="semibold">
                          Semi Bold
                        </Select.Option>
                        <Select.Option value="bold">Bold</Select.Option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Alignment
                      </label>
                      <Select
                        value={formData.titleAlign}
                        onChange={(value) => handleChange("titleAlign", value)}
                        className="w-full"
                      >
                        <Select.Option value="left">Left</Select.Option>
                        <Select.Option value="center">Center</Select.Option>
                        <Select.Option value="right">Right</Select.Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </Panel>
              <Panel header="Description" key="2">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <RichTextEditor
                      defaultValue={formData.description}
                      onChange={(html) => handleChange("description", html)}
                      editMode={true}
                      maxLength={5000}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alternative Description
                    </label>
                    <RichTextEditor
                      defaultValue={formData.altDescription}
                      onChange={(html) => handleChange("altDescription", html)}
                      editMode={true}
                      maxLength={5000}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Show Alternative Content
                      </label>
                      <p className="text-xs text-gray-500">
                        Display alternative title and description alongside the
                        main content
                      </p>
                    </div>
                    <Switch
                      checked={formData.showAltContent}
                      onChange={(checked) =>
                        handleChange("showAltContent", checked)
                      }
                    />
                  </div>
                </div>
              </Panel>
              <Panel header="Link Settings" key="3">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Type
                    </label>
                    <Radio.Group
                      value={formData.linkType}
                      onChange={(e) => handleChange("linkType", e.target.value)}
                      className="w-full"
                    >
                      <Radio value="independent">Independent Link</Radio>
                      <Radio value="page">Page Link</Radio>
                    </Radio.Group>
                  </div>

                  {formData.linkType === "independent" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Link URL *
                      </label>
                      <Input
                        value={formData.link}
                        onChange={(e) => handleChange("link", e.target.value)}
                        placeholder="Enter URL"
                        className="w-full"
                        prefix={<GlobalOutlined />}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Page *
                      </label>
                      <Select
                        value={formData.linkPageId}
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Link Behavior
                    </label>
                    <Space>
                      <Radio.Group
                        value={formData.target}
                        onChange={(e) => handleChange("target", e.target.value)}
                      >
                        <Radio value="_self">Same Tab</Radio>
                        <Radio value="_blank">New Tab</Radio>
                      </Radio.Group>
                      <Radio.Group
                        value={formData.isExternal}
                        onChange={(e) =>
                          handleChange("isExternal", e.target.value)
                        }
                      >
                        <Radio value={true}>External</Radio>
                        <Radio value={false}>Internal</Radio>
                      </Radio.Group>
                    </Space>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`${getFontSizeClass(formData.titleFontSize)}`}
              style={{
                color: formData.titleColor,
                fontWeight: formData.titleFontWeight,
                textAlign: formData.titleAlign,
              }}
            >
              {title || "No Title"}
              {formData.isDualColor && altTitle && (
                <span
                  style={{
                    color: formData.altTitleColor,
                    fontWeight: formData.titleFontWeight,
                  }}
                  className="ml-2"
                >
                  / {altTitle}
                </span>
              )}
            </div>
            {formData.showAltContent &&
              formData.isDualColor &&
              (formData.altTitleFirst || formData.altTitleSecond) && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-1">
                    Alternative Title:
                  </div>
                  <div
                    className={`${getFontSizeClass(formData.titleFontSize)}`}
                    style={{
                      color: formData.titleColor,
                      fontWeight: formData.titleFontWeight,
                      textAlign: formData.titleAlign,
                    }}
                  >
                    {formData.altTitleFirst || "No Alternative First Part"}
                    {formData.altTitleSecond && (
                      <span
                        style={{
                          color: formData.altTitleColor,
                          fontWeight: formData.titleFontWeight,
                        }}
                        className="ml-2"
                      >
                        / {formData.altTitleSecond}
                      </span>
                    )}
                  </div>
                </div>
              )}
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: description || "No Description",
              }}
            />
            {formData.showAltContent && altDescription && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">
                  Alternative Content:
                </div>
                <div
                  className="prose max-w-none italic text-gray-600"
                  dangerouslySetInnerHTML={{ __html: altDescription }}
                />
              </div>
            )}
            {link && (
              <div className="flex items-center gap-2 text-brand-dark">
                <LinkOutlined />
                <a
                  href={link}
                  target={target}
                  rel={isExternal ? "noopener noreferrer" : ""}
                  className="hover:underline"
                >
                  {link}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleDescriptionComponent;
