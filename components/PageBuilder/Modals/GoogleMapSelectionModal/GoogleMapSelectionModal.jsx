// components/PageBuilder/Modals/GoogleMapSelectionModal/GoogleMapSelectionModal.jsx

import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";

const GoogleMapSelectionModal = ({
  isVisible,
  onClose,
  onSelectMap,
  initialMap,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isVisible) {
      form.setFieldsValue({
        mapUrl: initialMap.mapUrl || "",
        zoom: initialMap.zoom || 8,
        altTitle: initialMap.altTitle || "",
      });
    } else {
      form.resetFields();
    }
  }, [isVisible, initialMap, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const { mapUrl, zoom, altTitle } = values;

        // Validate the URL
        try {
          const url = new URL(mapUrl);
          if (
            !url.hostname.includes("google.com") &&
            !url.hostname.includes("maps.app.goo.gl")
          ) {
            message.error("Please enter a valid Google Maps URL.");
            return;
          }
        } catch (error) {
          message.error("Please enter a valid URL.");
          return;
        }

        // Extract coordinates from the URL
        let coordinates = {};
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = mapUrl.match(regex);
        if (match) {
          coordinates = {
            lat: parseFloat(match[1]),
            lng: parseFloat(match[2]),
          };
        } else {
          message.warning(
            "Coordinates not found in the URL. Please ensure the URL contains latitude and longitude."
          );
        }

        const mapData = {
          mapUrl,
          zoom,
          coordinates,
          altTitle: altTitle || "",
          markers: initialMap.markers || [],
        };

        onSelectMap(mapData);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Configure Google Map"
      open={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      width={600}
      okText="Save Map"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="mapUrl"
          label="Google Maps URL"
          rules={[
            { required: true, message: "Please enter a Google Maps URL." },
            { type: "url", message: "Please enter a valid URL." },
          ]}
        >
          <Input placeholder="Enter Google Maps URL" />
        </Form.Item>

        <Form.Item
          name="zoom"
          label="Zoom Level"
          rules={[
            {
              required: true,
              message: "Please enter the zoom level.",
            },
            {
              type: "number",
              min: 0,
              max: 21,
              message: "Zoom level must be between 0 and 21.",
              transform: (value) => Number(value),
            },
          ]}
        >
          <Input type="number" placeholder="Enter zoom level (0-21)" />
        </Form.Item>

        <Form.Item name="altTitle" label="Alternative Title">
          <Input placeholder="Enter alternative title (optional)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GoogleMapSelectionModal;
