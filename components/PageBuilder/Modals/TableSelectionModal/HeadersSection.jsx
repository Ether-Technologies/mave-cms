// TableSelectionModal/HeadersSection.jsx

import React from "react";
import { Form, Input, Button, Typography, Checkbox } from "antd";
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
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

const { Title } = Typography;

/** Reorder columns in each row of the table data. */
const reorderColumnsInRows = (rows, sourceIndex, destIndex) => {
  return rows.map((row) => {
    const newData = [...row.data];
    const [removed] = newData.splice(sourceIndex, 1);
    newData.splice(destIndex, 0, removed);
    return { ...row, data: newData };
  });
};

// Sortable Header Item Component
const SortableHeaderItem = ({
  colObj,
  index,
  visibleColumns,
  toggleColumnVisibility,
  updateHeaderName,
  removeHeader,
  headers,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: colObj.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center bg-white my-2 rounded-lg py-2 px-4 gap-2 border-2 border-gray-300 shadow-md"
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <Button
          icon={<DragOutlined />}
          style={{ cursor: "grab" }}
          {...attributes}
          {...listeners}
        />

        {/* Header text input */}
        <Form.Item
          name={`header_${index}`}
          initialValue={colObj.name}
          rules={[
            {
              required: true,
              message: "Header cannot be empty.",
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input
            style={{ width: 180, marginRight: 8 }}
            placeholder={`Column ${index + 1}`}
            onChange={(e) => updateHeaderName(e.target.value, index)}
          />
        </Form.Item>

        {/* Visibility checkbox */}
        <Checkbox
          checked={visibleColumns[index]}
          onChange={(e) => toggleColumnVisibility(index, e.target.checked)}
          style={{ marginRight: 8 }}
        >
          Visible
        </Checkbox>

        {/* Remove button */}
        {headers.length > 1 && (
          <Button
            icon={<MinusOutlined />}
            danger
            onClick={() => removeHeader(index)}
          />
        )}
      </div>
    </div>
  );
};

const HeadersSection = ({
  headers, // array of { id, name }
  setHeaders,
  visibleColumns, // array of booleans
  setVisibleColumns,
  rows, // array of arrays
  setRows,
  filterColumns, // array of header names
  setFilterColumns,
}) => {
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add a new column
  const addHeader = () => {
    // 1) Add a new header object
    const newHeader = { id: uuidv4(), name: `Column ${headers.length + 1}` };
    setHeaders([...headers, newHeader]);

    // 2) Make it visible by default
    setVisibleColumns([...visibleColumns, true]);

    // 3) Also append an empty cell to every row
    const updatedRows = rows.map((r) => ({ ...r, data: [...r.data, ""] }));
    setRows(updatedRows);
  };

  // Remove a column at index
  const removeHeader = (index) => {
    // 1) Remove from headers
    const newHeaders = headers.filter((_, i) => i !== index);
    // 2) Remove from visibleColumns
    const newVisible = visibleColumns.filter((_, i) => i !== index);
    // 3) Remove that column from each row
    const newRows = rows.map((r) => {
      const dataCopy = [...r.data];
      dataCopy.splice(index, 1);
      return { ...r, data: dataCopy };
    });

    setHeaders(newHeaders);
    setVisibleColumns(newVisible);
    setRows(newRows);
  };

  // Update the header text
  const updateHeaderName = (value, index) => {
    const oldName = headers[index].name;
    const updated = [...headers];
    updated[index] = { ...updated[index], name: value };
    setHeaders(updated);

    if (filterColumns.includes(oldName)) {
      const newFilterColumns = filterColumns.map((fc) =>
        fc === oldName ? value : fc
      );
      setFilterColumns(newFilterColumns);
    }
  };

  // Toggle a column's visibility
  const toggleColumnVisibility = (index, checked) => {
    const updatedVis = [...visibleColumns];
    updatedVis[index] = checked;
    setVisibleColumns(updatedVis);
  };

  // Handle drag end event
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = headers.findIndex((header) => header.id === active.id);
      const newIndex = headers.findIndex((header) => header.id === over.id);

      // Reorder the headers
      const reorderedHeaders = arrayMove(headers, oldIndex, newIndex);

      // Reorder the visibility array
      const reorderedVisible = arrayMove(visibleColumns, oldIndex, newIndex);

      // Reorder the columns in rows
      const reorderedRows = reorderColumnsInRows(rows, oldIndex, newIndex);

      setHeaders(reorderedHeaders);
      setVisibleColumns(reorderedVisible);
      setRows(reorderedRows);
    }
  };

  return (
    <>
      <Title level={4}>Columns</Title>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={headers.map((header) => header.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="bg-gray-800 p-4 rounded-lg flex flex-row flex-wrap gap-4 border-2 border-gray-400">
            {headers.map((colObj, index) => (
              <SortableHeaderItem
                key={colObj.id}
                colObj={colObj}
                index={index}
                visibleColumns={visibleColumns}
                toggleColumnVisibility={toggleColumnVisibility}
                updateHeaderName={updateHeaderName}
                removeHeader={removeHeader}
                headers={headers}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <center>
        <Button
          onClick={addHeader}
          icon={<PlusOutlined />}
          className="mavebutton mt-4"
        >
          Add Column
        </Button>
      </center>
    </>
  );
};

export default HeadersSection;
