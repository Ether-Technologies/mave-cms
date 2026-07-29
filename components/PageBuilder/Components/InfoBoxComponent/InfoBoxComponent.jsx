// components/PageBuilder/Components/InfoBoxComponent/InfoBoxComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Space,
  Form,
  message,
  Popconfirm,
  Input,
  Switch,
  Collapse,
} from "antd";
import RichTextEditor from "../../../RichTextEditor";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  SettingOutlined,
  CopyFilled,
  CheckOutlined,
  GlobalOutlined,
  ExportOutlined,
  DragOutlined,
  FontColorsOutlined,
  EyeOutlined,
  DownloadOutlined,
  LinkOutlined,
  EditOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import MediaSelectionModal from "../../Modals/MediaSelectionModal";
import ConfigSection from "./ConfigSection";
import MainContentSection from "./MainContentSection";
import AddInfoItemForm from "./AddInfoItemForm";
import InfoBoxItem from "./InfoBoxItem";

const { Panel } = Collapse;
const InfoBoxComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [infoBox, setInfoBox] = useState({
    title: component._mave?.title || "",
    description: component._mave?.description || "",
    secondTitle: component._mave?.secondTitle || "",
    secondDescription: component._mave?.secondDescription || "",
    altTitle: component._mave?.altTitle || "",
    altDescription: component._mave?.altDescription || "",
    media: component._mave?.media || [],
    infoItems: component._mave?.infoItems || [],
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [layout, setLayout] = useState(component._mave?.layout || "horizontal");
  const [font, setFont] = useState(component._mave?.font || "Arial");
  const [color, setColor] = useState(component._mave?.color || "#000000");
  const [background, setBackground] = useState(
    component._mave?.background || "#ffffff"
  );
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaSelectionMode, setMediaSelectionMode] = useState("multiple");
  const [editingItemMedia, setEditingItemMedia] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAltContent, setShowAltContent] = useState(false);
  const [showAltInputs, setShowAltInputs] = useState(false);
  const [editingAltItemId, setEditingAltItemId] = useState(null);
  const [tempAltTitle, setTempAltTitle] = useState("");
  const [tempAltDescription, setTempAltDescription] = useState("");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // Remove the automatic update useEffect to prevent infinite loops
  // Updates will be handled manually through save button

  useEffect(() => {
    setShowAltContent(component._mave?.showAltContent || false);
  }, [component._mave?.showAltContent]);

  // Handle media selection for adding new items
  const handleSelectMedia = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    setSelectedMedia(mediaArray);
    setIsMediaModalVisible(false);
  };

  // Handle media selection for editing existing items
  const handleEditItemMediaSelect = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    setEditingItemMedia(mediaArray);
    setIsMediaModalVisible(false);
  };

  // Handle main media selection
  const handleMainMediaSelect = (media) => {
    const mediaArray = Array.isArray(media) ? media : [media];
    setInfoBox((prevInfoBox) => ({
      ...prevInfoBox,
      media: mediaArray,
    }));
    setIsMediaModalVisible(false);
    message.success("Main media updated successfully.");
  };

  // Handle closing media modal - reset states to prevent cross-contamination
  const handleCloseMediaModal = () => {
    setIsMediaModalVisible(false);
    // Don't reset selectedMedia/editingItemMedia here to preserve selection
  };

  // Handle add info item submit
  const handleAddSubmit = (values) => {
    const newInfoItem = {
      id: Date.now(),
      title: values.title,
      description: values.description,
      secondTitle: values.secondTitle || "",
      secondDescription: values.secondDescription || "",
      link: values.link,
      altTitle: values.altTitle || "",
      altDescription: values.altDescription || "",
      media: [...selectedMedia], // Create a new array to avoid reference issues
    };
    setInfoBox({
      ...infoBox,
      infoItems: [...infoBox.infoItems, newInfoItem],
    });
    form.resetFields();
    setSelectedMedia([]); // Clear selected media after adding
    setShowAddForm(false);
    message.success("Info item added successfully.");
  };

  // Handle edit info item
  const handleEditInfoItem = (item) => {
    setEditingItemId(item.id);
    editForm.setFieldsValue({
      title: item.title,
      description: item.description,
      secondTitle: item.secondTitle || "",
      secondDescription: item.secondDescription || "",
      link: item.link,
      altTitle: item.altTitle || "",
      altDescription: item.altDescription || "",
    });
    setEditingItemMedia([...(item.media || [])]); // Create a new array to avoid reference issues
  };

  // Handle edit submit
  const handleEditSubmit = (values) => {
    const updatedItem = {
      id: editingItemId,
      title: values.title,
      description: values.description,
      secondTitle: values.secondTitle || "",
      secondDescription: values.secondDescription || "",
      link: values.link,
      altTitle: values.altTitle || "",
      altDescription: values.altDescription || "",
      media: [...editingItemMedia], // Create a new array to avoid reference issues
    };
    setInfoBox({
      ...infoBox,
      infoItems: infoBox.infoItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    });
    setEditingItemId(null);
    setEditingItemMedia([]); // Clear editing media state
    message.success("Info item updated successfully.");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingItemMedia([]);
    editForm.resetFields();
  };

  // Handle delete info item
  const handleDeleteInfoItem = (id) => {
    setInfoBox({
      ...infoBox,
      infoItems: infoBox.infoItems.filter((item) => item.id !== id),
    });
    message.success("Info item deleted successfully.");
  };

  // Handle delete component
  const handleDeleteComponent = () => {
    if (deleteComponent) {
      deleteComponent(component._id || component.id);
    }
  };

  // Handle media modal open for adding new items
  const handleMediaModalOpen = (mode) => {
    setMediaSelectionMode(mode);
    setIsMediaModalVisible(true);
  };

  // Handle media modal open for editing existing items
  const handleEditItemMediaModalOpen = (mode) => {
    setMediaSelectionMode(mode);
    setIsMediaModalVisible(true);
  };

  // Handle edit mode toggle
  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Save changes when exiting edit mode
      updateComponent({
        ...component,
        _mave: {
          ...infoBox,
          layout,
          font,
          color,
          background,
          showAltContent,
        },
      });
      message.success("Info box updated successfully.");
    }
    setIsEditMode(!isEditMode);
  };

  // Handle cancel edit mode
  const handleCancelEditMode = () => {
    // Reset to original values
    setInfoBox({
      title: component._mave?.title || "",
      description: component._mave?.description || "",
      secondTitle: component._mave?.secondTitle || "",
      secondDescription: component._mave?.secondDescription || "",
      altTitle: component._mave?.altTitle || "",
      altDescription: component._mave?.altDescription || "",
      media: component._mave?.media || [],
      infoItems: component._mave?.infoItems || [],
    });
    setLayout(component._mave?.layout || "horizontal");
    setFont(component._mave?.font || "Arial");
    setColor(component._mave?.color || "#000000");
    setBackground(component._mave?.background || "#ffffff");
    setShowAltContent(component._mave?.showAltContent || false);
    setIsEditMode(false);
    // Clear any lingering media selection states
    setSelectedMedia([]);
    setEditingItemMedia([]);
  };

  // Handle edit alt content for individual item
  const handleEditAltContent = (item) => {
    console.log("Edit alt content clicked for item:", item);
    setEditingAltItemId(item.id);
    setTempAltTitle(item.altTitle || "");
    setTempAltDescription(item.altDescription || "");
  };

  // Handle save alt content for individual item
  const handleSaveAltContent = () => {
    if (editingAltItemId) {
      const updatedInfoBox = {
        ...infoBox,
        infoItems: infoBox.infoItems.map((item) =>
          item.id === editingAltItemId
            ? {
                ...item,
                altTitle: tempAltTitle,
                altDescription: tempAltDescription,
              }
            : item
        ),
      };
      setInfoBox(updatedInfoBox);

      // Also update the component immediately
      updateComponent({
        ...component,
        _mave: {
          ...updatedInfoBox,
          layout,
          font,
          color,
          background,
          showAltContent,
        },
      });

      setEditingAltItemId(null);
      setTempAltTitle("");
      setTempAltDescription("");
      message.success("Alternative content updated successfully.");
    }
  };

  // Handle cancel alt content editing
  const handleCancelAltContent = () => {
    setEditingAltItemId(null);
    setTempAltTitle("");
    setTempAltDescription("");
  };

  // Styles based on configuration
  const containerStyle = {
    fontFamily: font,
    color: color,
    backgroundColor: background,
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      {!preview && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Info Box Component</h3>
          <Space>
            {isEditMode ? (
              <>
                <Button
                  className="mavebutton"
                  type="primary"
                  onClick={handleEditModeToggle}
                >
                  Save Changes
                </Button>
                <Button
                  className="mavecancelbutton"
                  onClick={handleCancelEditMode}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="mavebutton"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
                <Button
                  icon={<CopyFilled />}
                  onClick={onDuplicateElement}
                  className="mavebutton"
                />
              </>
            )}
            <Popconfirm
              title="Delete Component"
              description="Are you sure you want to delete this component?"
              onConfirm={handleDeleteComponent}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        </div>
      )}

      {!preview && isEditMode && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <div className="flex justify-end mb-4">
            <Button
              icon={<SettingOutlined />}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide Advanced" : "Show Advanced"}
            </Button>
          </div>

          {showAdvanced && (
            <ConfigSection
              layout={layout}
              font={font}
              color={color}
              background={background}
              onLayoutChange={setLayout}
              onFontChange={setFont}
              onColorChange={(e) => setColor(e.target.value)}
              onBackgroundChange={(e) => setBackground(e.target.value)}
            />
          )}

          <MainContentSection
            infoBox={infoBox}
            onInfoBoxChange={setInfoBox}
            onMediaSelect={handleMediaModalOpen}
            media={infoBox.media}
            updateComponent={updateComponent}
            component={component}
            layout={layout}
            font={font}
            color={color}
            background={background}
            showAltContent={showAltContent}
          />

          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Info Items</h4>
              <Button
                className="mavebutton"
                onClick={() => setShowAddForm(!showAddForm)}
                icon={showAddForm ? <MinusOutlined /> : <PlusOutlined />}
              >
                {showAddForm ? "Cancel" : "Add Info Item"}
              </Button>
            </div>

            {showAddForm && (
              <AddInfoItemForm
                form={form}
                onFinish={handleAddSubmit}
                onMediaSelect={handleMediaModalOpen}
                selectedMedia={selectedMedia}
              />
            )}
          </div>
        </Space>
      )}

      {/* Preview/Display Mode */}
      <div style={preview || !isEditMode ? containerStyle : {}}>
        {/* Title and Description - Full Width */}
        {(preview || !isEditMode) && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {showAltContent
                ? infoBox.altTitle || infoBox.title
                : infoBox.title}
            </h2>
            <div
              className="mb-4"
              dangerouslySetInnerHTML={{ __html: infoBox.description }}
            />
          </div>
        )}

        {/* Main Content and Info Items */}
        <div
          className={`${
            preview || !isEditMode
              ? layout === "vertical"
                ? "flex flex-col"
                : "grid grid-cols-2 gap-8"
              : "flex flex-col"
          }`}
        >
          {/* Main Media Display */}
          {(preview || !isEditMode) && (
            <div className={`${layout === "vertical" ? "mb-6" : ""}`}>
              {infoBox.media && infoBox.media.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {infoBox.media.map((mediaItem, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaItem.file_path}`}
                        alt={mediaItem.title || mediaItem.title_en || "Media"}
                        width={300}
                        height={300}
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Info Items Grid */}
          <div className={`${layout === "vertical" ? "w-full" : ""}`}>
            <div className="grid grid-cols-1 gap-6">
              {infoBox.infoItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-md shadow-sm"
                >
                  {editingItemId === item.id ? (
                    <div className="flex gap-4">
                      <div className="flex flex-col justify-center w-1/3">
                        {editingItemMedia && editingItemMedia.length > 0 && (
                          <div
                            className="relative cursor-pointer"
                            onClick={() =>
                              handleEditItemMediaModalOpen("multiple")
                            }
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${editingItemMedia[0].file_path}`}
                              alt={editingItemMedia[0].title || "Media"}
                              width={200}
                              height={200}
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}
                        <Button
                          className="mavebutton mt-2"
                          onClick={() =>
                            handleEditItemMediaModalOpen("multiple")
                          }
                        >
                          Change Media
                        </Button>
                      </div>
                      <div className="w-2/3">
                        <Form
                          form={editForm}
                          onFinish={handleEditSubmit}
                          layout="vertical"
                        >
                          <Form.Item
                            name="title"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the title",
                              },
                            ]}
                          >
                            <Input placeholder="Title" />
                          </Form.Item>
                          <Form.Item
                            name="description"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the description",
                              },
                            ]}
                          >
                            <RichTextEditor
                              defaultValue=""
                              onChange={(html) =>
                                editForm.setFieldValue("description", html)
                              }
                              editMode={true}
                              maxLength={2000}
                            />
                          </Form.Item>
                          <Form.Item name="secondTitle" label="Second Title">
                            <Input placeholder="Second Title (optional)" />
                          </Form.Item>
                          <Form.Item
                            name="secondDescription"
                            label="Second Description"
                          >
                            <RichTextEditor
                              defaultValue=""
                              onChange={(html) =>
                                editForm.setFieldValue(
                                  "secondDescription",
                                  html
                                )
                              }
                              editMode={true}
                              maxLength={2000}
                            />
                          </Form.Item>
                          <Form.Item name="link">
                            <Input placeholder="Link URL (optional)" />
                          </Form.Item>
                          <Form.Item name="altTitle">
                            <Input placeholder="Alternative Title (optional)" />
                          </Form.Item>
                          <Form.Item name="altDescription">
                            <RichTextEditor
                              defaultValue=""
                              onChange={(html) =>
                                editForm.setFieldValue("altDescription", html)
                              }
                              editMode={true}
                              maxLength={2000}
                            />
                          </Form.Item>
                          <Form.Item>
                            <Space>
                              <Button
                                className="mavebutton"
                                type="primary"
                                htmlType="submit"
                              >
                                Save
                              </Button>
                              <Button
                                className="mavecancelbutton"
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </Space>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-12 items-center gap-4">
                      <div className="col-span-3">
                        {item.media && item.media.length > 0 && (
                          <div className="relative">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.media[0].file_path}`}
                              alt={item.media[0].title || "Media"}
                              width={100}
                              height={100}
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        )}
                      </div>
                      <div className="col-span-8">
                        <h3 className="text-lg font-semibold mb-2">
                          {showAltContent
                            ? item.altTitle || item.title
                            : item.title}
                        </h3>
                        <div
                          className="mb-2"
                          dangerouslySetInnerHTML={{
                            __html: showAltContent
                              ? item.altDescription || item.description
                              : item.description,
                          }}
                        />
                        {item.secondTitle && (
                          <h4 className="text-md font-semibold mb-1 mt-3">
                            {item.secondTitle}
                          </h4>
                        )}
                        {item.secondDescription && (
                          <div
                            className="mb-2"
                            dangerouslySetInnerHTML={{
                              __html: item.secondDescription,
                            }}
                          />
                        )}
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand-dark hover:underline"
                          >
                            {item.link}
                          </a>
                        )}
                      </div>
                      {!preview && isEditMode && (
                        <Space className="col-span-1 flex flex-col">
                          <Button
                            className="mavebutton"
                            icon={<EditOutlined />}
                            onClick={() => handleEditInfoItem(item)}
                          />
                          <Button
                            className="mavebutton"
                            icon={<EditOutlined />}
                            onClick={() => handleEditAltContent(item)}
                            style={{ color: "#1890ff" }}
                            title="Edit Alt Content"
                          />
                          <Button
                            className="-ml-3"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteInfoItem(item.id)}
                          />
                        </Space>
                      )}
                    </div>
                  )}

                  {/* Alt Content Editing Form */}
                  {!preview && isEditMode && editingAltItemId === item.id && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border-2 border-blue-300">
                      <div className="mb-2 text-sm text-blue-600 font-medium">
                        ✏️ Editing Alt Content for: {item.title}
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternative Title
                        </label>
                        <Input
                          value={tempAltTitle}
                          onChange={(e) => setTempAltTitle(e.target.value)}
                          placeholder="Enter alternative title"
                          size="small"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternative Description
                        </label>
                        <RichTextEditor
                          defaultValue={tempAltDescription}
                          onChange={(html) => setTempAltDescription(html)}
                          editMode={true}
                          maxLength={2000}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="small"
                          onClick={handleCancelAltContent}
                          className="mavecancelbutton"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="small"
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={handleSaveAltContent}
                          className="mavebutton"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Selection Modal */}
      {!preview && isEditMode && (
        <MediaSelectionModal
          isVisible={isMediaModalVisible}
          onClose={handleCloseMediaModal}
          onSelectMedia={(media) => {
            if (mediaSelectionMode === "multiple") {
              if (editingItemId) {
                handleEditItemMediaSelect(media);
              } else {
                handleSelectMedia(media);
              }
            } else {
              handleMainMediaSelect(media);
            }
          }}
          selectionMode={mediaSelectionMode}
        />
      )}

      {/* Multi-Language Configuration */}
      {infoBox.infoItems.length > 0 && !preview && (
        <Collapse className="mt-4">
          <Panel
            header={
              <div className="flex items-center gap-2">
                <GlobalOutlined />
                Multi-Language Settings
              </div>
            }
            key="multilang"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-md font-semibold">
                    Display Alternative Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Toggle to show alternative titles and descriptions for info
                    items
                  </p>
                </div>
                <Switch
                  checked={showAltContent}
                  onChange={(checked) => {
                    setShowAltContent(checked);
                  }}
                />
              </div>

              {showAltContent && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Alternative Content Mode:</strong> Info items will
                    display alternative titles and descriptions when available.
                  </div>
                </div>
              )}

              {/* Alternative Content Editing Section */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold flex items-center gap-2">
                    <EditOutlined />
                    Alternative Content
                  </h5>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setShowAltInputs(true)}
                    className="mavebutton"
                    size="small"
                  >
                    Edit
                  </Button>
                </div>

                {showAltInputs ? (
                  <div className="space-y-4">
                    {infoBox.infoItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {item.media && item.media.length > 0 && (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.media[0].file_path}`}
                              alt={item.media[0].title || "Media"}
                              width={60}
                              height={40}
                              className="rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-sm">
                              {item.title || "Untitled Item"}
                            </div>
                          </div>
                        </div>

                        <Form layout="vertical" className="w-full">
                          <Form.Item label="Alternative Title" className="mb-3">
                            <Input
                              placeholder="Enter alternative title"
                              defaultValue={item.altTitle || ""}
                              onChange={(e) => {
                                const updatedItems = [...infoBox.infoItems];
                                updatedItems[index] = {
                                  ...updatedItems[index],
                                  altTitle: e.target.value,
                                };
                                const updatedInfoBox = {
                                  ...infoBox,
                                  infoItems: updatedItems,
                                };
                                setInfoBox(updatedInfoBox);

                                // Update component immediately
                                updateComponent({
                                  ...component,
                                  _mave: {
                                    ...updatedInfoBox,
                                    layout,
                                    font,
                                    color,
                                    background,
                                    showAltContent,
                                  },
                                });
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Alternative Description"
                            className="mb-3"
                          >
                            <RichTextEditor
                              defaultValue={item.altDescription || ""}
                              onChange={(html) => {
                                const updatedItems = [...infoBox.infoItems];
                                updatedItems[index] = {
                                  ...updatedItems[index],
                                  altDescription: html,
                                };
                                const updatedInfoBox = {
                                  ...infoBox,
                                  infoItems: updatedItems,
                                };
                                setInfoBox(updatedInfoBox);

                                // Update component immediately
                                updateComponent({
                                  ...component,
                                  _mave: {
                                    ...updatedInfoBox,
                                    layout,
                                    font,
                                    color,
                                    background,
                                    showAltContent,
                                  },
                                });
                              }}
                            />
                          </Form.Item>
                        </Form>
                      </div>
                    ))}

                    {/* Update Button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => {
                          // Ensure all changes are saved to component
                          updateComponent({
                            ...component,
                            _mave: {
                              ...infoBox,
                              layout,
                              font,
                              color,
                              background,
                              showAltContent,
                            },
                          });
                          setShowAltInputs(false);
                          message.success(
                            "Alternative content updated successfully."
                          );
                        }}
                        className="mavebutton"
                      >
                        Update Alternative Content
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Current Alternative Content */
                  <div className="space-y-3">
                    {infoBox.infoItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {item.media && item.media.length > 0 && (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.media[0].file_path}`}
                              alt={item.media[0].title || "Media"}
                              width={40}
                              height={30}
                              className="rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-sm">
                              {item.title || "Untitled Item"}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>
                            <strong>Alt Title:</strong>{" "}
                            {item.altTitle || "Not set"}
                          </div>
                          <div>
                            <strong>Alt Description:</strong>{" "}
                            <div
                              className="text-gray-600"
                              dangerouslySetInnerHTML={{
                                __html:
                                  item.altDescription ||
                                  "No alternative description set",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
      )}
    </div>
  );
};

export default InfoBoxComponent;
