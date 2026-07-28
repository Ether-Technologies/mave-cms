import React, { useEffect, useState } from "react";
import { message, Modal, Pagination } from "antd";
import instance from "../../axios";
import Loader from "../Loader";
import MenuItemsHeader from "../MenuItems/MenuItemsHeader";
import AddMenuItemForm from "../MenuItems/AddMenuItemForm";
import MenuItemsList from "../MenuItems/MenuItemsList";

const NavigationAllItemsTab = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [initialMenuItems, setInitialMenuItems] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("desc");
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [filters, setFilters] = useState({ parent_id: undefined });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalMenuItems, setTotalMenuItems] = useState(0);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await instance("/menuitems");
      if (response.data) {
        const data = response.data;
        setAllMenuItems(data);
        setInitialMenuItems(data);
        setMenuItems(data);
        setTotalMenuItems(data.length);
      }
    } catch {
      message.error("Menu items couldn't be fetched");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const response = await instance("/pages");
      if (response.data) setPages(response.data);
    } catch {
      message.error("Pages couldn't be fetched");
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchPages();
  }, []);

  useEffect(() => {
    let filtered = [...initialMenuItems];
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.parent_id) {
      filtered = filtered.filter(
        (item) => item.parent_id === filters.parent_id
      );
    }
    filtered.sort((a, b) =>
      sortType === "asc" ? a.id - b.id : b.id - a.id
    );
    setMenuItems(filtered);
    setTotalMenuItems(filtered.length);
    setCurrentPage(1);
  }, [searchTerm, filters, initialMenuItems, sortType]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMenuItems = menuItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading && menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 mt-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-4 navigation-all-items-panel">
      <MenuItemsHeader
        compact
        onAddMenuItem={() => setIsAddOpen(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortType={sortType}
        setSortType={setSortType}
        handleFilter={() => {}}
        onShowChange={(value) => {
          setItemsPerPage(parseInt(value, 10));
          setCurrentPage(1);
        }}
        handleSelectAll={() => {
          if (selectedItemIds.length === menuItems.length) {
            setSelectedItemIds([]);
          } else {
            setSelectedItemIds(menuItems.map((item) => item.id));
          }
        }}
        allSelected={
          selectedItemIds.length === menuItems.length && menuItems.length > 0
        }
        filterOptions={{ parentMenus: pages }}
        applyFilters={setFilters}
        resetFilters={() => setFilters({ parent_id: undefined })}
      />

      <Modal
        open={isAddOpen}
        onCancel={() => setIsAddOpen(false)}
        footer={null}
        title="Add menu item"
        width={800}
      >
        <AddMenuItemForm
          pages={pages}
          menuItems={allMenuItems}
          onCancel={() => setIsAddOpen(false)}
          fetchMenuItems={fetchMenuItems}
        />
      </Modal>

      {menuItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No menu items found</div>
      ) : (
        <>
          <div className="navigation-all-items-scroll navigation-scroll mt-4 pr-1">
            <MenuItemsList
              menuItems={paginatedMenuItems}
              pages={pages}
              allMenuItems={allMenuItems}
              setMenuItems={setMenuItems}
              editingItemId={editingItemId}
              setEditingItemId={setEditingItemId}
              selectedItemIds={selectedItemIds}
              setSelectedItemIds={setSelectedItemIds}
            />
          </div>
          <div className="flex justify-end mt-4 shrink-0 pb-2">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalMenuItems}
              onChange={setCurrentPage}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationAllItemsTab;
