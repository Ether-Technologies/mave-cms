// components/PageBuilder/Modals/FooterSelectionModal.jsx

import React, { useState, useEffect } from "react";
import { Modal, List, Button, Image, Typography, message } from "antd";
import instance from "../../../axios";

const { Paragraph } = Typography;

const FooterSelectionModal = ({ isVisible, onClose, onSelectFooter }) => {
  const [footerList, setFooterList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const fetchFooters = async () => {
        setLoading(true);
        try {
          const response = await instance.get("/pages");
          // setFooterList(response.data);
          const footers = response.data.filter(
            (page) =>
              page.type === "Footer" && page.additional[0].pageType === "Footer"
          );
          setFooterList(footers);
        } catch (error) {
          message.error("Failed to fetch footers");
        }
        setLoading(false);
      };
      fetchFooters();
    }
  }, [isVisible]);

  return (
    <Modal
      title="Select Footer"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <List
        loading={loading}
        dataSource={footerList}
        renderItem={(item) => (
          <List.Item onClick={() => onSelectFooter(item)}>
            <div className="flex items-center justify-between bg-theme px-6 py-2 w-full text-center rounded-md cursor-pointer">
              {item.page_name_en}
            </div>
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default FooterSelectionModal;
