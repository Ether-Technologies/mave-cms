import React from "react";
import { Button, Empty, Input, Popconfirm, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const MenusSidebar = ({
  menus,
  selectedMenuId,
  onSelectMenu,
  onDeleteMenu,
  onRenameMenu,
  searchTerm,
  setSearchTerm,
}) => {
  const [editingId, setEditingId] = React.useState(null);
  const [draftName, setDraftName] = React.useState("");

  const filtered = menus.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (menu) => {
    setEditingId(menu.id);
    setDraftName(menu.name);
  };

  const commitEdit = (menu) => {
    if (draftName.trim()) {
      onRenameMenu(menu, draftName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/80">
        <div className="flex items-center gap-2 mb-3">
          <MenuOutlined className="text-gray-600" />
          <span className="font-semibold text-gray-800">Menus</span>
        </div>
        <Input
          allowClear
          placeholder="Search menus…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="middle"
        />
      </div>
      <div className="flex-1 min-h-0 navigation-scroll p-2 space-y-1">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No menus yet"
            className="py-8"
          />
        ) : (
          filtered.map((menu) => {
            const selected = menu.id === selectedMenuId;
            const editing = editingId === menu.id;
            return (
              <div
                key={menu.id}
                className={`group rounded-lg border transition-all ${
                  selected
                    ? "border-gray-800 bg-gray-900 text-white shadow-md"
                    : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                }`}
              >
                {editing ? (
                  <div className="p-2 flex items-center gap-1">
                    <Input
                      size="small"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onPressEnter={() => commitEdit(menu)}
                      autoFocus
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => commitEdit(menu)}
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectMenu(menu.id)}
                    className="w-full text-left p-3 flex items-center justify-between gap-2"
                  >
                    <span className="font-medium truncate">{menu.name}</span>
                    <span
                      className={`text-xs shrink-0 ${
                        selected ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {(menu.menu_item_ids || []).length} roots
                    </span>
                  </button>
                )}
                {!editing && (
                  <div
                    className={`px-2 pb-2 flex gap-1 justify-end ${
                      selected ? "" : "opacity-0 group-hover:opacity-100"
                    } transition-opacity`}
                  >
                    <Tooltip title="Rename">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        className={selected ? "text-gray-300" : ""}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(menu);
                        }}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete this menu?"
                      onConfirm={() => onDeleteMenu(menu.id)}
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                    >
                      <Button
                        type="text"
                        size="small"
                        danger={!selected}
                        icon={<DeleteOutlined />}
                        className={selected ? "!text-red-300" : ""}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MenusSidebar;
