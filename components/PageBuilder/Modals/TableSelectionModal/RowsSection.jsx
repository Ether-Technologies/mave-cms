import React, {
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Popconfirm,
  message,
  Spin,
} from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Title } = Typography;

// Debounce hook for performance
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling component for large datasets
const VirtualRow = React.memo(
  ({
    row,
    rowIndex,
    headers,
    onUpdateCell,
    onKeyDown,
    cellRefs,
    isVisible,
  }) => {
    if (!isVisible) return null;

    return (
      <div className="flex flex-row items-stretch last:mb-0">
        {headers.map((colObj, colIndex) => (
          <Form.Item key={`${rowIndex}_${colIndex}`} className="!mb-0">
            <Input
              placeholder={`Row ${rowIndex + 1} - ${colObj.name}`}
              value={row[colIndex] || ""}
              onChange={(e) => onUpdateCell(e.target.value, rowIndex, colIndex)}
              onKeyDown={(e) => onKeyDown(e, rowIndex, colIndex)}
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
      </div>
    );
  }
);

VirtualRow.displayName = "VirtualRow";

const RowsSection = React.memo(({ headers, rows, setRows }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });

  // We'll store references to each cell in a 2D array (row x col)
  // so we can programmatically move focus with arrow keys, tab, etc.
  const cellRefs = useRef([]);
  const containerRef = useRef(null);

  // Debounced row updates for better performance
  const debouncedRows = useDebounce(rows, 300);

  // Ensure cellRefs always matches the shape of the rows array
  useEffect(() => {
    cellRefs.current = rows.map((r, rowIndex) =>
      headers.map(
        (_, colIndex) =>
          cellRefs.current?.[rowIndex]?.[colIndex] || React.createRef()
      )
    );
  }, [rows, headers]);

  // Optimized add row function
  const addRow = useCallback(() => {
    if (headers.length === 0) {
      message.info("No headers defined. Please add columns first.");
      return;
    }

    setIsLoading(true);

    // Use setTimeout to prevent blocking UI
    setTimeout(() => {
      // create a new row with empty cells matching # of headers
      const newRow = Array(headers.length).fill("");
      setRows((prev) => [...prev, newRow]);

      // Focus on the first cell of the newly added row
      setTimeout(() => {
        const newRowIndex = rows.length; // because it was just pushed
        cellRefs.current?.[newRowIndex]?.[0]?.current?.focus();
        setIsLoading(false);
      }, 0);
    }, 0);
  }, [headers, rows, setRows]);

  // Optimized remove row function
  const removeRow = useCallback(
    (index) => {
      if (rows.length === 1) return;

      setIsLoading(true);
      setTimeout(() => {
        const updated = rows.filter((_, i) => i !== index);
        setRows(updated);
        setIsLoading(false);
      }, 0);
    },
    [rows, setRows]
  );

  // Optimized cell update function with debouncing
  const updateCell = useCallback(
    (value, rowIndex, colIndex) => {
      const updated = rows.map((row, index) =>
        index === rowIndex
          ? [...row.slice(0, colIndex), value, ...row.slice(colIndex + 1)]
          : [...row]
      );
      setRows(updated);
    },
    [rows, setRows]
  );

  // Optimized keyboard navigation
  const handleKeyDown = useCallback(
    (e, rowIndex, colIndex) => {
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
          // We rely on the browser's default Tab to jump to the next input,
          // but we handle SHIFT+Tab to go backward if needed
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
    },
    [rows, headers]
  );

  // Virtual scrolling for large datasets
  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight } = e.target;
      const rowHeight = 50; // Approximate row height
      const start = Math.floor(scrollTop / rowHeight);
      const end = Math.min(
        start + Math.ceil(clientHeight / rowHeight) + 10,
        rows.length
      );

      setVisibleRange({ start, end });
    },
    [rows.length]
  );

  // Memoized visible rows
  const visibleRows = useMemo(() => {
    return rows
      .slice(visibleRange.start, visibleRange.end)
      .map((row, index) => ({
        ...row,
        originalIndex: visibleRange.start + index,
      }));
  }, [rows, visibleRange]);

  // Memoized container styles
  const containerStyles = useMemo(
    () => ({
      maxWidth: "100%",
      height: rows.length > 100 ? "400px" : "auto",
      overflowY: rows.length > 100 ? "auto" : "visible",
    }),
    [rows.length]
  );

  // Memoized grid styles
  const gridStyles = useMemo(
    () => ({
      minHeight: rows.length > 100 ? `${rows.length * 50}px` : "auto",
      position: rows.length > 100 ? "relative" : "static",
    }),
    [rows.length]
  );

  return (
    <div className="mt-10">
      <Title level={4} className="mb-2">
        Rows {rows.length > 0 && `(${rows.length} total)`}
      </Title>

      {isLoading && (
        <div className="flex justify-center my-4">
          <Spin size="small" />
        </div>
      )}

      {/* 
         Wrap your entire rows area in a horizontally-scrollable container
         if there are more than 5 columns.
       */}
      <div
        ref={containerRef}
        className={`my-4 border border-gray-300 rounded-md p-4 ${
          headers.length > 5 ? "overflow-x-auto" : ""
        }`}
        style={containerStyles}
        onScroll={rows.length > 100 ? handleScroll : undefined}
      >
        {/* Virtual scrolling container */}
        <div style={gridStyles}>
          {visibleRows.map((row, index) => (
            <VirtualRow
              key={`${row.originalIndex}_${index}`}
              row={row}
              rowIndex={row.originalIndex}
              headers={headers}
              onUpdateCell={updateCell}
              onKeyDown={handleKeyDown}
              cellRefs={cellRefs}
              isVisible={true}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={addRow}
          icon={<PlusOutlined />}
          className="mavebutton"
          loading={isLoading}
        >
          Add Row
        </Button>
      </div>
    </div>
  );
});

RowsSection.displayName = "RowsSection";

export default RowsSection;
