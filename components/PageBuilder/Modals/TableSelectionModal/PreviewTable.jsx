// TableSelectionModal/PreviewTable.jsx

import React, { useMemo, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const PreviewTable = ({ headers, visibleColumns, rows, filterColumns }) => {
  // For the text filter in antd
  const [searchText, setSearchText] = useState("");
  const [searchedColIndex, setSearchedColIndex] = useState(null);

  const handleSearch = (selectedKeys, confirm, colIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColIndex(colIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
    setSearchedColIndex(null);
  };

  // Build columns for <Table>
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
        };

        // If this header is in filterColumns, we add the text filter dropdown
        if (filterColumns.includes(colObj.name)) {
          colDef.filterDropdown = ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
          }) => (
            <div style={{ padding: 8 }}>
              <Input
                placeholder={`Search ${colObj.name}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                onPressEnter={() =>
                  handleSearch(selectedKeys, confirm, colIndex)
                }
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
  }, [headers, visibleColumns, filterColumns, searchedColIndex, searchText]);

  // Convert row arrays to object for antd
  const dataSource = useMemo(() => {
    return rows.map((row, rowIndex) => {
      const rowObj = { key: `row-${rowIndex}` };
      row.forEach((cellVal, colIndex) => {
        rowObj[String(colIndex)] = cellVal;
      });
      return rowObj;
    });
  }, [rows]);

  return <Table columns={columns} dataSource={dataSource} />;
};

export default PreviewTable;
