// components/PageBuilder/Components/PageLoadingStates.jsx

import React from "react";
import { Spin, Alert, Button } from "antd";

const PageLoadingStates = ({ loading, error, pageData, onRetry }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
        <div className="ml-4">Loading page data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={onRetry}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  // Show loading if pageData is not available yet
  if (!pageData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
        <div className="ml-4">Loading page data...</div>
      </div>
    );
  }

  return null;
};

export default PageLoadingStates;
