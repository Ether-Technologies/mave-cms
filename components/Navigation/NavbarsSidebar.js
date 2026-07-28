import React from "react";
import { Button, Empty, Input, Popconfirm, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const NavbarsSidebar = ({
  navbars,
  selectedNavbarId,
  onSelectNavbar,
  onDeleteNavbar,
  onRenameNavbar,
  searchTerm,
  setSearchTerm,
}) => {
  const [editingId, setEditingId] = React.useState(null);
  const [draftTitle, setDraftTitle] = React.useState("");

  const filtered = navbars.filter((n) =>
    (n.title_en || n.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const startEdit = (navbar) => {
    setEditingId(navbar.id);
    setDraftTitle(navbar.title_en || "");
  };

  const commitEdit = (navbar) => {
    if (draftTitle.trim()) {
      onRenameNavbar(navbar, draftTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/80">
        <div className="flex items-center gap-2 mb-3">
          <Image src="/icons/mave/navbar.svg" width={18} height={18} alt="" />
          <span className="font-semibold text-gray-800">Navbars</span>
        </div>
        <Input
          allowClear
          placeholder="Search navbars…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="middle"
        />
      </div>
      <div className="flex-1 min-h-0 navigation-scroll p-2 space-y-1">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No navbars yet"
            className="py-8"
          />
        ) : (
          filtered.map((navbar) => {
            const selected = navbar.id === selectedNavbarId;
            const editing = editingId === navbar.id;
            return (
              <div
                key={navbar.id}
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
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onPressEnter={() => commitEdit(navbar)}
                      autoFocus
                    />
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      onClick={() => commitEdit(navbar)}
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
                    onClick={() => onSelectNavbar(navbar.id)}
                    className="w-full text-left p-3 flex items-center justify-between gap-2"
                  >
                    <span className="font-medium truncate">
                      {navbar.title_en}
                    </span>
                    <span
                      className={`text-xs shrink-0 ${
                        selected ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {navbar.menu?.name || "No menu"}
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
                          startEdit(navbar);
                        }}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Delete this navbar?"
                      onConfirm={() => onDeleteNavbar(navbar.id)}
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

export default NavbarsSidebar;
