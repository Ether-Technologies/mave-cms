import React, { useRef, useEffect } from "react";
import { Form, Input, Button, Typography, Popconfirm, message } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Title } = Typography;

const RowsSection = ({ headers, rows, setRows }) => {
  // We'll store references to each cell in a 2D array (row x col)
  // so we can programmatically move focus with arrow keys, tab, etc.
  const cellRefs = useRef([]);

  // Ensure cellRefs always matches the shape of the rows array
  useEffect(() => {
    cellRefs.current = rows.map((r, rowIndex) =>
      headers.map(
        (_, colIndex) =>
          cellRefs.current?.[rowIndex]?.[colIndex] || React.createRef()
      )
    );
  }, [rows, headers]);

  const addRow = () => {
    if (headers.length === 0) {
      message.info("No headers defined. Please add columns first.");
      return;
    }
    // create a new row with empty cells matching # of headers
    const newRow = Array(headers.length).fill("");
    setRows((prev) => [...prev, newRow]);

    // Focus on the first cell of the newly added row (as an example)
    setTimeout(() => {
      const newRowIndex = rows.length; // because it was just pushed
      cellRefs.current?.[newRowIndex]?.[0]?.current?.focus();
    }, 0);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  const updateCell = (value, rowIndex, colIndex) => {
    const updated = rows.map((row, index) =>
      index === rowIndex
        ? [...row.slice(0, colIndex), value, ...row.slice(colIndex + 1)]
        : [...row]
    );
    setRows(updated);
  };

  // Handle keyboard navigation within the cell
  const handleKeyDown = (e, rowIndex, colIndex) => {
    const { key, shiftKey } = e;

    // Common movement logic: move focus to a specific cell if it exists
    const focusCell = (r, c) => {
      if (r >= 0 && r < rows.length && c >= 0 && c < headers.length) {
        cellRefs.current?.[r]?.[c]?.current?.focus();
      }
    };

    switch (key) {
      case "ArrowRight":
        e.preventDefault();
        focusCell(rowIndex, colIndex + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusCell(rowIndex, colIndex - 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusCell(rowIndex - 1, colIndex);
        break;
      case "ArrowDown":
        e.preventDefault();
        focusCell(rowIndex + 1, colIndex);
        break;
      case "Tab":
        // We rely on the browser’s default Tab to jump to the next input,
        // but we handle SHIFT+Tab to go backward if needed
        // or do custom logic if you prefer full manual control.
        if (!shiftKey) {
          // default forward tab is okay
        } else {
          // shift+tab is okay, but handle if you want to override
        }
        break;
      case "Enter":
        // Move down one row, same column
        e.preventDefault();
        focusCell(rowIndex + 1, colIndex);
        break;
      default:
        break;
    }
  };

  return (
    <div className="mt-10">
      <Title level={4} className="mb-2">
        Rows
      </Title>

      {/* 
         Wrap your entire rows area in a horizontally-scrollable container
         if there are more than 5 columns.
       */}
      <div
        className={`my-4 border border-gray-300 rounded-md p-4 ${
          headers.length > 5 ? "overflow-x-auto" : ""
        }`}
        style={{ maxWidth: "100%" }}
      >
        {/* We'll mimic a table by using a CSS grid or flex. 
            Here, let's go with flex for each row, 
            but you could also do display: table-row / table-cell if you prefer.
        */}
        {rows?.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-row items-stretch last:mb-0">
            {headers.map((colObj, colIndex) => (
              <Form.Item key={`${rowIndex}_${colIndex}`} className="!mb-0">
                <Input
                  placeholder={`Row ${rowIndex + 1} - ${colObj.name}`}
                  value={row[colIndex]}
                  onChange={(e) =>
                    updateCell(e.target.value, rowIndex, colIndex)
                  }
                  onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                  className="border-gray-300 text-center"
                  ref={cellRefs.current?.[rowIndex]?.[colIndex]}
                  style={{
                    minWidth: "120px",
                    borderRadius: 0,
                    borderRight: "1px solid #ddd",
                    borderBottom: "1px solid #ddd",
                  }}
                />
              </Form.Item>
            ))}
            {/* Remove row button */}
            {rows.length > 1 && (
              <Popconfirm
                title="Are you sure you want to delete this row?"
                onConfirm={() => removeRow(rowIndex)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<MinusOutlined />}
                  type="text"
                  style={{ marginLeft: 4 }}
                />
              </Popconfirm>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button onClick={addRow} icon={<PlusOutlined />} className="mavebutton">
          Add Row
        </Button>
      </div>
    </div>
  );
};

export default RowsSection;
