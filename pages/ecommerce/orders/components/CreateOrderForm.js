import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ordersApi } from '../../../../utils/orderApi';

const { Option } = Select;
const { TextArea } = Input;

const CreateOrderForm = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        age: values.age,
        nationality: values.nationality,
        payment_type: values.payment_type,
        currency: values.currency,
        notes: values.notes
      };

      const response = await ordersApi.createOrder(orderData);
      message.success('Order created successfully');
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error) {
      console.error('Error creating order:', error);
      message.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Order"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          payment_type: 'full_payment',
          currency: 'BDT'
        }}
      >
        <Form.Item
          name="age"
          label="Age"
          rules={[{ required: true, message: 'Please enter age' }]}
        >
          <Input placeholder="Enter age" />
        </Form.Item>

        <Form.Item
          name="nationality"
          label="Nationality"
          rules={[{ required: true, message: 'Please enter nationality' }]}
        >
          <Input placeholder="Enter nationality" />
        </Form.Item>

        <Form.Item
          name="payment_type"
          label="Payment Type"
          rules={[{ required: true, message: 'Please select payment type' }]}
        >
          <Select placeholder="Select payment type">
            <Option value="full_payment">Full Payment</Option>
            <Option value="partial_payment">Partial Payment</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="currency"
          label="Currency"
          rules={[{ required: true, message: 'Please select currency' }]}
        >
          <Select placeholder="Select currency">
            <Option value="BDT">BDT</Option>
            <Option value="USD">USD</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="notes"
          label="Notes"
        >
          <TextArea rows={3} placeholder="Enter any additional notes" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Order
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrderForm;
