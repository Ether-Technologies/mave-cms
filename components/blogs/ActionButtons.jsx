// components/Blog/ActionButtons.jsx

import React from "react";
import { Button, Popconfirm } from "antd";
import router from "next/router";

const ActionButtons = ({ onCreate, onCancel, loading }) => {
  return (
    <div className="flex justify-end space-x-4 mb-16">
      <Popconfirm
        title="Are you sure you want to cancel?"
        onConfirm={onCancel}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Button className="mavecancelbutton">Cancel</Button>
      </Popconfirm>
      <Button
        type="primary"
        onClick={onCreate}
        loading={loading}
        className="mavebutton"
      >
        Create Blog
      </Button>
    </div>
  );
};

export default ActionButtons;
