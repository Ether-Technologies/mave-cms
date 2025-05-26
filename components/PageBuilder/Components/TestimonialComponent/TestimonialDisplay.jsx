import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
  preview,
  containerStyle,
}) => {
  const sliderSettings = {
    dots: true,
    infinite: testimonials.length > 3,
    speed: 500,
    slidesToShow: testimonials.length >= 3 ? 3 : testimonials.length,
    slidesToScroll: 1,
    autoplay: !preview,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (testimonials.length === 0) {
    return !preview ? (
      <Paragraph className="text-center">
        No testimonials added. Click "Add Testimonial" to get started.
      </Paragraph>
    ) : null;
  }

  return layout === "carousel" ? (
    <div style={preview ? {} : containerStyle}>
      <Slider {...sliderSettings}>
        {testimonials.map((testimonial) => (
          <TestimonialItem
            key={testimonial.id}
            testimonial={testimonial}
            onEdit={() => handleEditTestimonial(testimonial)}
            onDelete={() => handleDeleteTestimonial(testimonial.id)}
            font={font}
            color={color}
            background={background}
            preview={preview}
          />
        ))}
      </Slider>
    </div>
  ) : (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      style={preview ? {} : containerStyle}
    >
      {testimonials.map((testimonial) => (
        <TestimonialItem
          key={testimonial.id}
          testimonial={testimonial}
          onEdit={() => handleEditTestimonial(testimonial)}
          onDelete={() => handleDeleteTestimonial(testimonial.id)}
          font={font}
          color={color}
          background={background}
          preview={preview}
        />
      ))}
    </div>
  );
};

export default TestimonialDisplay;
