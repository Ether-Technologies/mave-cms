// components/UserRow.js
import { Button, Popconfirm, Row, Col, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const UserRow = ({ user, roles, handleUserEdit, handleDeleteUser }) => {
  return (
    <Row
      gutter={16}
      style={{
        marginTop: "1rem",
        backgroundColor: "#ceedff",
        padding: "1rem 1em",
        borderRadius: "5px",
      }}
    >
      <Col span={6}>{user.name}</Col>
      <Col span={6}>{user.email}</Col>
      <Col span={4}>
        <Select
          defaultValue={roles.find((role) => role.id == user.role_id)?.id}
          disabled
          showSearch
        >
          {roles?.map((role) => (
            <Select.Option value={role.id} key={role.id}>
              {role.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={6}>
        <p>All</p>
      </Col>
      <Col span={2}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            type="primary"
            onClick={() => handleUserEdit(user)}
            icon={<EditOutlined />}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(user.id)}
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      </Col>
    </Row>
  );
};

export default UserRow;
