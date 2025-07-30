// TableSelectionModal/TableSelectionDrawer.jsx

import React, { useState, useEffect } from "react";
import { Drawer, Form, Button, Typography, Select, message } from "antd";
import CSVImportSection from "./CSVImportSection";
import HeadersSection from "./HeadersSection";
import RowsSection from "./RowsSection";
import PreviewTable from "./PreviewTable";
import FilterableColumns from "./FilterableColumns";
import { v4 as uuidv4 } from "uuid";

const { Title } = Typography;
const { Option } = Select;

const TableSelectionDrawer = ({
  isVisible,
  onClose,
  onSelectTable,
  initialTable,
}) => {
  const [form] = Form.useForm();

  // 1) Table Data
  // headers = array of { id, name }
  const [headers, setHeaders] = useState(
    initialTable?.headers || [{ id: "default-1", name: "Column 1 Heading" }]
  );
  // rows = array of arrays, e.g. [["foo","bar"], ["baz","qux"]]
  const [rows, setRows] = useState(
    initialTable?.rows || [
      [""], // match initial # of headers
    ]
  );

  // 2) Column Visibility
  // parallel array to headers; visibleColumns[i] belongs to headers[i]
  const [visibleColumns, setVisibleColumns] = useState(
    initialTable?.visibleColumns ||
      Array(initialTable?.headers?.length || 1).fill(true)
  );

  // 3) filterColumns: array of header names that are filterable
  const [filterColumns, setFilterColumns] = useState(
    initialTable?.filterColumns || []
  );

  useEffect(() => {
    if (isVisible) {
      if (initialTable) {
        setHeaders(
          initialTable.headers?.length
            ? initialTable.headers.map((name) => ({ id: uuidv4(), name }))
            : [{ id: "default-1", name: "Column 1 Heading" }]
        );
        setRows(initialTable?.rows || [[""]]);
        setVisibleColumns(
          initialTable?.visibleColumns ||
            Array(initialTable?.headers?.length || 1).fill(true)
        );
        setFilterColumns(initialTable?.filterColumns || []);
      }
      form?.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, initialTable]);

  // Keep each row length matched to # of headers
  useEffect(() => {
    setRows((prevRows) =>
      prevRows?.map((r) => {
        if (r?.length < headers?.length) {
          // add empty cells if needed
          return [...r, ...Array(headers?.length - r?.length).fill("")];
        } else if (r?.length > headers?.length) {
          // remove extras
          return r?.slice(0, headers?.length);
        }
        return r;
      })
    );
  }, [headers]);

  // Keep visibleColumns in sync if # of headers changes
  useEffect(() => {
    if (visibleColumns?.length < headers?.length) {
      setVisibleColumns([
        ...visibleColumns,
        ...Array(headers?.length - visibleColumns?.length).fill(true),
      ]);
    } else if (visibleColumns?.length > headers?.length) {
      setVisibleColumns(visibleColumns?.slice(0, headers?.length));
    }
  }, [headers, visibleColumns]);

  // Keep form fields in sync
  useEffect(() => {
    form.setFieldsValue({
      headers: headers?.map((h) => h?.name),
      rows,
    });
  }, [headers, rows, form]);

  const handleSave = () => {
    form
      .validateFields()
      .then(() => {
        // Validate row lengths
        for (let i = 0; i < rows.length; i++) {
          if (rows[i]?.length !== headers?.length) {
            message.error(`Row ${i + 1} does not match the number of columns.`);
            return;
          }
        }

        onSelectTable({
          headers: headers?.map((h) => h.name), // array of strings
          rows, // array of arrays
          visibleColumns, // array of booleans
          filterColumns, // array of header names
        });
        message.success("Table saved successfully.");
        onClose();
      })
      .catch(() => {
        message.error("Please fix the errors in the form.");
      });
  };

  const handleCancel = () => {
    form?.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Configure Table"
      placement="right"
      closable
      onClose={handleCancel}
      open={isVisible}
      width="70vw"
      footer={
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={handleCancel}
            style={{ marginRight: 8 }}
            className="mavecancelbutton"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} className="mavebutton">
            Save Table
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        {/* 1) CSV Import */}
        <CSVImportSection setHeaders={setHeaders} setRows={setRows} />

        {/* 2) Column Headers + Visibility + Reordering */}
        <HeadersSection
          headers={headers}
          setHeaders={setHeaders}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          rows={rows}
          setRows={setRows}
          filterColumns={filterColumns}
          setFilterColumns={setFilterColumns}
        />

        {/* 3) Rows */}
        <RowsSection headers={headers} rows={rows} setRows={setRows} />

        <div className="grid grid-cols-10 items-center">
          <Title level={4} className="col-span-7">
            Preview
          </Title>
          <div className="col-span-3">
            {/* 4) Filterable Columns */}
            <Title level={4}>Filterable Columns</Title>
            <FilterableColumns
              headers={headers}
              filterColumns={filterColumns}
              setFilterColumns={setFilterColumns}
            />
          </div>
        </div>

        {/* 5) Preview */}
        <PreviewTable
          headers={headers}
          rows={rows}
          visibleColumns={visibleColumns}
          filterColumns={filterColumns}
        />
      </Form>
    </Drawer>
  );
};

export default TableSelectionDrawer;
