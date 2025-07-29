// components/PageBuilder/PagePreview.jsx

import React, { useState, useEffect } from "react";
import { Typography, Spin, message, Modal } from "antd";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import ComponentRenderer from "./Components/ComponentRenderer";

const { Title } = Typography;

const PagePreview = ({ pageId, pageData: propPageData, open, setOpen }) => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use propPageData if provided, otherwise fetch from API
  const finalPageData = propPageData || pageData;

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/pages/${pageId}`);
        setPageData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching page data:", error);
        message.error("Failed to load page preview");
        setLoading(false);
      }
    };

    // Only fetch if no propPageData is provided
    if (pageId && !propPageData) {
      fetchPageData();
    } else if (propPageData) {
      setLoading(false);
    }
  }, [pageId, propPageData]);

  const handleBack = () => {
    router.push("/pages");
  };

  const handleEditPage = () => {
    router.push(`/page-builder/${pageId}?edit=true`);
  };

  // If used as modal, render modal content
  if (open !== undefined) {
    if (loading) {
      return (
        <Modal
          title="Page Preview"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          width="90%"
          style={{ top: 20 }}
        >
          <div className="flex items-center justify-center h-64">
            <Spin size="large" />
          </div>
        </Modal>
      );
    }

    if (!finalPageData) {
      return (
        <Modal
          title="Page Preview"
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          width="90%"
          style={{ top: 20 }}
        >
          <div className="flex items-center justify-center h-64">
            <Typography.Text>Page not found</Typography.Text>
          </div>
        </Modal>
      );
    }

    return (
      <Modal
        title={`Preview: ${finalPageData.page_name_en || "Page Preview"}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: "80vh", overflow: "auto" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Render each section with preview mode */}
            {finalPageData.body && finalPageData.body.length > 0 ? (
              finalPageData.body.map((section, sectionIndex) => (
                <div key={section._id || sectionIndex} className="section mb-8">
                  {section.sectionTitle && (
                    <Title
                      level={4}
                      style={{ fontFamily: section.font || "Arial" }}
                      className="mb-4"
                    >
                      {section.sectionTitle}
                    </Title>
                  )}
                  {/* Render components within the section */}
                  {section.data && section.data.length > 0 ? (
                    section.data.map((component, compIndex) => (
                      <div className="mb-4" key={component?._id || compIndex}>
                        <ComponentRenderer
                          component={component}
                          index={compIndex}
                          components={section.data}
                          sectionIndex={sectionIndex}
                          preview={true}
                        />
                      </div>
                    ))
                  ) : (
                    <Typography.Paragraph className="text-gray-500">
                      No components in this section.
                    </Typography.Paragraph>
                  )}
                </div>
              ))
            ) : (
              <Typography.Paragraph className="text-gray-500">
                No sections available for preview.
              </Typography.Paragraph>
            )}
          </div>
        </div>
      </Modal>
    );
  }

  // Original standalone page functionality
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!finalPageData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Typography.Text>Page not found</Typography.Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftOutlined className="text-gray-600" />
              </button>
              <Title level={3} className="mb-0">
                Preview: {finalPageData.page_name_en}
              </Title>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">Preview Mode</div>
              <button
                onClick={handleEditPage}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
              >
                <EditOutlined />
                Edit Page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Render each section with preview mode */}
          {finalPageData.body && finalPageData.body.length > 0 ? (
            finalPageData.body.map((section, sectionIndex) => (
              <div key={section._id || sectionIndex} className="section mb-8">
                {section.sectionTitle && (
                  <Title
                    level={4}
                    style={{ fontFamily: section.font || "Arial" }}
                    className="mb-4"
                  >
                    {section.sectionTitle}
                  </Title>
                )}
                {/* Render components within the section */}
                {section.data && section.data.length > 0 ? (
                  section.data.map((component, compIndex) => (
                    <div className="mb-4" key={component?._id || compIndex}>
                      <ComponentRenderer
                        component={component}
                        index={compIndex}
                        components={section.data}
                        sectionIndex={sectionIndex}
                        preview={true}
                      />
                    </div>
                  ))
                ) : (
                  <Typography.Paragraph className="text-gray-500">
                    No components in this section.
                  </Typography.Paragraph>
                )}
              </div>
            ))
          ) : (
            <Typography.Paragraph className="text-gray-500">
              No sections available for preview.
            </Typography.Paragraph>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
