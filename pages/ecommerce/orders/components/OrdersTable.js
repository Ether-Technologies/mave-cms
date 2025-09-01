import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Popconfirm,
  message,
  Select,
  Input,
  Space,
  Modal,
  Descriptions,
  Badge,
  Tooltip,
  Card,
  Row,
  Col,
  Typography,
  Form,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  ShoppingCartOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ordersApi } from "../../../../utils/orderApi";
import OrderBulkActions from "./OrderBulkActions";
import CreateOrderForm from "./CreateOrderForm";
import OrderDetailsModal from "./OrderDetailsModal";

const { Search } = Input;
const { Text, Title } = Typography;

const OrdersTable = ({
  orders,
  fetchOrders,
  currentUser,
  loading,
  onBulkStatusUpdate,
  onBulkDelete,
  onExport,
}) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [createOrderVisible, setCreateOrderVisible] = useState(false);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setFilteredOrders(
      orders.filter(
        (order) =>
          order.transaction_id
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id?.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, orders]);

  const handleDelete = async (id) => {
    try {
      await ordersApi.delete(id);
      message.success("Order deleted successfully");
      fetchOrders();
    } catch (err) {
      message.error("Failed to delete order");
    }
  };

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await ordersApi.updateStatus(id, status);
      message.success("Order status updated successfully");
      fetchOrders();
    } catch {
      message.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const showOrderDetails = async (order) => {
    setSelectedOrder(order);
    setOrderDetailsVisible(true);
  };

  const [editPaymentVisible, setEditPaymentVisible] = useState(false);
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState(null);

  const showEditPayment = (order) => {
    setSelectedOrderForEdit(order);
    setEditPaymentVisible(true);
  };

  const handleManualPayment = async (values) => {
    try {
      console.log("Sending payment data:", {
        orderId: selectedOrderForEdit.id,
        paymentData: {
          amount: values.amount,
          currency: values.currency,
          payment_method: values.payment_method,
          notes: values.notes,
        },
      });

      const response = await ordersApi.addManualPayment(
        selectedOrderForEdit.id,
        {
          amount: parseFloat(values.amount),
          currency: values.currency,
          payment_method: values.payment_method,
          notes: values.notes,
        }
      );

      console.log("API Response:", response);

      if (response.success) {
        message.success("Payment updated successfully");
        setEditPaymentVisible(false);
        setSelectedOrderForEdit(null);
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      console.error("Error response:", error.response);
      message.error(
        error.response?.data?.message || "Failed to update payment"
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "orange",
      confirmed: "blue",
      succeeded: "green",
      cancelled: "red",
      paid: "green",
      partial_paid: "orange",
      partial_payment: "orange",
      full_payment: "blue",
      unpaid: "red",
      processing: "blue",
    };
    return colors[status] || "default";
  };

  const getPaymentStatusText = (record) => {
    const { payment_status, payment_type, paid_amount, remaining_amount } =
      record;
    console.log(record);

    if (payment_type === "partial_payment") {
      if (payment_status === "paid" && remaining_amount === 0) {
        return "Fully Paid";
      } else if (paid_amount > 0 && remaining_amount > 0) {
        return "Partially Paid";
      } else {
        return "Payment Pending";
      }
    } else {
      return payment_status === "paid" ? "Fully Paid" : "Payment Pending";
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "BDT",
    }).format(amount);
  };

  const handleRowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      setSelectedRowKeys(selectedKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.payment_status === "paid",
    }),
  };

  const selectedOrders = orders.filter((order) =>
    selectedRowKeys.includes(order.id)
  );

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      width: 80,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "user",
      render: (user) => (
        <div>
          <div>
            <Text strong>{user?.name || "N/A"}</Text>
          </div>
          <div>
            <Text type="secondary">{user?.email || "N/A"}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Transaction ID",
      dataIndex: "transaction_id",
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      render: (status, record) => {
        const statusText = getPaymentStatusText(record);
        const isPaid =
          record.payment_status === "paid" ||
          (record.payment_type === "partial_payment" && record.paid_amount > 0);
        const isFullyPaid =
          record.payment_status === "paid" ||
          (record.payment_type === "partial_payment" &&
            record.remaining_amount === 0);

        return (
          <Badge
            status={isFullyPaid ? "success" : isPaid ? "processing" : "default"}
            text={<Tag color={getStatusColor(status)}>{statusText}</Tag>}
          />
        );
      },
    },
    {
      title: "Order Status",
      dataIndex: "order_status",
      render: (status, record) => (
        <Select
          value={status}
          loading={updatingId === record.id}
          onChange={(value) => handleStatusChange(record.id, value)}
          style={{ width: 130 }}
        >
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="confirmed">Confirmed</Select.Option>
          <Select.Option value="succeeded">Succeeded</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
      ),
    },
    {
      title: "Payment Type",
      dataIndex: "payment_type",
      render: (type, record) => {
        const isPartialPayment = type === "partial_payment";

        if (isPartialPayment) {
          const paidAmount = record.paid_amount || 0;
          const totalAmount = record.total_amount || record.payable_amount;
          const progressPercent =
            totalAmount > 0 ? Math.round((paidAmount / totalAmount) * 100) : 0;

          return (
            <div>
              <Tag color={getStatusColor(type)}>
                {type?.replace("_", " ").toUpperCase()}
              </Tag>
              <div style={{ marginTop: 4 }}>
                <div
                  style={{
                    width: "100%",
                    height: 4,
                    backgroundColor: "#f0f0f0",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: "100%",
                      backgroundColor:
                        progressPercent >= 100 ? "#52c41a" : "#1890ff",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  {progressPercent}% Complete
                </Text>
              </div>
            </div>
          );
        }

        return (
          <Tag color={getStatusColor(type)}>
            {type?.replace("_", " ").toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Payment Details",
      dataIndex: "payable_amount",
      render: (amount, record) => {
        const isPartialPayment = record.payment_type === "partial_payment";
        const paidAmount = record.paid_amount || 0;
        const totalAmount = record.total_amount || amount;

        return (
          <div style={{ minWidth: 120 }}>
            {/* Total Amount */}
            <div style={{ marginBottom: 4 }}>
              <Text strong>
                Total: {formatCurrency(totalAmount, record.currency)}
              </Text>
            </div>

            {/* Payable Amount */}
            <div style={{ marginBottom: 4 }}>
              <Text type="secondary">
                Payable: {formatCurrency(amount, record.currency)}
              </Text>
            </div>

            {/* For Partial Payments - Show Paid Amount */}
            {isPartialPayment && (
              <div style={{ marginBottom: 2 }}>
                <Text type="success" style={{ fontSize: "12px" }}>
                  ✓ Paid: {formatCurrency(paidAmount, record.currency)}
                </Text>
              </div>
            )}

            {/* For Full Payments - Show if paid or pending */}
            {!isPartialPayment && (
              <div>
                <Text
                  type={
                    record.payment_status === "paid" ? "success" : "warning"
                  }
                  style={{ fontSize: "12px" }}
                >
                  {record.payment_status === "paid"
                    ? "✓ Fully Paid"
                    : "⏳ Payment Pending"}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Due Amount",
      dataIndex: "remaining_amount",
      render: (remainingAmount, record) => {
        const totalAmount = record.total_amount;
        const paidAmount = record.paid_amount || 0;
        const dueAmount = totalAmount - paidAmount;
        console.log(dueAmount);

        // For partial payments, use the remaining_amount if available
        const finalDueAmount =
          record.payment_type === "partial_payment" &&
          remainingAmount !== undefined
            ? remainingAmount
            : dueAmount;

        const isPaid = record.payment_status === "paid" || finalDueAmount <= 0;

        return (
          <div style={{ minWidth: 120 }}>
            <div style={{ marginBottom: 4 }}>
              <Text
                strong
                type={isPaid ? "success" : "danger"}
                style={{ fontSize: "14px" }}
              >
                {formatCurrency(dueAmount, record.currency)}
              </Text>
            </div>

            {/* For partial payments, show additional info */}
            {record.payment_type === "partial_payment" &&
              record.paid_amount > 0 && (
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: "11px" }}>
                    {record.paid_amount > 0
                      ? `${formatCurrency(record.paid_amount, record.currency)} paid`
                      : ""}
                  </Text>
                </div>
              )}
          </div>
        );
      },
    },

    {
      title: "Created",
      dataIndex: "created_at",
      render: (val) => (
        <div>
          <div>{new Date(val).toLocaleDateString()}</div>
          <div>
            <Text type="secondary">{new Date(val).toLocaleTimeString()}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Order Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showOrderDetails(record)}
            />
          </Tooltip>
                     <Tooltip title="Edit Payment">
             <Button
               type="default"
               icon={<EditOutlined />}
               size="small"
               onClick={() => showEditPayment(record)}
               disabled={
                 record.payment_status === "paid" && record.remaining_amount <= 0
               }
             />
           </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          padding: 16,
          backgroundColor: "#fafafa",
          borderRadius: 8,
        }}
      >
        <Search
          placeholder="Search by order ID, customer name, email, or transaction ID..."
          allowClear
          enterButton={<SearchOutlined />}
          style={{ width: 400 }}
          onSearch={(value) => setSearchTerm(value)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateOrderVisible(true)}
          >
            Create Order
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOrders}
            loading={loading}
          >
            Reload
          </Button>
        </Space>
      </div>

      <OrderBulkActions
        selectedOrders={selectedOrders}
        onBulkStatusUpdate={onBulkStatusUpdate}
        onBulkDelete={onBulkDelete}
        onExport={onExport}
      />

      <Table
        rowKey="id"
        dataSource={filteredOrders}
        columns={columns}
        rowSelection={handleRowSelection}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} orders`,
        }}
        loading={loading}
        scroll={{ x: 1400 }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ padding: "16px" }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" title="Order Summary">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Total Amount">
                        {formatCurrency(record.total_amount, record.currency)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Payable Amount">
                        {formatCurrency(record.payable_amount, record.currency)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Paid Amount">
                        {formatCurrency(record.paid_amount, record.currency)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Remaining Amount">
                        {formatCurrency(
                          record.remaining_amount,
                          record.currency
                        )}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="Additional Info">
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Notes">
                        {record.notes || "No notes"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Date">
                        {record.payment_date
                          ? new Date(record.payment_date).toLocaleString()
                          : "Not paid yet"}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                </Col>
              </Row>
            </div>
          ),
        }}
      />

      <CreateOrderForm
        visible={createOrderVisible}
        onCancel={() => setCreateOrderVisible(false)}
        onSuccess={fetchOrders}
      />

      <OrderDetailsModal
        visible={orderDetailsVisible}
        order={selectedOrder}
        onClose={() => {
          setOrderDetailsVisible(false);
          setSelectedOrder(null);
        }}
      />

      {/* Manual Payment Modal */}
      <Modal
        title="Update Payment"
        open={editPaymentVisible}
        onCancel={() => {
          setEditPaymentVisible(false);
          setSelectedOrderForEdit(null);
        }}
        footer={null}
        width={500}
      >
        {selectedOrderForEdit && (
          <Form
            layout="vertical"
            onFinish={handleManualPayment}
            initialValues={{
              currency: selectedOrderForEdit.currency || "BDT",
              payment_method: "cash",
            }}
          >
            <div
              style={{
                marginBottom: 16,
                padding: 16,
                backgroundColor: "#f5f5f5",
                borderRadius: 8,
              }}
            >
              <Text strong>Order Summary:</Text>
              <div>
                Total Amount:{" "}
                {formatCurrency(
                  selectedOrderForEdit.total_amount,
                  selectedOrderForEdit.currency
                )}
              </div>
              <div>
                Paid Amount:{" "}
                {formatCurrency(
                  selectedOrderForEdit.paid_amount,
                  selectedOrderForEdit.currency
                )}
              </div>
              <div>
                Remaining Amount:{" "}
                {formatCurrency(
                  selectedOrderForEdit.total_amount -
                    selectedOrderForEdit.paid_amount,
                  selectedOrderForEdit.currency
                )}
              </div>
            </div>

            <Form.Item
              name="amount"
              label="Payment Amount"
              rules={[
                { required: true, message: "Please enter payment amount" },
                {
                  validator: (_, value) => {
                    if (value === "" || value === null || value === undefined) {
                      return Promise.resolve();
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        new Error("Please enter a valid number")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter payment amount"
                addonAfter={
                  <Form.Item name="currency" noStyle>
                    <Select style={{ width: 80 }}>
                      <Select.Option value="BDT">BDT</Select.Option>
                      <Select.Option value="USD">USD</Select.Option>
                    </Select>
                  </Form.Item>
                }
              />
            </Form.Item>

            <Form.Item name="payment_method" label="Payment Method">
              <Select placeholder="Select payment method">
                <Select.Option value="manual">Manual Payment</Select.Option>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="bank_transfer">
                  Bank Transfer
                </Select.Option>
                <Select.Option value="check">Check</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="Notes">
              <Input.TextArea
                rows={3}
                placeholder="Add any notes about this payment"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
              <Button
                onClick={() => {
                  setEditPaymentVisible(false);
                  setSelectedOrderForEdit(null);
                }}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  backgroundColor: "var(--maveyellow)",
                  borderColor: "var(--maveyellow)",
                }}
              >
                Update Payment
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default OrdersTable;
