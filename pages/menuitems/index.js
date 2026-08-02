// pages/MenuItems.js

import React, { useState, useEffect } from "react";
import { message, Modal, Pagination } from "antd";
import instance from "../../axios";
import { setPageTitle } from "../../global/constants/pageTitle";
import Loader from "../../components/Loader";
import MenuItemsHeader from "../../components/MenuItems/MenuItemsHeader";
import AddMenuItemForm from "../../components/MenuItems/AddMenuItemForm";
import MenuItemsList from "../../components/MenuItems/MenuItemsList";
import { useGlobalRefresh } from "../../src/context/MenuRefreshContext";

const LOCAL_KEY_ITEMS = "mave_menuItems";
const LOCAL_KEY_PAGES = "mave_pages";

const MenuItems = () => {
  // Page Title
  useEffect(() => {
    setPageTitle("Menu Items");
  }, []);

  const [menuItems, setMenuItems] = useState([]);
  const [initialMenuItems, setInitialMenuItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // We store pages and menuItems in local state & localStorage
  const [pages, setPages] = useState([]);
  const [sortType, setSortType] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [allMenuItems, setAllMenuItems] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalMenuItems, setTotalMenuItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState({ parent_id: undefined });

  // ------------------------------
  //   Load from LocalStorage
  // ------------------------------
  const loadFromLocalStorage = () => {
    try {
      const storedItems =
        JSON.parse(localStorage.getItem(LOCAL_KEY_ITEMS)) || [];
      const storedPages =
        JSON.parse(localStorage.getItem(LOCAL_KEY_PAGES)) || [];
      if (storedItems.length > 0) {
        setAllMenuItems(storedItems);
        setInitialMenuItems(storedItems);
      }
      if (storedPages.length > 0) {
        setPages(storedPages);
      }
    } catch (err) {
      // Ignore parse errors
    }
  };

  // ------------------------------
  //   Fetch from server
  // ------------------------------
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await instance("/menuitems");
      if (response.data) {
        const data = response.data;
        // Sort once (asc or desc by id)
        const sortedData = data.sort((a, b) =>
          sortType === "asc" ? a.id - b.id : b.id - a.id
        );

        setMenuItems(sortedData);
        setAllMenuItems(data);
        setInitialMenuItems(sortedData);
        setTotalMenuItems(data.length);

        // Save to localStorage
        localStorage.setItem(LOCAL_KEY_ITEMS, JSON.stringify(data));
      } else {
        message.error("Menu items couldn't be fetched");
      }
    } catch (error) {
      message.error("Menu items couldn't be fetched");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await instance("/pages");
      if (response.data) {
        setPages(response.data);
        localStorage.setItem(LOCAL_KEY_PAGES, JSON.stringify(response.data));
      } else {
        message.error("Pages couldn't be fetched");
      }
    } catch (error) {
      message.error("Pages couldn't be fetched");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  //   Effects
  // ------------------------------
  useEffect(() => {
    // First, try loading from localStorage
    loadFromLocalStorage();
    // Then fetch fresh data (only once on mount)
    fetchMenuItems();
    fetchPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGlobalRefresh(() => {
    fetchMenuItems();
    fetchPages();
  });

  // Whenever sortType changes, re-sort local data (avoid extra server calls)
  useEffect(() => {
    const sorted = [...allMenuItems].sort((a, b) =>
      sortType === "asc" ? a.id - b.id : b.id - a.id
    );
    setMenuItems(sorted);
    setInitialMenuItems(sorted);
  }, [sortType, allMenuItems]);

  // Handle search & filter
  useEffect(() => {
    let filtered = [...initialMenuItems];

    // Search
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Filter by parent
    if (filters.parent_id) {
      filtered = filtered.filter(
        (item) => item.parent_id === filters.parent_id
      );
    }

    setMenuItems(filtered);
    setTotalMenuItems(filtered.length);
    setCurrentPage(1);
  }, [searchTerm, filters, initialMenuItems]);

  // ------------------------------
  //   Handlers
  // ------------------------------
  const handleAddMenuItem = () => setIsAddMenuItemOpen(true);
  const handleCancelAddMenuItem = () => setIsAddMenuItemOpen(false);

  const handleReset = () => {
    setSearchTerm("");
    setSortType("asc");
    setFilters({ parent_id: undefined });
    setSelectedItemIds([]);
    // If you want to re-fetch from server for a true reset:
    // fetchMenuItems();
    // Otherwise, you can just rely on initialMenuItems
    const sorted = [...allMenuItems].sort((a, b) => a.id - b.id);
    setMenuItems(sorted);
    setInitialMenuItems(sorted);
  };

  const handleFilter = () => {
    // The filter modal is handled in MenuItemsHeader (openFilterModal)
  };

  const onShowChange = (value) => {
    setItemsPerPage(parseInt(value, 10));
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (selectedItemIds.length === menuItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(menuItems.map((item) => item.id));
    }
  };

  const applyFilters = (filterValues) => setFilters(filterValues);
  const resetFilters = () => setFilters({ parent_id: undefined });

  const handlePaginationChange = (page) => {
    setCurrentPage(page);
  };

  // ------------------------------
  //   Derived Data
  // ------------------------------
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMenuItems = menuItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ------------------------------
  //   Render
  // ------------------------------
  // Loader or "No Items"?
  const renderContent = () => {
    // If still loading, show loader
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      );
    }
    // If not loading and no items
    if (!loading && menuItems.length === 0) {
      return (
        <div className="text-center py-8">
          <h2>No Menu Items Found</h2>
        </div>
      );
    }

    // Else show list + pagination
    return (
      <>
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
        <div className="flex justify-end mt-4">
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={totalMenuItems}
            onChange={handlePaginationChange}
            showSizeChanger={false}
          />
        </div>
      </>
    );
  };

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl">
      <MenuItemsHeader
        onAddMenuItem={handleAddMenuItem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortType={sortType}
        setSortType={setSortType}
        handleFilter={handleFilter}
        onShowChange={onShowChange}
        handleSelectAll={handleSelectAll}
        allSelected={
          selectedItemIds.length === menuItems.length && menuItems.length > 0
        }
        filterOptions={{
          parentMenus: pages,
        }}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
        onRefresh={() => {
          fetchMenuItems();
          fetchPages();
        }}
      />

      {/* Add Menu Item Modal */}
      <Modal
        open={isAddMenuItemOpen}
        onCancel={handleCancelAddMenuItem}
        footer={null}
        title={
          <div className="flex items-center gap-2 pb-5 border-b-2 border-gray-200">
            <img
              src="/icons/mave/menuitems.svg"
              alt="Menu Items"
              className="w-6"
            />
            <span>Add Menu Item</span>
          </div>
        }
        width={800}
      >
        <AddMenuItemForm
          pages={pages}
          menuItems={menuItems}
          onCancel={handleCancelAddMenuItem}
          fetchMenuItems={fetchMenuItems}
        />
      </Modal>

      {/* Main Content */}
      {renderContent()}
    </div>
  );
};

export default MenuItems;
