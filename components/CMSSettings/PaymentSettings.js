// components/CMSSettings/PaymentSettings.js

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
  Switch,
  Select,
  InputNumber,
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const PaymentSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "payment-settings",
        config: {
          name: "Payment Settings",
          description: "Payment Settings for MAVE",
          ...values,
        },
      });
      message.success("Payment Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Payment Settings:", error);
      message.error("Failed to update Payment Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Payment Settings
          </Title>
          <Tooltip title="Configure your payment settings">
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          </Tooltip>
        </Space>
      }
      className="max-w-4xl mx-auto"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="paymentEnabled"
              label="Payment Processing"
              valuePropName="checked"
              extra={<Text type="secondary">Enable payment processing</Text>}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="paymentGateway"
              label="Payment Gateway"
              dependencies={["paymentEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("paymentEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select payment gateway")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">Select your payment processor</Text>
              }
            >
              <Select placeholder="Select payment gateway">
                <Option value="stripe">Stripe</Option>
                <Option value="paypal">PayPal</Option>
                <Option value="square">Square</Option>
                <Option value="authorize">Authorize.net</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: "Currency is required." }]}
              extra={
                <Text type="secondary">Default currency for payments</Text>
              }
            >
              <Select placeholder="Select currency">
                <Option value="usd">USD ($)</Option>
                <Option value="eur">EUR (€)</Option>
                <Option value="gbp">GBP (£)</Option>
                <Option value="jpy">JPY (¥)</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="taxEnabled"
              label="Tax Calculation"
              valuePropName="checked"
              extra={<Text type="secondary">Enable tax calculation</Text>}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="taxRate"
              label="Tax Rate"
              dependencies={["taxEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("taxEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please enter tax rate"));
                  },
                }),
              ]}
              extra={<Text type="secondary">Tax rate in percentage</Text>}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Enter tax rate"
                className="w-full"
                formatter={(value) => `${value}%`}
                parser={(value) => value.replace("%", "")}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="minimumAmount"
              label="Minimum Amount"
              rules={[
                { required: true, message: "Minimum amount is required." },
              ]}
              extra={<Text type="secondary">Minimum payment amount</Text>}
            >
              <InputNumber
                min={0}
                placeholder="Enter minimum amount"
                className="w-full"
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="refundEnabled"
              label="Refund Processing"
              valuePropName="checked"
              extra={<Text type="secondary">Enable refund processing</Text>}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="refundPeriod"
              label="Refund Period"
              dependencies={["refundEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("refundEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter refund period")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Days allowed for refunds</Text>}
            >
              <InputNumber
                min={0}
                max={90}
                placeholder="Enter refund period"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PaymentSettings;
