// components/PageBuilder/Components/TableComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Typography, message, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import TableSelectionDrawer from "../Modals/TableSelectionModal/TableSelectionDrawer";

const { Paragraph } = Typography;

const TableComponent = ({
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

  useEffect(() => {
    if (tableData) {
      const cols = tableData.headers?.map((header, index) => ({
        title: header,
        dataIndex: `col${index}`,
        key: `col${index}`,
      }));
      setColumns(cols);
      const rows = tableData.rows?.map((row, rowIndex) => ({
        key: rowIndex,
        ...row.reduce((acc, cell, colIndex) => {
          acc[`col${colIndex}`] = cell;
          return acc;
        }, {}),
      }));
      setDataSource(rows);
    }
  }, [tableData]);

  const handleSelectTable = (selectedTable) => {
    updateComponent({
      ...component,
      _mave: selectedTable,
      id: component._id,
    });
    setTableData(selectedTable);
    setIsDrawerVisible(false);
    message.success("Table updated successfully.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  if (preview) {
    return (
      <div className="preview-table-component p-4 bg-gray-100 rounded-md">
        {tableData && tableData.headers && tableData.rows ? (
          <div className="overflow-x-auto">
            <table
              className="min-w-full border-collapse"
              style={{
                border:
                  tableData?.styles?.borderStyle === "none"
                    ? "none"
                    : tableData?.styles?.borderStyle === "thin"
                      ? "1px solid #ddd"
                      : "2px solid #000",
                backgroundColor: tableData?.styles?.cellColor || "#fff",
                textAlign: tableData?.styles?.textAlign || "left",
              }}
            >
              <thead>
                <tr>
                  {columns?.map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-2 border"
                      style={{
                        border:
                          tableData?.styles?.borderStyle === "none"
                            ? "none"
                            : "1px solid #ddd",
                      }}
                    >
                      {col.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dataSource?.map((row) => (
                  <tr key={row.key}>
                    {columns?.map((col, index) => (
                      <td
                        key={col.key}
                        className="px-4 py-2 border"
                        style={{
                          border:
                            tableData?.styles?.borderStyle === "none"
                              ? "none"
                              : "1px solid #ddd",
                        }}
                      >
                        {row[`col${index}`]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Paragraph className="text-gray-500">
            No table data available.
          </Paragraph>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Table Component</h3>
        </div>
        <div>
          {tableData && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsDrawerVisible(true)}
                className="mavebutton"
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
                okButtonProps={{ danger: true }}
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Popconfirm>
            </>
          )}
        </div>
      </div>

      {tableData && tableData.headers && tableData.rows ? (
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-collapse"
            style={{
              border:
                tableData?.styles?.borderStyle === "none"
                  ? "none"
                  : tableData?.styles?.borderStyle === "thin"
                    ? "1px solid #ddd"
                    : "2px solid #000",
              backgroundColor: tableData?.styles?.cellColor || "#fff",
              textAlign: tableData?.styles?.textAlign || "left",
            }}
          >
            <thead>
              <tr>
                {columns?.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-2 border"
                    style={{
                      border:
                        tableData?.styles?.borderStyle === "none"
                          ? "none"
                          : "1px solid #ddd",
                    }}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataSource?.map((row) => (
                <tr key={row.key}>
                  {columns?.map((col, index) => (
                    <td
                      key={col.key}
                      className="px-4 py-2 border"
                      style={{
                        border:
                          tableData?.styles?.borderStyle === "none"
                            ? "none"
                            : "1px solid #ddd",
                      }}
                    >
                      {row[`col${index}`]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
};

export default TableComponent;
