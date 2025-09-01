import React from 'react';
import { Card, Row, Col, Select, DatePicker, Input, Button, Space, Typography } from 'antd';
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Text } = Typography;

const OrderFilters = ({ filters, setFilters, onFilter, onClear }) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      paymentStatus: '',
      paymentType: '',
      dateRange: null
    });
    onClear();
  };

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <div>
            <Text strong>Search</Text>
            <Search
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onSearch={onFilter}
              allowClear
            />
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={4}>
          <div>
            <Text strong>Order Status</Text>
            <Select
              placeholder="All Statuses"
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="confirmed">Confirmed</Select.Option>
              <Select.Option value="succeeded">Succeeded</Select.Option>
              <Select.Option value="cancelled">Cancelled</Select.Option>
            </Select>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={4}>
          <div>
            <Text strong>Payment Status</Text>
            <Select
              placeholder="All Payments"
              value={filters.paymentStatus}
              onChange={(value) => handleFilterChange('paymentStatus', value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="partial_paid">Partial Paid</Select.Option>
            </Select>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={4}>
          <div>
            <Text strong>Payment Type</Text>
            <Select
              placeholder="All Types"
              value={filters.paymentType}
              onChange={(value) => handleFilterChange('paymentType', value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Select.Option value="full_payment">Full Payment</Select.Option>
              <Select.Option value="partial_payment">Partial Payment</Select.Option>
            </Select>
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={4}>
          <div>
            <Text strong>Date Range</Text>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </div>
        </Col>
        
        <Col xs={24} sm={12} md={2}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={onFilter}
              style={{ width: '100%' }}
            >
              Filter
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              style={{ width: '100%' }}
            >
              Clear
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderFilters;
