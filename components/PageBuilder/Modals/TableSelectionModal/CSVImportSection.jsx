import React from "react";
import { Collapse, Typography, message, Upload } from "antd";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { UploadOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Dragger } = Upload;

const CSVImportSection = ({ setHeaders, setRows }) => {
  const handleCSVUpload = (file) => {
    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (result) => {
        const { data } = result;
        if (data && data.length > 0) {
          // First row = CSV column names
          const csvHeaderStrings = data[0].map((h) => h.trim());
          // Convert each to { id, name }
          const csvHeaders = csvHeaderStrings.map((colName) => ({
            id: uuidv4(),
            name: colName,
          }));

          // Next rows = actual data
          const csvRows = data.slice(1);

          // Update state
          setHeaders(csvHeaders);
          setRows(csvRows);

          message.success("CSV imported successfully.");
        } else {
          message.error("CSV file is empty or invalid.");
        }
      },
      error: () => {
        message.error("Failed to parse CSV file.");
      },
    });
    // Return false to prevent Upload from auto-uploading files
    return false;
  };

  // These are the props you can spread into the Dragger
  const draggerProps = {
    name: "file",
    multiple: false,
    accept: ".csv",
    showUploadList: false,
    beforeUpload: handleCSVUpload, // or pass an inline arrow function if you prefer
    onChange(info) {
      // This callback fires when file status changes (e.g., file added, progress, done, error)
      // If you only need to parse the CSV in `beforeUpload`, you can leave this empty
      // but it's handy for hooking into the Upload lifecycle if needed.
    },
    onDrop(e) {
      // Fires when a file is dropped onto the drop area
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="csv-import-section flex flex-col items-center justify-center mb-10">
      <Collapse
        bordered={false}
        // defaultActiveKey={["1"]}
        expandIconPosition="right"
        className="mt-4 border-2 bg-theme font-bold text-gray-700"
      >
        <Collapse.Panel
          header="Import CSV"
          key="1"
          className="text-center text-xl"
        >
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload.
            </p>
          </Dragger>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default CSVImportSection;
