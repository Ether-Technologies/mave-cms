import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Input, message, Row, Col, Select, Button } from "antd";
import { useRouter } from "next/router";
import instance from "../../axios";
import Loader from "../Loader";
import NavbarsSidebar from "../Navigation/NavbarsSidebar";
import NavbarStructurePanel from "../Navigation/NavbarStructurePanel";
import MenusLibraryPanel from "../Navigation/MenusLibraryPanel";
import NavigationMenuDnd from "../Navigation/NavigationMenuDnd";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";

const NavbarBuilder = ({
  menus,
  menuItems,
  createNavbarOpen,
  setCreateNavbarOpen,
}) => {
  const router = useRouter();

  const [navbars, setNavbars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNavbarId, setSelectedNavbarId] = useState(null);
  const [navbarSearch, setNavbarSearch] = useState("");
  const [draftTitleEn, setDraftTitleEn] = useState("");
  const [draftTitleBn, setDraftTitleBn] = useState("");
  const [draftMenuId, setDraftMenuId] = useState(null);
  const [draftLogoId, setDraftLogoId] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [savingNavbar, setSavingNavbar] = useState(false);
  const [newNavbarTitleEn, setNewNavbarTitleEn] = useState("");
  const [newNavbarTitleBn, setNewNavbarTitleBn] = useState("");
  const [newNavbarLogoId, setNewNavbarLogoId] = useState(null);
  const [newNavbarMenuId, setNewNavbarMenuId] = useState(null);
  const [newNavbarLogoPreview, setNewNavbarLogoPreview] = useState(null);
  const [mediaModalFor, setMediaModalFor] = useState(null);

  const fetchNavbars = useCallback(async () => {
    setLoading(true);
    try {
      const response = await instance("/navbars");
      if (response.data) {
        const sorted = [...response.data].sort((a, b) => b.id - a.id);
        setNavbars(sorted);
      }
    } catch {
      message.error("Navbars couldn't be fetched");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNavbars();
  }, [fetchNavbars]);

  const selectedNavbar = useMemo(
    () => navbars.find((n) => n.id === selectedNavbarId) || null,
    [navbars, selectedNavbarId]
  );

  useEffect(() => {
    if (!selectedNavbarId && navbars.length > 0) {
      setSelectedNavbarId(navbars[0].id);
    }
  }, [navbars, selectedNavbarId]);

  useEffect(() => {
    if (!selectedNavbar) {
      setDraftTitleEn("");
      setDraftTitleBn("");
      setDraftMenuId(null);
      setDraftLogoId(null);
      setLogoPreviewUrl(null);
      return;
    }
    setDraftTitleEn(selectedNavbar.title_en || "");
    setDraftTitleBn(selectedNavbar.title_bn || "");
    setDraftMenuId(selectedNavbar.menu_id ?? selectedNavbar.menu?.id ?? null);
    setDraftLogoId(selectedNavbar.logo_id ?? selectedNavbar.logo?.id ?? null);
    setLogoPreviewUrl(
      selectedNavbar.logo?.file_path
        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedNavbar.logo.file_path}`
        : null
    );
  }, [selectedNavbar?.id, selectedNavbar]);

  const navbarDirty = useMemo(() => {
    if (!selectedNavbar) return false;
    const savedMenuId = selectedNavbar.menu_id ?? selectedNavbar.menu?.id ?? null;
    const savedLogoId = selectedNavbar.logo_id ?? selectedNavbar.logo?.id ?? null;
    return (
      draftTitleEn !== (selectedNavbar.title_en || "") ||
      draftTitleBn !== (selectedNavbar.title_bn || "") ||
      draftMenuId !== savedMenuId ||
      draftLogoId !== savedLogoId
    );
  }, [selectedNavbar, draftTitleEn, draftTitleBn, draftMenuId, draftLogoId]);

  const handleCreateNavbar = async () => {
    if (!newNavbarTitleEn.trim() || !newNavbarLogoId || !newNavbarMenuId) {
      message.error("Title, logo, and menu are required");
      return;
    }
    try {
      const res = await instance.post("/navbars", {
        title_en: newNavbarTitleEn.trim(),
        title_bn: newNavbarTitleBn.trim() || null,
        logo_id: newNavbarLogoId,
        menu_id: newNavbarMenuId,
      });
      if (res.status === 201) {
        message.success("Navbar created");
        setCreateNavbarOpen(false);
        setNewNavbarTitleEn("");
        setNewNavbarTitleBn("");
        setNewNavbarLogoId(null);
        setNewNavbarMenuId(null);
        setNewNavbarLogoPreview(null);
        await fetchNavbars();
        if (res.data?.id) setSelectedNavbarId(res.data.id);
      }
    } catch {
      message.error("Could not create navbar");
    }
  };

  const handleDeleteNavbar = async (id) => {
    try {
      await instance.delete(`/navbars/${id}`);
      message.success("Navbar deleted");
      if (selectedNavbarId === id) setSelectedNavbarId(null);
      fetchNavbars();
    } catch {
      message.error("Could not delete navbar");
    }
  };

  const handleRenameNavbar = async (navbar, titleEn) => {
    const menuId = navbar.menu_id ?? navbar.menu?.id;
    const logoId = navbar.logo_id ?? navbar.logo?.id;
    if (!menuId || !logoId) return;
    try {
      await instance.put(`/navbars/${navbar.id}`, {
        title_en: titleEn,
        title_bn: navbar.title_bn,
        logo_id: logoId,
        menu_id: menuId,
      });
      setNavbars((prev) =>
        prev.map((n) =>
          n.id === navbar.id ? { ...n, title_en: titleEn } : n
        )
      );
      if (selectedNavbarId === navbar.id) setDraftTitleEn(titleEn);
      message.success("Navbar renamed");
    } catch {
      message.error("Could not rename navbar");
    }
  };

  const handleSaveNavbar = useCallback(async () => {
    if (!selectedNavbar || !draftMenuId || !draftLogoId) return;
    setSavingNavbar(true);
    try {
      const res = await instance.put(`/navbars/${selectedNavbar.id}`, {
        title_en: draftTitleEn.trim(),
        title_bn: draftTitleBn.trim() || null,
        logo_id: draftLogoId,
        menu_id: draftMenuId,
      });
      const updated = res.data;
      setNavbars((prev) =>
        prev.map((n) => (n.id === selectedNavbar.id ? { ...n, ...updated } : n))
      );
      await fetchNavbars();
    } catch (err) {
      throw err;
    } finally {
      setSavingNavbar(false);
    }
  }, [
    selectedNavbar,
    draftTitleEn,
    draftTitleBn,
    draftLogoId,
    draftMenuId,
    fetchNavbars,
  ]);

  const handleEditMenu = (menuId) => {
    router.push(`/menus?menu=${menuId}`);
  };

  if (loading && navbars.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 mt-4">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <NavigationMenuDnd
        builderMode="navbars"
        menuItemIds={[]}
        onMenuItemIdsChange={() => {}}
        allMenuItems={menuItems}
        menuSelected={false}
        navbarSelected={!!selectedNavbar}
        onDraftMenuIdChange={setDraftMenuId}
        allMenus={menus}
      >
        <div className="navigation-workspace grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="lg:col-span-3">
            <NavbarsSidebar
              navbars={navbars}
              selectedNavbarId={selectedNavbarId}
              onSelectNavbar={setSelectedNavbarId}
              onDeleteNavbar={handleDeleteNavbar}
              onRenameNavbar={handleRenameNavbar}
              searchTerm={navbarSearch}
              setSearchTerm={setNavbarSearch}
            />
          </div>
          <div className="lg:col-span-5">
            <NavbarStructurePanel
              navbar={selectedNavbar}
              draftTitleEn={draftTitleEn}
              draftTitleBn={draftTitleBn}
              onDraftTitleEnChange={setDraftTitleEn}
              onDraftTitleBnChange={setDraftTitleBn}
              draftMenuId={draftMenuId}
              draftLogoId={draftLogoId}
              logoPreviewUrl={logoPreviewUrl}
              menus={menus}
              menuItems={menuItems}
              onPickLogo={() => setMediaModalFor("navbar")}
              onSave={handleSaveNavbar}
              saving={savingNavbar}
              dirty={navbarDirty}
              onEditMenu={handleEditMenu}
            />
          </div>
          <div className="lg:col-span-4">
            <MenusLibraryPanel
              menus={menus}
              menuItems={menuItems}
              attachedMenuId={draftMenuId}
              navbarSelected={!!selectedNavbar}
              onAttachMenu={setDraftMenuId}
            />
          </div>
        </div>
      </NavigationMenuDnd>

      <Modal
        open={createNavbarOpen}
        onCancel={() => setCreateNavbarOpen(false)}
        onOk={handleCreateNavbar}
        okText="Create"
        title="New navbar"
        width={560}
      >
        <Row gutter={[12, 12]} className="mt-2">
          <Col span={24}>
            <Input
              placeholder="Title (English)"
              value={newNavbarTitleEn}
              onChange={(e) => setNewNavbarTitleEn(e.target.value)}
            />
          </Col>
          <Col span={24}>
            <Input
              placeholder="Title (alternate)"
              value={newNavbarTitleBn}
              onChange={(e) => setNewNavbarTitleBn(e.target.value)}
            />
          </Col>
          <Col span={24}>
            <Button onClick={() => setMediaModalFor("create-navbar")}>
              {newNavbarLogoId ? "Change logo" : "Select logo"}
            </Button>
            {newNavbarLogoPreview && (
              <img
                src={newNavbarLogoPreview}
                alt=""
                className="mt-2 h-12 object-contain rounded border"
              />
            )}
          </Col>
          <Col span={24}>
            <Select
              showSearch
              placeholder="Initial menu (change later via drag & drop)"
              className="w-full"
              value={newNavbarMenuId}
              onChange={setNewNavbarMenuId}
              optionFilterProp="children"
            >
              {menus.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Modal>

      <MediaSelectionModal
        isVisible={mediaModalFor != null}
        onClose={() => setMediaModalFor(null)}
        selectionMode="single"
        onSelectMedia={(selected) => {
          if (!selected) {
            setMediaModalFor(null);
            return;
          }
          const url = selected.file_path
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selected.file_path}`
            : null;
          if (mediaModalFor === "navbar") {
            setDraftLogoId(selected.id);
            setLogoPreviewUrl(url);
          }
          if (mediaModalFor === "create-navbar") {
            setNewNavbarLogoId(selected.id);
            setNewNavbarLogoPreview(url);
          }
          setMediaModalFor(null);
        }}
      />
    </>
  );
};

export default NavbarBuilder;
