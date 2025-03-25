// components/PageBuilder/PagePreview.jsx

import React from "react";
import { Drawer, Typography } from "antd";
import ComponentRenderer from "./Components/ComponentRenderer";

const { Title } = Typography;

const PagePreview = ({ pageData, open, setOpen }) => {
  if (!pageData) return null;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      title="Page Preview"
      open={open}
      onClose={handleClose}
      footer={null}
      width="70%"
      style={{ top: 20 }}
      className="preview-container"
      destroyOnClose
    >
      <div className="preview-content">
        {/* Render each section with preview mode */}
        {pageData.body && pageData.body.length > 0 ? (
          pageData.body.map((section, index) => (
            <div key={section._id || index} className="mb-8">
              {section.sectionTitle && (
                <Title
                  level={4}
                  style={{ fontFamily: section.font || "Arial" }}
                >
                  {section.sectionTitle}
                </Title>
              )}
              {/* Render components within the section */}
              {section.data && section.data.length > 0 ? (
                section.data.map((component, compIndex) => (
                  <ComponentRenderer
                    key={component._id || compIndex}
                    component={component}
                    index={compIndex}
                    components={section.data}
                    setComponents={() => {}} // No-op since it's read-only
                    preview={true} // Set preview mode
                  />
                ))
              ) : (
                <Typography.Paragraph>
                  No components in this section.
                </Typography.Paragraph>
              )}
            </div>
          ))
        ) : (
          <Typography.Paragraph>
            No sections available for preview.
          </Typography.Paragraph>
        )}
      </div>
    </Drawer>
  );
};

export default PagePreview;
