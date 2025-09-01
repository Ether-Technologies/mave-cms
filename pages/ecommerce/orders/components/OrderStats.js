import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const OrderStats = ({ orders }) => {
  const calculateStats = () => {
    if (!orders || orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        paidOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        partialPaidOrders: 0,
        averageOrderValue: 0,
        paidPercentage: 0,
        pendingPercentage: 0,
        cancelledPercentage: 0,
        partialPaidPercentage: 0
      };
    }

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.paid_amount || 0), 0);
    const paidOrders = orders.filter(order => order.payment_status === 'paid').length;
    const pendingOrders = orders.filter(order => order.payment_status === 'pending').length;
    const cancelledOrders = orders.filter(order => order.order_status === 'cancelled').length;
    const partialPaidOrders = orders.filter(order => order.payment_status === 'partial_paid').length;

    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      pendingOrders,
      cancelledOrders,
      partialPaidOrders,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      paidPercentage: (paidOrders / totalOrders) * 100,
      pendingPercentage: (pendingOrders / totalOrders) * 100,
      cancelledPercentage: (cancelledOrders / totalOrders) * 100,
      partialPaidPercentage: (partialPaidOrders / totalOrders) * 100
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={4} style={{ marginBottom: 16 }}>Order Statistics</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Applicants"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Paid Applicants"
              value={stats.paidOrders}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Applicants"
              value={stats.pendingOrders}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Payment Status Distribution" size="small">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Paid Orders</Text>
                <Text strong>{stats.paidOrders} ({stats.paidPercentage.toFixed(1)}%)</Text>
              </div>
              <Progress 
                percent={stats.paidPercentage} 
                strokeColor="#52c41a" 
                showInfo={false}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Partial Paid Orders</Text>
                <Text strong>{stats.partialPaidOrders} ({stats.partialPaidPercentage.toFixed(1)}%)</Text>
              </div>
              <Progress 
                percent={stats.partialPaidPercentage} 
                strokeColor="#faad14" 
                showInfo={false}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Pending Orders</Text>
                <Text strong>{stats.pendingOrders} ({stats.pendingPercentage.toFixed(1)}%)</Text>
              </div>
              <Progress 
                percent={stats.pendingPercentage} 
                strokeColor="#1890ff" 
                showInfo={false}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Cancelled Orders</Text>
                <Text strong>{stats.cancelledOrders} ({stats.cancelledPercentage.toFixed(1)}%)</Text>
              </div>
              <Progress 
                percent={stats.cancelledPercentage} 
                strokeColor="#ff4d4f" 
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Order Summary" size="small">
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Average Order Value:</Text>
                <Text strong>{formatCurrency(stats.averageOrderValue)}</Text>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Total Revenue:</Text>
                <Text strong style={{ color: '#52c41a' }}>{formatCurrency(stats.totalRevenue)}</Text>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Paid Orders:</Text>
                <Text strong style={{ color: '#52c41a' }}>{stats.paidOrders}</Text>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Pending Orders:</Text>
                <Text strong style={{ color: '#faad14' }}>{stats.pendingOrders}</Text>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Cancelled Orders:</Text>
                <Text strong style={{ color: '#ff4d4f' }}>{stats.cancelledOrders}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OrderStats;
