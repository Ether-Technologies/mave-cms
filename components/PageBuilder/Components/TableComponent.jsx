// components/PageBuilder/Components/TableComponent.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button, Typography, message, Popconfirm, Spin, Alert } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CopyFilled,
  DragOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import TableSelectionDrawer from "../Modals/TableSelectionModal/TableSelectionDrawer";

const { Paragraph } = Typography;

// Memoized table cell component for better performance
const TableCell = React.memo(({ children, style, className }) => (
  <td className={className} style={style}>
    {children}
  </td>
));

TableCell.displayName = "TableCell";

// Memoized table header component
const TableHeader = React.memo(({ children, style, className }) => (
  <th className={className} style={style}>
    {children}
  </th>
));

TableHeader.displayName = "TableHeader";

const TableComponent = React.memo(
  ({
    component,
    updateComponent,
    deleteComponent,
    preview = false,
    onDuplicateElement,
  }) => {
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [tableData, setTableData] = useState(component._mave || {});
    const [columns, setColumns] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Memoized table data processing
    const processTableData = useCallback((data) => {
      if (!data) return { cols: [], rows: [] };

      try {
        const cols =
          data.headers?.map((header, index) => ({
            title: header,
            dataIndex: `col${index}`,
            key: `col${index}`,
          })) || [];

        const rows =
          data.rows?.map((row, rowIndex) => ({
            key: rowIndex,
            ...row.reduce((acc, cell, colIndex) => {
              acc[`col${colIndex}`] = cell;
              return acc;
            }, {}),
          })) || [];

        return { cols, rows };
      } catch (err) {
        console.error("Error processing table data:", err);
        setError("Failed to process table data");
        return { cols: [], rows: [] };
      }
    }, []);

    // Optimized effect for data processing
    useEffect(() => {
      if (tableData) {
        setIsLoading(true);
        setError(null);

        // Use setTimeout to prevent blocking UI
        setTimeout(() => {
          try {
            const { cols, rows } = processTableData(tableData);
            setColumns(cols);
            setDataSource(rows);
            setIsLoading(false);
          } catch (err) {
            setError("Failed to process table data");
            setIsLoading(false);
          }
        }, 0);
      }
    }, [tableData, processTableData]);

    // Optimized table selection handler
    const handleSelectTable = useCallback(
      (selectedTable) => {
        setIsLoading(true);

        setTimeout(() => {
          try {
            updateComponent({
              ...component,
              _mave: selectedTable,
              id: component._id,
            });
            setTableData(selectedTable);
            setIsDrawerVisible(false);
            message.success("Table updated successfully.");
          } catch (err) {
            message.error("Failed to update table.");
          } finally {
            setIsLoading(false);
          }
        }, 0);
      },
      [component, updateComponent]
    );

    // Optimized delete handler
    const handleDelete = useCallback(() => {
      deleteComponent();
    }, [deleteComponent]);

    // Memoized table styles
    const tableStyles = useMemo(
      () => ({
        border:
          tableData?.styles?.borderStyle === "none"
            ? "none"
            : tableData?.styles?.borderStyle === "thin"
              ? "1px solid #ddd"
              : "2px solid #000",
        backgroundColor: tableData?.styles?.cellColor || "#fff",
        textAlign: tableData?.styles?.textAlign || "left",
        fontSize:
          tableData?.styles?.fontSize === "small"
            ? "12px"
            : tableData?.styles?.fontSize === "large"
              ? "16px"
              : "14px",
      }),
      [tableData?.styles]
    );

    // Memoized cell styles
    const cellStyles = useMemo(
      () => ({
        border:
          tableData?.styles?.borderStyle === "none" ? "none" : "1px solid #ddd",
        padding: "8px 12px",
      }),
      [tableData?.styles?.borderStyle]
    );

    // Memoized header styles
    const headerStyles = useMemo(
      () => ({
        border:
          tableData?.styles?.borderStyle === "none" ? "none" : "1px solid #ddd",
        padding: "12px",
        backgroundColor: tableData?.styles?.headerColor || "#f5f5f5",
        fontWeight: "bold",
      }),
      [tableData?.styles]
    );

    // Memoized preview content
    const previewContent = useMemo(() => {
      if (error) {
        return (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => setError(null)}>
                Retry
              </Button>
            }
          />
        );
      }

      if (isLoading) {
        return (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        );
      }

      if (tableData && tableData.headers && tableData.rows) {
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse" style={tableStyles}>
              <thead>
                <tr>
                  {columns?.map((col) => (
                    <TableHeader
                      key={col.key}
                      className="px-4 py-2 border"
                      style={headerStyles}
                    >
                      {col.title}
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataSource?.map((row) => (
                  <tr key={row.key}>
                    {columns?.map((col, index) => (
                      <TableCell
                        key={col.key}
                        className="px-4 py-2 border"
                        style={cellStyles}
                      >
                        {row[`col${index}`]}
                      </TableCell>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      return (
        <Paragraph className="text-gray-500">
          No table data available.
        </Paragraph>
      );
    }, [
      error,
      isLoading,
      tableData,
      columns,
      dataSource,
      tableStyles,
      headerStyles,
      cellStyles,
    ]);

    if (preview) {
      return (
        <div className="preview-table-component p-4 bg-gray-100 rounded-md">
          {previewContent}
        </div>
      );
    }

    // Memoized action buttons
    const actionButtons = useMemo(() => {
      if (!tableData) return null;

      return (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsDrawerVisible(true)}
            className="mavebutton"
            loading={isLoading}
          >
            Update
          </Button>
          <Button
            icon={<CopyFilled />}
            onClick={onDuplicateElement}
            className="mavebutton"
          />
          <Popconfirm
            title="Are you sure you want to delete this component?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} className="mavecancelbutton" />
          </Popconfirm>
        </>
      );
    }, [tableData, isLoading, onDuplicateElement, handleDelete]);

    return (
      <div className="border p-4 rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <DragOutlined className="text-2xl border rounded-md p-1" />
            <h3 className="text-xl font-semibold">Table Component</h3>
            {isLoading && <Spin size="small" />}
          </div>
          <div className="flex gap-2">{actionButtons}</div>
        </div>

        {tableData && tableData.headers && tableData.rows ? (
          previewContent
        ) : (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setIsDrawerVisible(true)}
            className="mavebutton"
          >
            Add Table
          </Button>
        )}

        <TableSelectionDrawer
          isVisible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          onSelectTable={handleSelectTable}
          initialTable={tableData}
        />
      </div>
    );
  }
);

TableComponent.displayName = "TableComponent";

export default TableComponent;
