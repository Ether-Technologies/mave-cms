import React from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Progress,
  Badge,
  Table,
} from "antd";
import {
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const OrderDetailsModal = ({ visible, order, onClose }) => {
  if (!order) return null;

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'BDT'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      succeeded: 'green',
      cancelled: 'red',
      paid: 'green',
      partial_paid: 'orange',
      partial_payment: 'orange',
      full_payment: 'blue',
      unpaid: 'red',
      processing: 'blue'
    };
    return colors[status] || 'default';
  };

  const getPaymentStatusText = (record) => {
    const { payment_status, payment_type, paid_amount, remaining_amount } = record;
    
    if (payment_type === 'partial_payment') {
      if (payment_status === 'paid' && remaining_amount === 0) {
        return 'Fully Paid';
      } else if (paid_amount > 0 && remaining_amount > 0) {
        return 'Partially Paid';
      } else {
        return 'Payment Pending';
      }
    } else {
      return payment_status === 'paid' ? 'Fully Paid' : 'Payment Pending';
    }
  };

  const isPartialPayment = order.payment_type === 'partial_payment';
  const paidAmount = order.paid_amount || 0;
  const remainingAmount = order.remaining_amount || 0;
  const totalAmount = order.total_amount || order.payable_amount;
  const progressPercent = totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

  const orderItemsColumns = [
    {
      title: "Package",
      dataIndex: ["package", "name"],
      key: "package_name",
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary">ID: {record.package_id}</Text>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <Text>{quantity}</Text>,
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price, record) => (
        <Text>{formatCurrency(price, record.unit_currency)}</Text>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price, record) => (
        <Text strong>{formatCurrency(price, record.unit_currency)}</Text>
      ),
    },
  ];

  return (
    <Modal
      title={
        <Space>
          <ShoppingCartOutlined />
          <span>Order Details - #{order.id}</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={900}
      destroyOnClose
    >
      <div style={{ padding: '16px 0' }}>
        {/* Order Summary Card */}
        <Card title="Order Summary" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  {formatCurrency(totalAmount, order.currency)}
                </Title>
                <Text type="secondary">Total Amount</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                  {formatCurrency(paidAmount, order.currency)}
                </Title>
                <Text type="secondary">Amount Paid</Text>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                <Title level={4} style={{ margin: 0, color: remainingAmount > 0 ? '#ff4d4f' : '#52c41a' }}>
                  {formatCurrency(totalAmount-paidAmount, order.currency)}
                </Title>
                <Text type="secondary">Amount Due</Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Payment Progress for Partial Payments */}
        {isPartialPayment && (
          <Card title="Payment Progress" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Progress
                percent={progressPercent}
                status={progressPercent >= 100 ? 'success' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f6ffed', borderRadius: 4 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16, marginRight: 8 }} />
                  <Text strong style={{ color: '#52c41a' }}>
                    Paid: {formatCurrency(paidAmount, order.currency)}
                  </Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'center', padding: '8px', backgroundColor: remainingAmount > 0 ? '#fff2f0' : '#f6ffed', borderRadius: 4 }}>
                  {remainingAmount > 0 ? (
                    <>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 16, marginRight: 8 }} />
                      <Text strong style={{ color: '#ff4d4f' }}>
                        Due: {formatCurrency(totalAmount-paidAmount, order.currency)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16, marginRight: 8 }} />
                      <Text strong style={{ color: '#52c41a' }}>
                        Fully Paid
                      </Text>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* Order Information */}
        <Card title="Order Information" style={{ marginBottom: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Order ID">
              <Text code>#{order.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
              <Text code>{order.transaction_id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Order Status">
              <Badge 
                status={order.order_status === 'succeeded' ? 'success' : 'processing'} 
                text={<Tag color={getStatusColor(order.order_status)}>{order.order_status?.toUpperCase()}</Tag>}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status">
              <Badge 
                status={getPaymentStatusText(order) === 'Fully Paid' ? 'success' : 'processing'} 
                text={<Tag color={getStatusColor(order.payment_status)}>{getPaymentStatusText(order)}</Tag>}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Payment Type">
              <Tag color={getStatusColor(order.payment_type)}>
                {order.payment_type?.replace('_', ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Currency">
              <Text strong>{order.currency}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Created Date">
              <Space>
                <CalendarOutlined />
                <Text>{new Date(order.created_at).toLocaleDateString()}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Created Time">
              <Text>{new Date(order.created_at).toLocaleTimeString()}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Customer Information */}
        <Card title="Customer Information" style={{ marginBottom: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Customer Name">
              <Space>
                <UserOutlined />
                <Text strong>{order.user?.name || 'N/A'}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Text>{order.user?.email || 'N/A'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Age">
              <Text>{order.age || 'N/A'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Nationality">
              <Text>{order.nationality || 'N/A'}</Text>
            </Descriptions.Item>
            {order.notes && (
              <Descriptions.Item label="Notes" span={2}>
                <Text>{order.notes}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <Card title="Order Items">
            <Table
              columns={orderItemsColumns}
              dataSource={order.items}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
