import React, { useMemo, useCallback } from "react";
import { Select, Typography } from "antd";

const { Option } = Select;
const { Text } = Typography;

const FilterableColumns = React.memo(
  ({ headers, filterColumns, setFilterColumns }) => {
    // Memoized options for better performance
    const options = useMemo(
      () =>
        headers.map((colObj) => ({
          key: colObj.id,
          value: colObj.name,
          label: colObj.name,
        })),
      [headers]
    );

    // Optimized change handler
    const handleChange = useCallback(
      (values) => {
        setFilterColumns(values);
      },
      [setFilterColumns]
    );

    // Memoized select props
    const selectProps = useMemo(
      () => ({
        mode: "multiple",
        style: { width: "100%", marginBottom: 16 },
        placeholder: "Select filterable columns",
        value: filterColumns,
        onChange: handleChange,
        showSearch: true,
        filterOption: (input, option) =>
          option?.label?.toLowerCase().includes(input.toLowerCase()),
        maxTagCount: 3,
        maxTagTextLength: 10,
      }),
      [filterColumns, handleChange]
    );

    return (
      <div className="filterable-columns">
        <Text type="secondary" className="block mb-2">
          Choose which columns should have search/filter functionality in the
          preview table.
        </Text>
        <Select {...selectProps}>
          {options.map((option) => (
            <Option key={option.key} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    );
  }
);

FilterableColumns.displayName = "FilterableColumns";

export default FilterableColumns;
