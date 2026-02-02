import React, { useRef, useEffect } from "react";
import { Form, Input, Button, Typography, Popconfirm, message } from "antd";
import { PlusOutlined, MinusOutlined, DragOutlined } from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

const { Title } = Typography;

const SortableRow = ({
  row,
  rowIndex,
  headers,
  updateCell,
  handleKeyDown,
  removeRow,
  rowsCount,
  cellRefs,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : "auto",
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white ${isDragging ? "shadow-lg" : ""}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center px-2 border-b border-l border-gray-300 bg-gray-50"
        style={{ cursor: "grab" }}
      >
        <DragOutlined />
      </div>

      {headers.map((colObj, colIndex) => (
        <Form.Item key={`${row.id}_${colIndex}`} className="!mb-0">
          <Input
            placeholder={`Row ${rowIndex + 1} - ${colObj.name}`}
            value={row.data[colIndex]}
            onChange={(e) => updateCell(e.target.value, rowIndex, colIndex)}
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
      {rowsCount > 1 && (
        <div className="flex items-center px-2 border-b border-gray-300">
          <Popconfirm
            title="Are you sure you want to delete this row?"
            onConfirm={() => removeRow(rowIndex)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<MinusOutlined />} type="text" />
          </Popconfirm>
        </div>
      )}
    </div>
  );
};

const RowsSection = ({ headers, rows, setRows }) => {
  // We'll store references to each cell in a 2D array (row x col)
  // so we can programmatically move focus with arrow keys, tab, etc.
  const cellRefs = useRef([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    const newRow = { id: uuidv4(), data: Array(headers.length).fill("") };
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
        ? {
          ...row,
          data: [
            ...row.data.slice(0, colIndex),
            value,
            ...row.data.slice(colIndex + 1),
          ],
        }
        : row
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = rows.findIndex((row) => row.id === active.id);
      const newIndex = rows.findIndex((row) => row.id === over.id);
      setRows(arrayMove(rows, oldIndex, newIndex));
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
        className={`my-4 border border-gray-300 rounded-md p-4 ${headers.length > 5 ? "overflow-x-auto" : ""
          }`}
        style={{ maxWidth: "100%" }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            {rows?.map((row, rowIndex) => (
              <SortableRow
                key={row.id}
                row={row}
                rowIndex={rowIndex}
                headers={headers}
                updateCell={updateCell}
                handleKeyDown={handleKeyDown}
                removeRow={removeRow}
                rowsCount={rows.length}
                cellRefs={cellRefs}
              />
            ))}
          </SortableContext>
        </DndContext>
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
