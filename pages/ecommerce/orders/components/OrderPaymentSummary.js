import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Space,
  Tag,
  Divider,
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const OrderPaymentSummary = ({ orders }) => {
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'BDT'
    }).format(amount || 0);
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const partialPaymentOrders = orders.filter(order => order.payment_type === 'partial_payment');
  const fullPaymentOrders = orders.filter(order => order.payment_type === 'full_payment');
  
  const totalAmount = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  const totalPaidAmount = orders.reduce((sum, order) => sum + (order.paid_amount || 0), 0);
  const totalRemainingAmount = orders.reduce((sum, order) => sum + (order.remaining_amount || 0), 0);
  
  const fullyPaidOrders = orders.filter(order => 
    order.payment_status === 'paid' || 
    (order.payment_type === 'partial_payment' && order.remaining_amount === 0)
  );
  
  const partiallyPaidOrders = orders.filter(order => 
    order.payment_type === 'partial_payment' && 
    order.paid_amount > 0 && 
    order.remaining_amount > 0
  );
  
  const pendingPaymentOrders = orders.filter(order => 
    order.payment_status !== 'paid' && 
    (order.payment_type === 'full_payment' || order.paid_amount === 0)
  );

  const overallPaymentProgress = totalAmount > 0 ? Math.round((totalPaidAmount / totalAmount) * 100) : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Partial Payment Details */}
      {partialPaymentOrders.length > 0 && (
        <>
          <Divider />
        </>
      )}
    </div>
  );
};

export default OrderPaymentSummary;
