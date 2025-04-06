import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Row, Col, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";

const CreateFooterModal = ({
  visible,
  onCancel,
  onFooterCreated,
  fetchPages,
}) => {
  const [newPageTitleEn, setNewPageTitleEn] = useState("");
  const [newPageTitleBn, setNewPageTitleBn] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAltTitleManuallyEdited, setIsAltTitleManuallyEdited] =
    useState(false);

  // Sync Alt Title with Main Title unless manually edited
  useEffect(() => {
    if (!isAltTitleManuallyEdited) {
      setNewPageTitleBn(newPageTitleEn);
    }
  }, [newPageTitleEn, isAltTitleManuallyEdited]);

  const handleCreateFooter = async () => {
    if (newPageTitleEn.trim() === "" || newPageTitleBn.trim() === "") {
      message.error("All fields are required.");
      return;
    }

    // Validate slug format
    // const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    // if (!slugRegex.test(newSlug)) {
    //   message.error(
    //     "Invalid slug format. Use only lowercase letters, numbers, and hyphens."
    //   );
    //   return;
    // }

    try {
      setLoading(true);
      const response = await instance.post("/pages", {
        page_name_en: newPageTitleEn,
        page_name_bn: newPageTitleBn,
        type: "Footer",
        favicon_id: 10, // Assuming default favicon_id; adjust as needed
        slug: null,
        additional: [
          {
            pageType: "Footer",
            metaTitle: newPageTitleEn,
            metaDescription: "",
            keywords: [],
            metaImage: "",
            metaImageAlt: "",
          },
        ],
      });

      if (response.status === 201) {
        message.success("Footer created successfully.");
        onFooterCreated(response.data);
        // Reset form fields
        setNewPageTitleEn("");
        setNewPageTitleBn("");
        setNewSlug("");
        setIsAltTitleManuallyEdited(false);
        fetchPages();
        handleCancel();
      } else {
        message.error("Failed to create page.");
      }
    } catch (error) {
      console.error("Error creating page:", error);
      message.error("An error occurred while creating the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form fields on cancel
    setNewPageTitleEn("");
    setNewPageTitleBn("");
    setNewSlug("");
    setIsAltTitleManuallyEdited(false);
    onCancel();
  };

  // Generate slug from page title with hyphens instead of spaces and lowercase
  const generateSlug = () => {
    if (newPageTitleEn.trim() === "") {
      message.info("Please enter the page title first.");
      return;
    }
    const slug = newPageTitleEn.trim().toLowerCase().replace(/\s+/g, "-");
    setNewSlug(slug);
  };

  return (
    <Modal
      open={visible}
      title="Create New Footer"
      onCancel={handleCancel}
      footer={null}
      centered
      className="create-modal"
      width={600}
    >
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Footer Title
          </label>
          <Input
            placeholder="Enter footer title"
            value={newPageTitleEn}
            onChange={(e) => setNewPageTitleEn(e.target.value)}
            className="text-lg h-12"
            size="large"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Footer Alt Title
          </label>
          <Input
            placeholder="Enter footer alt title"
            value={newPageTitleBn}
            onChange={(e) => {
              setNewPageTitleBn(e.target.value);
              setIsAltTitleManuallyEdited(true);
            }}
            className="text-lg h-12"
            size="large"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            onClick={handleCancel}
            icon={<CloseCircleOutlined />}
            className="h-10 px-6 mavecancelbutton"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateFooter}
            icon={<PlusCircleOutlined />}
            loading={loading}
            className="h-10 px-6 mavebutton"
            type="primary"
          >
            Create Footer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateFooterModal;
