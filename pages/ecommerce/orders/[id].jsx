import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, Descriptions, Tag, Progress, Image, Divider, Spin, Alert, Button } from "antd";
import { ArrowLeftOutlined, DollarOutlined, ShoppingOutlined, CalendarOutlined } from "@ant-design/icons";
import { ordersApi } from "../../../utils/orderApi";
import Head from "next/head";

const PublicOrderDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getPublicById(id);
      if (response.success) {
        setOrder(response.order);
      } else {
        setError(response.message || "Failed to fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to load order details. Please check the order ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'orange',
      'processing': 'blue',
      'completed': 'green',
      'cancelled': 'red',
      'refunded': 'purple'
    };
    return statusColors[status?.toLowerCase()] || 'default';
  };

  const getPaymentStatusColor = (status) => {
    const paymentColors = {
      'pending': 'orange',
      'paid': 'green',
      'failed': 'red',
      'refunded': 'purple',
      'partially_paid': 'blue'
    };
    return paymentColors[status?.toLowerCase()] || 'default';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => router.back()}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Alert
          message="Order Not Found"
          description="The order you're looking for doesn't exist or has been removed."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={() => router.back()}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Details - {order.transaction_id || order.id}</title>
        <meta name="description" content="View order details and status" />
      </Head>
      
      <div style={{ 
        padding: '20px', 
        maxWidth: '1000px', 
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          style={{ marginBottom: '20px' }}
        >
          Back
        </Button>

        <Card 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingOutlined />
              <span>Order Details</span>
              <Tag color="blue">{order.transaction_id || `Order #${order.id}`}</Tag>
            </div>
          }
          style={{ marginBottom: '20px' }}
        >
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Order ID" span={1}>
              {order.id}
            </Descriptions.Item>
            <Descriptions.Item label="Transaction ID" span={1}>
              {order.transaction_id || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Order Status" span={1}>
              <Tag color={getStatusColor(order.order_status)}>
                {order.order_status?.replace('_', ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Payment Status" span={1}>
              <Tag color={getPaymentStatusColor(order.payment_status)}>
                {order.payment_status?.replace('_', ' ').toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Order Date" span={1}>
              <CalendarOutlined style={{ marginRight: '5px' }} />
              {formatDate(order.created_at)}
            </Descriptions.Item>
            <Descriptions.Item label="Last Updated" span={1}>
              <CalendarOutlined style={{ marginRight: '5px' }} />
              {formatDate(order.updated_at)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Payment Progress */}
        <Card title="Payment Progress" style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <Progress 
              percent={order.payment_progress || 0} 
              status={order.is_fully_paid ? "success" : order.is_partially_paid ? "active" : "exception"}
              format={(percent) => `${percent}%`}
            />
          </div>
          <Descriptions column={3} bordered>
            <Descriptions.Item label="Total Amount">
              <DollarOutlined style={{ marginRight: '5px' }} />
              {formatCurrency(order.payable_amount, order.currency)}
            </Descriptions.Item>
            <Descriptions.Item label="Paid Amount">
              <DollarOutlined style={{ marginRight: '5px' }} />
              {formatCurrency(order.paid_amount || 0, order.currency)}
            </Descriptions.Item>
            <Descriptions.Item label="Remaining Amount">
              <DollarOutlined style={{ marginRight: '5px' }} />
              {formatCurrency(order.remaining_amount || 0, order.currency)}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Order Items */}
        <Card title="Order Items" style={{ marginBottom: '20px' }}>
          {order.items && order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={item.id || index}>
                <Card 
                  size="small" 
                  style={{ marginBottom: '10px' }}
                  bodyStyle={{ padding: '15px' }}
                >
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                    {item.package_image && (
                      <Image
                        width={80}
                        height={80}
                        src={item.package_image}
                        alt={item.package_name}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 5px 0' }}>{item.package_name}</h4>
                      <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
                        {item.package_description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Quantity: </span>
                          {item.quantity}
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Unit Price: </span>
                          {formatCurrency(item.unit_price, item.unit_currency)}
                        </div>
                        <div>
                          <span style={{ fontWeight: 'bold' }}>Total: </span>
                          {formatCurrency(item.total_price, item.unit_currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
                {index < order.items.length - 1 && <Divider />}
              </div>
            ))
          ) : (
            <Alert message="No items found in this order" type="info" showIcon />
          )}
        </Card>

        {/* Additional Information */}
        {order.nationality && (
          <Card title="Additional Information" style={{ marginBottom: '20px' }}>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Nationality">
                {order.nationality}
              </Descriptions.Item>
              {order.payment_type && (
                <Descriptions.Item label="Payment Type">
                  {order.payment_type.replace('_', ' ').toUpperCase()}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </div>
    </>
  );
};

export default PublicOrderDetails;
