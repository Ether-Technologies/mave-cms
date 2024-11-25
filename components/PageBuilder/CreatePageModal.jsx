// components/PageBuilder/CreatePageModal.jsx

import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Row, Col, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";

const CreatePageModal = ({
  visible,
  onCancel,
  onPageCreated,
  fetchPages,
  type = "Page",
}) => {
  const [newPageTitleEn, setNewPageTitleEn] = useState("");
  const [newPageTitleBn, setNewPageTitleBn] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAltTitleManuallyEdited, setIsAltTitleManuallyEdited] =
    useState(false);

  useEffect(() => {
    if (!isAltTitleManuallyEdited) {
      setNewPageTitleBn(newPageTitleEn);
    }
  }, [newPageTitleEn, isAltTitleManuallyEdited]);

  const handleCreatePage = async () => {
    if (
      newPageTitleEn.trim() === "" ||
      newPageTitleBn.trim() === "" ||
      (type !== "Footer" && newSlug.trim() === "")
    ) {
      message.error("All fields are required.");
      return;
    }

    if (type !== "Footer") {
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(newSlug)) {
        message.error(
          "Invalid slug format. Use only lowercase letters, numbers, and hyphens."
        );
        return;
      }
    }

    try {
      setLoading(true);
      const response = await instance.post("/pages", {
        page_name_en: newPageTitleEn,
        page_name_bn: newPageTitleBn,
        type: type,
        favicon_id: 10,
        slug: type !== "Footer" ? newSlug : null,
        head: {
          title: newPageTitleEn,
          description: "",
          keywords: [],
          image: "",
          imageAlt: "",
        },
        additional: [
          {
            pageType: type,
            metaTitle: newPageTitleEn,
            metaDescription: "",
            keywords: [],
            metaImage: "",
            metaImageAlt: "",
          },
        ],
      });

      if (response.status === 201) {
        message.success(`${type} created successfully.`);
        onPageCreated(response.data);
        setNewPageTitleEn("");
        setNewPageTitleBn("");
        setNewSlug("");
        setIsAltTitleManuallyEdited(false);
        fetchPages();
        handleCancel();
      } else {
        message.error(`Failed to create ${type.toLowerCase()}.`);
      }
    } catch (error) {
      console.error(`Error creating ${type.toLowerCase()}:`, error);
      message.error(
        `An error occurred while creating the ${type.toLowerCase()}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewPageTitleEn("");
    setNewPageTitleBn("");
    setNewSlug("");
    setIsAltTitleManuallyEdited(false);
    onCancel();
  };

  const generateSlug = () => {
    if (newPageTitleEn.trim() === "") {
      message.info("Please enter the title first.");
      return;
    }
    const slug = newPageTitleEn.trim().toLowerCase().replace(/\s+/g, "-");
    setNewSlug(slug);
  };

  return (
    <Modal
      open={visible}
      title={`Create New ${type}`}
      onCancel={handleCancel}
      footer={null}
      centered
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder={`${type} Title`}
            value={newPageTitleEn}
            onChange={(e) => setNewPageTitleEn(e.target.value)}
            className="text-lg"
          />
        </Col>
        <Col span={24}>
          <Input
            placeholder={`${type} Alt Title`}
            value={newPageTitleBn}
            onChange={(e) => {
              setNewPageTitleBn(e.target.value);
              setIsAltTitleManuallyEdited(true);
            }}
            className="text-lg"
          />
        </Col>
        {type !== "Footer" && (
          <Col span={24}>
            <div className="flex gap-2 items-center">
              <Input
                placeholder={`${type} Slug (e.g., about-us)`}
                className="text-lg"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
              />
              <Button onClick={generateSlug} className="mavebutton">
                Generate
              </Button>
            </div>
            <span className="text-xs text-gray-500">
              *Use only lowercase letters, numbers, and hyphens.
            </span>
          </Col>
        )}
        <Col span={24} className="flex justify-end gap-2">
          <Button
            onClick={handleCreatePage}
            icon={<PlusCircleOutlined />}
            loading={loading}
            className="mavebutton"
          >
            Create {type}
          </Button>
          <Button
            onClick={handleCancel}
            icon={<CloseCircleOutlined />}
            className="mavecancelbutton"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};

export default CreatePageModal;
