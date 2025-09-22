import React from "react";
import { Row, Col, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TestimonialItem from "./TestimonialItem";
import { Typography } from "antd";

const { Paragraph } = Typography;

const TestimonialDisplay = ({
  testimonials,
  layout,
  font,
  color,
  background,
  handleEditTestimonial,
  handleDeleteTestimonial,
  handleEditAltContent,
  preview,
  containerStyle,
  isEditMode,
  showAltContent,
  getDisplayContent,
}) => {
  const renderTestimonialGrid = () => {
    return (
      <Row gutter={[16, 16]}>
        {testimonials.map((testimonial, index) => (
          <Col
            key={index}
            xs={24}
            sm={layout === "grid" ? 12 : 24}
            md={layout === "grid" ? 12 : 24}
            lg={layout === "grid" ? 12 : 24}
          >
            <TestimonialItem
              testimonial={testimonial}
              onEdit={() => handleEditTestimonial(testimonial, index)}
              onDelete={() => handleDeleteTestimonial(testimonial.id)}
              onEditAltContent={handleEditAltContent}
              font={font}
              color={color}
              background={background}
              preview={preview}
              isEditMode={isEditMode}
              showAltContent={showAltContent}
              getDisplayContent={getDisplayContent}
              testimonialIndex={index}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const renderTestimonialList = () => {
    return (
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <TestimonialItem
            key={index}
            testimonial={testimonial}
            onEdit={() => handleEditTestimonial(testimonial, index)}
            onDelete={() => handleDeleteTestimonial(testimonial.id)}
            onEditAltContent={handleEditAltContent}
            font={font}
            color={color}
            background={background}
            preview={preview}
            isEditMode={isEditMode}
            showAltContent={showAltContent}
            getDisplayContent={getDisplayContent}
            testimonialIndex={index}
          />
        ))}
      </div>
    );
  };

  if (testimonials.length === 0) {
    return !preview ? (
      <Paragraph className="text-center">
        No testimonials added. Click "Add Testimonial" to get started.
      </Paragraph>
    ) : null;
  }

  return (
    <div style={containerStyle}>
      {layout === "grid" ? renderTestimonialGrid() : renderTestimonialList()}
    </div>
  );
};

export default TestimonialDisplay;
