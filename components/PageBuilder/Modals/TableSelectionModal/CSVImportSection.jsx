import React, { useState, useCallback, useMemo } from "react";
import { Collapse, Typography, message, Upload, Progress, Alert } from "antd";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { UploadOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Dragger } = Upload;

const CSVImportSection = React.memo(
  ({ setHeaders, setRows, setVisibleColumns }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileInfo, setFileInfo] = useState(null);

    // Optimized CSV processing with progress
    const processCSV = useCallback(
      (file) => {
        return new Promise((resolve, reject) => {
          setIsProcessing(true);
          setProgress(0);

          // Validate file size (max 10MB)
          const maxSize = 10 * 1024 * 1024; // 10MB
          if (file.size > maxSize) {
            message.error(
              "File size too large. Please upload a file smaller than 10MB."
            );
            setIsProcessing(false);
            reject(new Error("File too large"));
            return;
          }

          // Validate file type
          if (!file.name.toLowerCase().endsWith(".csv")) {
            message.error("Please upload a valid CSV file.");
            setIsProcessing(false);
            reject(new Error("Invalid file type"));
            return;
          }

          setFileInfo({
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
          });

          Papa.parse(file, {
            skipEmptyLines: false, // Don't skip empty lines to preserve structure
            header: false, // We'll handle headers manually
            dynamicTyping: false, // Don't convert types
            transform: (value) => value.trim(), // Trim whitespace
            delimiter: ",", // Explicitly set delimiter
            encoding: "UTF-8", // Set encoding
            complete: (result) => {
              setProgress(100);

              setTimeout(() => {
                const { data, errors } = result;

                if (errors && errors.length > 0) {
                  message.warning(
                    `Found ${errors.length} parsing errors. Some data may be incomplete.`
                  );
                }

                if (data && data.length > 0) {
                  // First row = CSV column names
                  const csvHeaderStrings = data[0].map((h) => (h || "").trim());

                  // Find the maximum number of columns across all rows
                  const maxColumns = Math.max(...data.map((row) => row.length));

                  // Ensure headers array matches the maximum column count
                  while (csvHeaderStrings.length < maxColumns) {
                    csvHeaderStrings.push(
                      `Column ${csvHeaderStrings.length + 1}`
                    );
                  }

                  // Validate headers - be more lenient
                  const validHeaders = csvHeaderStrings.filter(
                    (h) => h && h.trim() !== ""
                  );
                  if (validHeaders.length === 0) {
                    message.error("No valid headers found in CSV file.");
                    setIsProcessing(false);
                    reject(new Error("No valid headers"));
                    return;
                  }

                  // Convert each to { id, name }
                  const csvHeaders = csvHeaderStrings.map((colName, index) => ({
                    id: uuidv4(),
                    name: colName || `Column ${index + 1}`,
                  }));

                  // Next rows = actual data
                  const csvRows = data.slice(1).map((row) => {
                    // Ensure each row has the same number of columns as headers
                    const paddedRow = [...row];
                    while (paddedRow.length < csvHeaders.length) {
                      paddedRow.push("");
                    }
                    return paddedRow.map((cell, index) => cell || "");
                  });

                  // Update state
                  setHeaders(csvHeaders);
                  setRows(csvRows);
                  // Set all columns as visible by default
                  setVisibleColumns(Array(csvHeaders.length).fill(true));

                  message.success(
                    `CSV imported successfully. ${csvRows.length} rows, ${csvHeaders.length} columns.`
                  );
                  setIsProcessing(false);
                  resolve({ headers: csvHeaders, rows: csvRows });
                } else {
                  message.error("CSV file is empty or invalid.");
                  setIsProcessing(false);
                  reject(new Error("Empty CSV"));
                }
              }, 500); // Small delay to show progress
            },
            error: (error) => {
              message.error(`Failed to parse CSV file: ${error.message}`);
              setIsProcessing(false);
              reject(error);
            },
            step: (row, parser) => {
              // Update progress based on file size
              // Add safety check for parser.streamer.input
              if (parser && parser.streamer && parser.streamer.input) {
                const progressPercent = Math.min(
                  (parser.streamer.input.length / file.size) * 100,
                  95
                );
                setProgress(progressPercent);
              } else {
                // Fallback progress calculation
                setProgress(50); // Set a default progress value
              }
            },
          });
        });
      },
      [setHeaders, setRows, setVisibleColumns]
    );

    // Optimized file upload handler
    const handleCSVUpload = useCallback(
      (file) => {
        processCSV(file).catch(() => {
          // Error already handled in processCSV
        });
        return false; // Prevent auto-upload
      },
      [processCSV]
    );

    // Memoized dragger props
    const draggerProps = useMemo(
      () => ({
        name: "file",
        multiple: false,
        accept: ".csv",
        showUploadList: false,
        beforeUpload: handleCSVUpload,
        disabled: isProcessing,
        onChange(info) {
          // This callback fires when file status changes
          if (info.file.status === "uploading") {
            // Handle upload progress if needed
          }
        },
        onDrop(e) {
          console.log("Dropped files", e.dataTransfer.files);
        },
      }),
      [handleCSVUpload, isProcessing]
    );

    // Memoized upload content
    const uploadContent = useMemo(
      () => (
        <div className="text-center">
          <p className="ant-upload-drag-icon">
            {isProcessing ? <FileTextOutlined /> : <UploadOutlined />}
          </p>
          <p className="ant-upload-text">
            {isProcessing
              ? "Processing CSV..."
              : "Click or drag CSV file to this area to upload"}
          </p>
          <p className="ant-upload-hint">
            {isProcessing
              ? "Please wait while we process your file..."
              : "Support for CSV files only. Max size: 10MB"}
          </p>
          {isProcessing && (
            <div className="mt-4">
              <Progress percent={progress} size="small" />
            </div>
          )}
        </div>
      ),
      [isProcessing, progress]
    );

    // Memoized file info display
    const fileInfoDisplay = useMemo(() => {
      if (!fileInfo) return null;

      return (
        <Alert
          message={`File: ${fileInfo.name}`}
          description={`Size: ${fileInfo.size}`}
          type="info"
          showIcon
          className="mt-2"
        />
      );
    }, [fileInfo]);

    return (
      <div className="csv-import-section flex flex-col items-center justify-center mb-10">
        <Collapse
          bordered={false}
          expandIconPosition="right"
          className="mt-4 border-2 bg-theme font-bold text-gray-700 w-full"
        >
          <Collapse.Panel
            header={
              <div className="flex items-center gap-2">
                <UploadOutlined />
                <span>Import CSV</span>
                {isProcessing && (
                  <span className="text-yellow-500">(Processing...)</span>
                )}
              </div>
            }
            key="1"
            className="text-center text-xl"
          >
            <Dragger {...draggerProps}>{uploadContent}</Dragger>
            {fileInfoDisplay}
          </Collapse.Panel>
        </Collapse>
      </div>
    );
  }
);

CSVImportSection.displayName = "CSVImportSection";

export default CSVImportSection;
