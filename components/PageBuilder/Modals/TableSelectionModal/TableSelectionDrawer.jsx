import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Drawer, Form, Button, Typography, Select, message, Spin } from "antd";
import CSVImportSection from "./CSVImportSection";
import HeadersSection from "./HeadersSection";
import RowsSection from "./RowsSection";
import PreviewTable from "./PreviewTable";
import FilterableColumns from "./FilterableColumns";
import { v4 as uuidv4 } from "uuid";

const { Title } = Typography;
const { Option } = Select;

const TableSelectionDrawer = React.memo(
  ({ isVisible, onClose, onSelectTable, initialTable }) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);

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

    // Memoized initial table data
    const memoizedInitialTable = useMemo(() => initialTable, [initialTable]);

    // Optimized effect for initialization
    useEffect(() => {
      if (isVisible) {
        setIsLoading(true);

        // Use setTimeout to prevent blocking the UI
        setTimeout(() => {
          if (memoizedInitialTable) {
            setHeaders(
              memoizedInitialTable.headers?.length
                ? memoizedInitialTable.headers.map((name) => ({
                    id: uuidv4(),
                    name,
                  }))
                : [{ id: "default-1", name: "Column 1 Heading" }]
            );
            setRows(memoizedInitialTable?.rows || [[""]]);
            setVisibleColumns(
              memoizedInitialTable?.visibleColumns ||
                Array(memoizedInitialTable?.headers?.length || 1).fill(true)
            );
            setFilterColumns(memoizedInitialTable?.filterColumns || []);
          }
          form?.resetFields();
          setIsLoading(false);
        }, 0);
      }
    }, [isVisible, memoizedInitialTable, form]);

    // Optimized row synchronization
    const syncRowsWithHeaders = useCallback((currentRows, currentHeaders) => {
      return currentRows?.map((r) => {
        if (r?.length < currentHeaders?.length) {
          // add empty cells if needed
          return [...r, ...Array(currentHeaders?.length - r?.length).fill("")];
        } else if (r?.length > currentHeaders?.length) {
          // remove extras
          return r?.slice(0, currentHeaders?.length);
        }
        return r;
      });
    }, []);

    // Keep each row length matched to # of headers
    useEffect(() => {
      setRows((prevRows) => syncRowsWithHeaders(prevRows, headers));
    }, [headers, syncRowsWithHeaders]);

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

    // Optimized form field synchronization
    const formData = useMemo(
      () => ({
        headers: headers?.map((h) => h?.name),
        rows,
      }),
      [headers, rows]
    );

    useEffect(() => {
      if (form && Object.keys(formData).length > 0) {
        form.setFieldsValue(formData);
      }
    }, [formData, form]);

    // Optimized save handler
    const handleSave = useCallback(() => {
      form
        .validateFields()
        .then(() => {
          // Validate row lengths
          for (let i = 0; i < rows.length; i++) {
            if (rows[i]?.length !== headers?.length) {
              message.error(
                `Row ${i + 1} does not match the number of columns.`
              );
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
    }, [
      form,
      rows,
      headers,
      visibleColumns,
      filterColumns,
      onSelectTable,
      onClose,
    ]);

    // Optimized cancel handler
    const handleCancel = useCallback(() => {
      form?.resetFields();
      onClose();
    }, [form, onClose]);

    // Memoized drawer props
    const drawerProps = useMemo(
      () => ({
        title: "Configure Table",
        placement: "right",
        closable: true,
        onClose: handleCancel,
        open: isVisible,
        width: "70vw",
        footer: (
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
        ),
      }),
      [isVisible, handleCancel, handleSave]
    );

    // Memoized form props
    const formProps = useMemo(
      () => ({
        form,
        layout: "vertical",
      }),
      [form]
    );

    // Memoized section props
    const headersSectionProps = useMemo(
      () => ({
        headers,
        setHeaders,
        visibleColumns,
        setVisibleColumns,
        rows,
        setRows,
        filterColumns,
        setFilterColumns,
      }),
      [headers, visibleColumns, rows, filterColumns]
    );

    const rowsSectionProps = useMemo(
      () => ({
        headers,
        rows,
        setRows,
      }),
      [headers, rows]
    );

    const filterableColumnsProps = useMemo(
      () => ({
        headers,
        filterColumns,
        setFilterColumns,
      }),
      [headers, filterColumns]
    );

    const previewTableProps = useMemo(
      () => ({
        headers,
        rows,
        visibleColumns,
        filterColumns,
      }),
      [headers, rows, visibleColumns, filterColumns]
    );

    if (isLoading) {
      return (
        <Drawer {...drawerProps}>
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        </Drawer>
      );
    }

    return (
      <Drawer {...drawerProps}>
        <Form {...formProps}>
          {/* 1) CSV Import */}
          <CSVImportSection
            setHeaders={setHeaders}
            setRows={setRows}
            setVisibleColumns={setVisibleColumns}
          />

          {/* 2) Column Headers + Visibility + Reordering */}
          <HeadersSection {...headersSectionProps} />

          {/* 3) Rows */}
          <RowsSection {...rowsSectionProps} />

          <div className="grid grid-cols-10 items-center">
            <Title level={4} className="col-span-7">
              Preview
            </Title>
            <div className="col-span-3">
              {/* 4) Filterable Columns */}
              <Title level={4}>Filterable Columns</Title>
              <FilterableColumns {...filterableColumnsProps} />
            </div>
          </div>

          {/* 5) Preview */}
          <PreviewTable {...previewTableProps} />
        </Form>
      </Drawer>
    );
  }
);

TableSelectionDrawer.displayName = "TableSelectionDrawer";

export default TableSelectionDrawer;
