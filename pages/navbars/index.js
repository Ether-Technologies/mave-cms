// pages/Navbars.js

import React, { useState, useEffect } from "react";
import { message, Modal } from "antd";
import instance from "../../axios";
import { setPageTitle } from "../../global/constants/pageTitle";
import Loader from "../../components/Loader";
import NavbarHeader from "../../components/Navbars/NavbarHeader";
import AddNavbarForm from "../../components/Navbars/AddNavbarForm";
import NavbarsList from "../../components/Navbars/NavbarsList";
import { useGlobalRefresh } from "../../src/context/MenuRefreshContext";

const Navbars = () => {
  useEffect(() => {
    setPageTitle("Navbars");
  }, []);

  const [navbars, setNavbars] = useState([]);
  const [initialNavbars, setInitialNavbars] = useState([]);
  const [menus, setMenus] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingNavbarId, setEditingNavbarId] = useState(null);
  const [isAddNavbarOpen, setIsAddNavbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("asc");
  const [selectedNavbarIds, setSelectedNavbarIds] = useState([]);

  const fetchNavbars = async () => {
    try {
      setLoading(true);
      const response = await instance("/navbars");
      if (response.data) {
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        setNavbars(sortedData);
        setInitialNavbars(sortedData);
      } else {
        message.error("Navbars couldn't be fetched");
      }
    } catch (err) {
      message.error("Navbars couldn't be fetched");
    }
    setLoading(false);
  };

  const fetchMenus = async () => {
    try {
      const response = await instance("/menus");
      if (response.data) {
        setMenus(response.data);
      } else {
        message.error("Menus couldn't be fetched");
      }
    } catch (err) {
      message.error("Menus couldn't be fetched");
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await instance("/media");
      if (response.data) {
        setMedia(response.data);
      } else {
        message.error("Media couldn't be fetched");
      }
    } catch (err) {
      message.error("Media couldn't be fetched");
    }
  };

  useEffect(() => {
    fetchNavbars();
    fetchMenus();
    fetchMedia();
  }, []);

  useGlobalRefresh(() => {
    fetchNavbars();
    fetchMenus();
    fetchMedia();
  });

  useEffect(() => {
    const results = initialNavbars.filter((navbar) =>
      navbar.title_en.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setNavbars(results);
  }, [searchTerm]);

  useEffect(() => {
    const sortedNavbars = [...navbars].sort((a, b) =>
      sortType === "asc" ? a.id - b.id : b.id - a.id
    );
    setNavbars(sortedNavbars);
  }, [sortType]);

  const handleAddNavbar = () => {
    setIsAddNavbarOpen(true);
  };

  const handleCancelAddNavbar = () => {
    setIsAddNavbarOpen(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortType("asc");
    // fetchNavbars();
    setNavbars(initialNavbars);
  };

  const handleSelectAll = () => {
    if (selectedNavbarIds.length === navbars.length) {
      setSelectedNavbarIds([]);
    } else {
      setSelectedNavbarIds(navbars?.map((item) => item.id));
    }
  };

  const onShowChange = (id) => {
    const updatedNavbars = navbars?.map((navbar) =>
      navbar.id === id ? { ...navbar, show: !navbar.show } : navbar
    );
    setNavbars(updatedNavbars);
  };

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl">
      <NavbarHeader
        onAddNavbar={handleAddNavbar}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortType={sortType}
        setSortType={setSortType}
        handleReset={handleReset}
        handleSelectAll={handleSelectAll}
        allSelected={selectedNavbarIds.length === navbars.length}
        onShowChange={onShowChange}
        onRefresh={() => {
          fetchNavbars();
          fetchMenus();
          fetchMedia();
        }}
      />
      <Modal
        open={isAddNavbarOpen}
        onCancel={handleCancelAddNavbar}
        footer={null}
        title={
          <div className="flex items-center gap-2">
            <img src="/icons/mave/navbar.svg" alt="Navbars" className="w-6" />
            <span>Add Navbar</span>
          </div>
        }
        width={800}
      >
        <AddNavbarForm
          menus={menus}
          media={media}
          onCancel={handleCancelAddNavbar}
          fetchNavbars={fetchNavbars}
        />
      </Modal>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <NavbarsList
          navbars={navbars}
          menus={menus}
          media={media}
          setNavbars={setNavbars}
          editingNavbarId={editingNavbarId}
          setEditingNavbarId={setEditingNavbarId}
          selectedNavbarIds={selectedNavbarIds}
          setSelectedNavbarIds={setSelectedNavbarIds}
          fetchNavbars={fetchNavbars}
        />
      )}
    </div>
  );
};

export default Navbars;
