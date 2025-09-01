import React from "react";
import {
  Modal,
  Descriptions,
  Button,
  Image,
  Tag,
  Divider,
} from "antd";
import {
  EditOutlined,
  CloseOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const PackageViewModal = ({ visible, pkg, onCancel, onEdit, currentUser }) => {
  if (!pkg) return null;

  // Allow users with role_id "1" (admin) or "2" to edit packages
  const canEdit = currentUser?.role_id === "1" || currentUser?.role_id === "2";

  const formatPrice = (price, currency) => {
    const currencySymbols = {
      'BDT': '৳',
      'USD': '$'
    };
    return `${currencySymbols[currency] || currency} ${parseFloat(price).toFixed(2)}`;
  };

  const getPartialPaymentInfo = () => {
    if (!pkg.partial_payment_allowed) {
      return (
        <div>
          <Tag color="red">Full Payment Required</Tag>
          <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
            Customer must pay the full amount: {formatPrice(pkg.price, pkg.currency)}
          </div>
        </div>
      );
    }

    if (pkg.partial_payment_type === 'fixed') {
      return (
        <div>
          <Tag color="green">Partial Payment (Fixed Amount)</Tag>
          <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
            Partial payment: {formatPrice(pkg.partial_payment_amount, pkg.currency)}
            <br />
            Remaining: {formatPrice(pkg.price - pkg.partial_payment_amount, pkg.currency)}
          </div>
        </div>
      );
    } else if (pkg.partial_payment_type === 'percentage') {
      const partialAmount = (pkg.price * pkg.partial_payment_percentage) / 100;
      const remainingAmount = pkg.price - partialAmount;
      return (
        <div>
          <Tag color="blue">Partial Payment ({pkg.partial_payment_percentage}%)</Tag>
          <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
            Partial payment: {formatPrice(partialAmount, pkg.currency)} ({pkg.partial_payment_percentage}%)
            <br />
            Remaining: {formatPrice(remainingAmount, pkg.currency)} ({100 - pkg.partial_payment_percentage}%)
          </div>
        </div>
      );
    }

    return <Tag color="orange">Partial Payment (Unknown Type)</Tag>;
  };

  return (
    <Modal
      title="Package Details"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel} icon={<CloseOutlined />}>
          Close
        </Button>,
        canEdit && (
          <Button
            key="edit"
            type="primary"
            onClick={onEdit}
            icon={<EditOutlined />}
            style={{
              backgroundColor: "var(--maveyellow)",
              borderColor: "var(--maveyellow)",
            }}
          >
            Edit
          </Button>
        ),
      ].filter(Boolean)}
      width={900}
    >
      <div style={{ marginBottom: 20 }}>
        <Image
          src={pkg.image || "/images/ui/default-package.png"}
          alt={pkg.name}
          style={{
            width: 200,
            height: 200,
            objectFit: "cover",
            borderRadius: 8,
          }}
          fallback="/images/ui/default-package.png"
        />
      </div>

      <Descriptions
        bordered
        column={1}
        size="middle"
        labelStyle={{
          fontWeight: "bold",
          backgroundColor: "#fafafa",
        }}
      >
        <Descriptions.Item label="Package ID">
          {pkg.id}
        </Descriptions.Item>

        <Descriptions.Item label="Name">
          <span style={{ fontWeight: 500, fontSize: "16px" }}>
            {pkg.name}
          </span>
        </Descriptions.Item>

        <Descriptions.Item label="Description">
          <div
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              lineHeight: "1.6",
              color: "#333",
            }}
          >
            {pkg.description}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Price">
          <div style={{ fontSize: "16px", fontWeight: 500 }}>
            {formatPrice(pkg.price, pkg.currency)}
          </div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: 4 }}>
            Currency: {pkg.currency}
          </div>
        </Descriptions.Item>

        <Descriptions.Item label="Category">
          {pkg.category ? (
            <Tag color="blue">{pkg.category.name}</Tag>
          ) : (
            <Tag color="default">#{pkg.category_id}</Tag>
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Payment Options">
          {getPartialPaymentInfo()}
        </Descriptions.Item>

        <Descriptions.Item label="View Details Link">
          {pkg.view_details_link ? (
            <a href={pkg.view_details_link} target="_blank" rel="noopener noreferrer">
              {pkg.view_details_link}
            </a>
          ) : (
            "No link provided"
          )}
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {new Date(pkg.created_at).toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label="Last Updated">
          {new Date(pkg.updated_at).toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label="Image URL">
          <div
            style={{
              wordBreak: "break-all",
              fontSize: "12px",
              color: "#666",
            }}
          >
            {pkg.image || "No image uploaded"}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PackageViewModal;
