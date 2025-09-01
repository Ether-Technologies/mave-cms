import React, { useState } from 'react';
import { Button, Select, Modal, message, Space, Typography, Card } from 'antd';
import { 
  ExportOutlined, 
  SettingOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const OrderBulkActions = ({ selectedOrders, onBulkStatusUpdate, onBulkDelete, onExport }) => {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBulkStatusUpdate = async () => {
    if (!selectedStatus) {
      message.error('Please select a status');
      return;
    }

    setLoading(true);
    try {
      await onBulkStatusUpdate(selectedOrders, selectedStatus);
      message.success(`Updated ${selectedOrders.length} orders to ${selectedStatus}`);
      setStatusModalVisible(false);
      setSelectedStatus('');
    } catch (error) {
      message.error('Failed to update orders');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    Modal.confirm({
      title: 'Delete Selected Orders',
      content: `Are you sure you want to delete ${selectedOrders.length} orders? This action cannot be undone.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await onBulkDelete(selectedOrders);
          message.success(`Deleted ${selectedOrders.length} orders`);
        } catch (error) {
          message.error('Failed to delete orders');
        }
      },
    });
  };

  const handleExport = () => {
    onExport(selectedOrders);
  };

  if (selectedOrders.length === 0) {
    return null;
  }

  return (
    <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f6ffed' }}>
      <Space align="center">
        <Text strong>
          {selectedOrders.length} order(s) selected
        </Text>
        
        <Button
          type="primary"
          icon={<SettingOutlined />}
          onClick={() => setStatusModalVisible(true)}
        >
          Update Status
        </Button>
        
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={handleBulkDelete}
        >
          Delete Selected
        </Button>
        
        <Button
          icon={<ExportOutlined />}
          onClick={handleExport}
        >
          Export Selected
        </Button>
      </Space>

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        open={statusModalVisible}
        onOk={handleBulkStatusUpdate}
        onCancel={() => setStatusModalVisible(false)}
        confirmLoading={loading}
        okText="Update"
        cancelText="Cancel"
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Select new status for {selectedOrders.length} order(s):</Text>
        </div>
        
        <Select
          placeholder="Select status"
          value={selectedStatus}
          onChange={setSelectedStatus}
          style={{ width: '100%' }}
        >
          <Select.Option value="pending">
            <Space>
              <ClockCircleOutlined />
              Pending
            </Space>
          </Select.Option>
          <Select.Option value="confirmed">
            <Space>
              <CheckCircleOutlined />
              Confirmed
            </Space>
          </Select.Option>
          <Select.Option value="succeeded">
            <Space>
              <CheckCircleOutlined />
              Succeeded
            </Space>
          </Select.Option>
          <Select.Option value="cancelled">
            <Space>
              <CloseCircleOutlined />
              Cancelled
            </Space>
          </Select.Option>
        </Select>
      </Modal>
    </Card>
  );
};

export default OrderBulkActions;
