// TableSelectionModal/PreviewTable.jsx

import React, { useMemo, useState, useCallback } from "react";
import { Table, Input, Button, Space, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Memoized filter dropdown component
const FilterDropdown = React.memo(
  ({
    colObj,
    colIndex,
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    handleSearch,
    handleReset,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${colObj.name}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, colIndex)}
        style={{ marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
          onClick={() => handleSearch(selectedKeys, confirm, colIndex)}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            handleReset(clearFilters);
            confirm({ closeDropdown: true });
          }}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  )
);

FilterDropdown.displayName = "FilterDropdown";

const PreviewTable = React.memo(
  ({ headers, visibleColumns, rows, filterColumns }) => {
    // For the text filter in antd
    const [searchText, setSearchText] = useState("");
    const [searchedColIndex, setSearchedColIndex] = useState(null);
    const [loading, setLoading] = useState(false);

    // Optimized search handlers
    const handleSearch = useCallback((selectedKeys, confirm, colIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColIndex(colIndex);
    }, []);

    const handleReset = useCallback((clearFilters) => {
      clearFilters();
      setSearchText("");
      setSearchedColIndex(null);
    }, []);

    // Build columns for <Table> with memoization
    const columns = useMemo(() => {
      return headers
        .map((colObj, colIndex) => {
          // Hide if not visible
          if (!visibleColumns[colIndex]) return null;

          // Base column config
          const colDef = {
            title: colObj.name,
            dataIndex: String(colIndex), // We'll map row arrays to an object
            key: colObj.id, // stable key
            width: 150, // Fixed width for better performance
            ellipsis: true, // Handle long text
          };

          // If this header is in filterColumns, we add the text filter dropdown
          if (filterColumns.includes(colObj.name)) {
            colDef.filterDropdown = ({
              setSelectedKeys,
              selectedKeys,
              confirm,
              clearFilters,
            }) => (
              <FilterDropdown
                colObj={colObj}
                colIndex={colIndex}
                setSelectedKeys={setSelectedKeys}
                selectedKeys={selectedKeys}
                confirm={confirm}
                clearFilters={clearFilters}
                handleSearch={handleSearch}
                handleReset={handleReset}
              />
            );

            colDef.onFilter = (value, record) => {
              const cellVal = (record[String(colIndex)] || "").toLowerCase();
              return cellVal.includes(value.toLowerCase());
            };

            if (searchedColIndex === colIndex && searchText) {
              colDef.filteredValue = [searchText];
            } else {
              colDef.filteredValue = null;
            }
          }

          return colDef;
        })
        .filter(Boolean); // remove hidden columns
    }, [
      headers,
      visibleColumns,
      filterColumns,
      searchedColIndex,
      searchText,
      handleSearch,
      handleReset,
    ]);

    // Convert row arrays to object for antd with memoization
    const dataSource = useMemo(() => {
      return rows.map((row, rowIndex) => {
        const rowObj = { key: `row-${rowIndex}` };
        row.forEach((cellVal, colIndex) => {
          rowObj[String(colIndex)] = cellVal;
        });
        return rowObj;
      });
    }, [rows]);

    // Memoized table props for better performance
    const tableProps = useMemo(
      () => ({
        columns,
        dataSource,
        pagination: {
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        },
        scroll: {
          x: columns.length > 5 ? 800 : undefined,
          y: dataSource.length > 50 ? 400 : undefined,
        },
        size: "small",
        bordered: true,
        loading: loading,
        rowKey: (record) => record.key,
      }),
      [columns, dataSource, loading]
    );

    // Handle loading state for large datasets
    React.useEffect(() => {
      if (dataSource.length > 1000) {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
      }
    }, [dataSource.length]);

    return (
      <div className="preview-table-container">
        {dataSource.length > 0 ? (
          <Table {...tableProps} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data to preview. Add some rows first.
          </div>
        )}
      </div>
    );
  }
);

PreviewTable.displayName = "PreviewTable";

export default PreviewTable;
