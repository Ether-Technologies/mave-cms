// components/PageBuilder/Modals/VideoSelectionModal.jsx

import React, { useState } from "react";
import { Modal, Form, Input, Checkbox, Select, message } from "antd";
import {
  getGoogleDriveEmbedUrl,
  isGoogleDriveUrl,
} from "../../../utils/googleDrive";

const { Option } = Select;

const VideoSelectionModal = ({
  isVisible,
  onClose,
  onSelectVideo,
  initialVideo,
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const embedUrl = getEmbedUrl(values.url);
        if (!embedUrl) {
          message.error(
            "Unsupported video URL. Please use YouTube, Vimeo, Google Drive, or direct video links."
          );
          return;
        }
        onSelectVideo({
          url: values.url,
          settings: {
            autoplay: values.autoplay || false,
            loop: values.loop || false,
            controls: values.controls !== undefined ? values.controls : true,
            aspectRatio: values.aspectRatio || "16/9",
          },
        });
        form.resetFields();
        onClose();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const getEmbedUrl = (url) => {
    // Check for Google Drive URL first
    if (isGoogleDriveUrl(url)) {
      return getGoogleDriveEmbedUrl(url);
    }

    const youtubeMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^\s&]+)/
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video link
    if (url.match(/\.(mp4|webm|ogg)$/)) {
      return url;
    }

    return null;
  };

  return (
    <Modal
      title="Select Video"
      open={isVisible}
      onOk={handleOk}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      okText="Save"
      cancelText="Cancel"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          url: initialVideo?.url || "",
          autoplay: initialVideo?.settings?.autoplay || false,
          loop: initialVideo?.settings?.loop || false,
          controls:
            initialVideo?.settings?.controls !== undefined
              ? initialVideo.settings.controls
              : true,
          aspectRatio: initialVideo?.settings?.aspectRatio || "16/9",
        }}
      >
        <Form.Item
          name="url"
          label="Video URL"
          rules={[
            { required: true, message: "Please enter a video URL." },
            {
              validator: (_, value) => {
                if (value && getEmbedUrl(value) !== null) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(
                    "Unsupported video URL. Please use YouTube, Vimeo, Google Drive, or direct video links."
                  )
                );
              },
            },
          ]}
        >
          <Input placeholder="Enter YouTube, Vimeo, Google Drive, or direct video URL" />
        </Form.Item>

        <Form.Item label="Video Settings">
          <Form.Item name="autoplay" valuePropName="checked" noStyle>
            <Checkbox>Autoplay</Checkbox>
          </Form.Item>
          <Form.Item
            name="loop"
            valuePropName="checked"
            noStyle
            style={{ marginLeft: 16 }}
          >
            <Checkbox>Loop</Checkbox>
          </Form.Item>
          <Form.Item
            name="controls"
            valuePropName="checked"
            noStyle
            style={{ marginLeft: 16 }}
          >
            <Checkbox>Show Controls</Checkbox>
          </Form.Item>
        </Form.Item>

        <Form.Item name="aspectRatio" label="Aspect Ratio">
          <Select showSearch>
            <Option value="16/9">16:9</Option>
            <Option value="4/3">4:3</Option>
            <Option value="1/1">1:1</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VideoSelectionModal;
