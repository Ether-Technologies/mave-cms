import { Select } from "antd";

const { Option } = Select;

export default function FilterableColumns({
  headers,
  filterColumns,
  setFilterColumns,
}) {
  return (
    <div>
      <Select
        mode="multiple"
        style={{ width: "100%", marginBottom: 16 }}
        placeholder="Select filterable columns"
        value={filterColumns}
        onChange={setFilterColumns}
      >
        {headers.map((colObj) => (
          <Option key={colObj.id} value={colObj.name}>
            {colObj.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
