// components/PageBuilder/Components/GoogleMapComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, message, Popconfirm, Input } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import GoogleMapSelectionModal from "../Modals/GoogleMapSelectionModal/GoogleMapSelectionModal";

const { Paragraph } = Typography;

const GoogleMapComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false, // New prop with default value
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mapData, setMapData] = useState(component._mave || {});

  useEffect(() => {
    setMapData(component._mave || {});
  }, [component._mave]);

  const handleSelectMap = (newMapData) => {
    updateComponent({
      ...component,
      _mave: newMapData,
      id: component._id,
    });
    setMapData(newMapData);
    setIsModalVisible(false);
    message.success("Google Map updated successfully.");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this map?",
      onOk: deleteComponent,
      okText: "Yes",
      cancelText: "No",
    });
  };

  const getEmbedUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      message.error("Google Maps API key is not set.");
      return "";
    }

    if (
      mapData.coordinates &&
      mapData.coordinates.lat &&
      mapData.coordinates.lng
    ) {
      return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${
        mapData.coordinates.lat
      },${mapData.coordinates.lng}&zoom=${mapData.zoom || 8}`;
    }

    return "";
  };

  if (preview) {
    return (
      <div className="preview-google-map-component p-4 bg-gray-100 rounded-md">
        {mapData.mapUrl ? (
          getEmbedUrl() ? (
            <div
              className="map-container"
              style={{ width: "100%", height: "400px" }}
            >
              <iframe
                src={getEmbedUrl()}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          ) : (
            <Paragraph>
              Unable to load map. Please check your API key and map
              configuration.
            </Paragraph>
          )
        ) : (
          <Paragraph className="text-gray-500">No map configured.</Paragraph>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      {/* Header with Component Title and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Google Map Component</h3>
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="mr-2"
            disabled={preview}
          />
          <Popconfirm
            title="Are you sure you want to delete this map?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              className="mavecancelbutton"
              danger
              disabled={preview}
            />
          </Popconfirm>
        </div>
      </div>

      {/* Map Display */}
      {mapData.mapUrl ? (
        getEmbedUrl() ? (
          <div
            className="map-container"
            style={{ width: "100%", height: "400px" }}
          >
            <iframe
              src={getEmbedUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        ) : (
          <Paragraph>
            Unable to load map. Please check your API key and map configuration.
          </Paragraph>
        )
      ) : (
        <Paragraph>No map configured.</Paragraph>
      )}

      {/* Google Map Selection Modal */}
      {!preview && (
        <GoogleMapSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectMap={handleSelectMap}
          initialMap={mapData}
        />
      )}
    </div>
  );
};

export default GoogleMapComponent;
