import { Table, Switch, Tooltip, Button, Popconfirm, message } from "antd";
import { useEffect, useState } from "react";
import instance from "../../../axios";
import { DeleteOutlined } from "@ant-design/icons";

export default function PermissionTable({
  permissions,
  loading,
  fetchRolesPermissions,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "20%",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (description) => (
        <Tooltip title={description}>
          <span>
            {description?.length > 40
              ? description?.substring(0, 40) + "..."
              : description}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Switch
            checked={status === 1}
            onChange={async (checked) => {
              try {
                setIsLoading(true);
                const response = await instance.put(
                  `/permissions/${record.id}`,
                  {
                    status: checked ? 1 : 0,
                  }
                );
                if (response.status === 200) {
                  fetchRolesPermissions();
                  message.success("Permission status updated successfully");
                } else {
                  console.error(response);
                }
              } catch (error) {
                console.error(error);
              }
            }}
          />
          <Popconfirm
            title="Are you sure to delete this permission?"
            onConfirm={async () => {
              try {
                await instance.delete(`/permissions/${record.id}`);
                fetchRolesPermissions();
                message.success("Permission deleted successfully");
              } catch (error) {
                console.error(error);
              }
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              style={{
                color: "var(--theme)",
                borderColor: "var(--theme)",
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
  permissions && console.log("Permissions received component");
  return (
    <Table
      columns={columns}
      dataSource={permissions}
      loading={loading}
      rowKey={(record) => record.id}
    />
  );
}
