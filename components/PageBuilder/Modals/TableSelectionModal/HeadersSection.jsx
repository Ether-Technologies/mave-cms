// TableSelectionModal/HeadersSection.jsx

import React, { useCallback, useMemo } from "react";
import { Form, Input, Button, Typography, Checkbox } from "antd";
import { PlusOutlined, MinusOutlined, DragOutlined } from "@ant-design/icons";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";

const { Title } = Typography;

/** Helper to reorder an array by dragging an item from one index to another. */
const reorderArray = (array, startIndex, endIndex) => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/** Reorder columns in each row of the table data. */
const reorderColumnsInRows = (rows, sourceIndex, destIndex) => {
  return rows.map((row) => {
    const newRow = [...row];
    const [removed] = newRow.splice(sourceIndex, 1);
    newRow.splice(destIndex, 0, removed);
    return newRow;
  });
};

// Sortable header item component
const SortableHeaderItem = React.memo(
  ({
    colObj,
    index,
    headers,
    visibleColumns,
    updateHeaderName,
    toggleColumnVisibility,
    removeHeader,
  }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: colObj.id,
    });

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
        <div
          {...listeners}
          {...attributes}
          className="flex items-center gap-2 cursor-move"
        >
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
        <Button icon={<DragOutlined />} style={{ cursor: "grab" }} />
      </div>
    );
  }
);

SortableHeaderItem.displayName = "SortableHeaderItem";

const HeadersSection = React.memo(
  ({
    headers, // array of { id, name }
    setHeaders,
    visibleColumns, // array of booleans
    setVisibleColumns,
    rows, // array of arrays
    setRows,
    filterColumns, // array of header names
    setFilterColumns,
  }) => {
    // Add a new column
    const addHeader = useCallback(() => {
      // 1) Add a new header object
      const newHeader = { id: uuidv4(), name: `Column ${headers.length + 1}` };
      setHeaders([...headers, newHeader]);

      // 2) Make it visible by default
      setVisibleColumns([...visibleColumns, true]);

      // 3) Also append an empty cell to every row
      const updatedRows = rows.map((r) => [...r, ""]);
      setRows(updatedRows);
    }, [headers, visibleColumns, rows, setHeaders, setVisibleColumns, setRows]);

    // Remove a column at index
    const removeHeader = useCallback(
      (index) => {
        // 1) Remove from headers
        const newHeaders = headers.filter((_, i) => i !== index);
        // 2) Remove from visibleColumns
        const newVisible = visibleColumns.filter((_, i) => i !== index);
        // 3) Remove that column from each row
        const newRows = rows.map((r) => {
          const rowCopy = [...r];
          rowCopy.splice(index, 1);
          return rowCopy;
        });

        setHeaders(newHeaders);
        setVisibleColumns(newVisible);
        setRows(newRows);
      },
      [headers, visibleColumns, rows, setHeaders, setVisibleColumns, setRows]
    );

    // Update the header text
    const updateHeaderName = useCallback(
      (value, index) => {
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
      },
      [headers, filterColumns, setHeaders, setFilterColumns]
    );

    // Toggle a column's visibility
    const toggleColumnVisibility = useCallback(
      (index, checked) => {
        const updatedVis = [...visibleColumns];
        updatedVis[index] = checked;
        setVisibleColumns(updatedVis);
      },
      [visibleColumns, setVisibleColumns]
    );

    // Reorder columns when user drags
    const onDragEnd = useCallback(
      (event) => {
        const { active, over } = event;

        if (!over) return;
        if (active.id === over.id) return;

        // Find the indices
        const activeIndex = headers.findIndex(
          (header) => header.id === active.id
        );
        const overIndex = headers.findIndex((header) => header.id === over.id);

        if (activeIndex === -1 || overIndex === -1) return;
        if (activeIndex === overIndex) return;

        // Reorder the headers
        const reorderedHeaders = reorderArray(headers, activeIndex, overIndex);
        // Reorder the visibility array
        const reorderedVisible = reorderArray(
          visibleColumns,
          activeIndex,
          overIndex
        );
        // Reorder the columns in rows
        const reorderedRows = reorderColumnsInRows(
          rows,
          activeIndex,
          overIndex
        );

        setHeaders(reorderedHeaders);
        setVisibleColumns(reorderedVisible);
        setRows(reorderedRows);
      },
      [headers, visibleColumns, rows, setHeaders, setVisibleColumns, setRows]
    );

    // Create sortable items array
    const sortableItems = headers.map((header) => header.id);

    return (
      <>
        <Title level={4}>Columns</Title>
        <DndContext onDragEnd={onDragEnd}>
          <SortableContext
            items={sortableItems}
            strategy={verticalListSortingStrategy}
          >
            <div className="bg-orange-100 p-4 rounded-lg flex flex-row flex-wrap gap-4 border-2 border-gray-400">
              {headers.map((colObj, index) => (
                <SortableHeaderItem
                  key={colObj.id}
                  colObj={colObj}
                  index={index}
                  headers={headers}
                  visibleColumns={visibleColumns}
                  updateHeaderName={updateHeaderName}
                  toggleColumnVisibility={toggleColumnVisibility}
                  removeHeader={removeHeader}
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
  }
);

HeadersSection.displayName = "HeadersSection";

export default HeadersSection;
