// pages/pages.jsx

import { message, Spin } from "antd";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import instance from "../../axios";
import { cachedApiCall } from "../../utils/apiUtils";
import { useRouter } from "next/router";
import PagesHeader from "../../components/PageBuilder/PagesHeader";
import CreatePageModal from "../../components/PageBuilder/CreatePageModal";
import PagesTabs from "../../components/PageBuilder/PagesTabs";
import CreateFooterModal from "../../components/PageBuilder/CreateFooterModal";

const Pages = () => {
  const [allPages, setAllPages] = useState([]);
  const [typePages, setTypePages] = useState([]);
  // Subpages tab disabled on Pages section
  // const [typeSubpages, setTypeSubpages] = useState([]);
  const [typeFooters, setTypeFooters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFooterModalVisible, setCreateFooterModalVisible] = useState(false);
  const [expandedPageId, setExpandedPageId] = useState(null);
  const [sortType, setSortType] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [currentFilter, setCurrentFilter] = useState("all");

  const router = useRouter();

  // Memoized sorted pages
  const sortedTypePages = useMemo(() => {
    return [...typePages].sort((a, b) =>
      sortType === "asc" ? a.id - b.id : b.id - a.id
    );
  }, [typePages, sortType]);

  // Memoized paginated data
  const paginatedData = useMemo(() => ({
    pages: sortedTypePages.slice(0, itemsPerPage),
    // subpages: typeSubpages.slice(0, itemsPerPage),
    footers: typeFooters.slice(0, itemsPerPage),
  }), [sortedTypePages, typeFooters, itemsPerPage]);

  // Fetch pages with caching
  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cachedApiCall("pages", () => instance.get("/pages"));

      if (response.data) {
        setAllPages(response.data);
        setTypePages(response.data.filter(page => page.type === "Page"));
        // setTypeSubpages(response.data.filter(page => page.type === "Subpage"));
        setTypeFooters(response.data.filter(page => page.type === "Footer"));
      } else {
        message.error("Failed to fetch pages.");
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      message.error("An error occurred while fetching pages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  // Event handlers
  const handleExpand = useCallback((pageId) => {
    setExpandedPageId(prevId => prevId === pageId ? null : pageId);
  }, []);

  const handleDeletePage = useCallback(async (deletePageId) => {
    try {
      await instance.delete(`/pages/${deletePageId}`);
      message.success("Page deleted successfully.");
      setTypePages(prevPages => prevPages.filter(page => page.id !== deletePageId));
    } catch (error) {
      console.error("Error deleting page:", error);
      message.error("An error occurred while deleting the page.");
    }
  }, []);

  const handleDuplicatePage = useCallback(async (pageId) => {
    try {
      // First, fetch the original page data
      const originalPageResponse = await instance.get(`/pages/${pageId}`);
      const originalPage = originalPageResponse.data;

      // Create a new page with the same data but with modified names
      const duplicatedPageData = {
        page_name_en: `${originalPage.page_name_en} (Copy)`,
        page_name_bn: `${originalPage.page_name_bn || originalPage.page_name_en} (Copy)`,
        type: originalPage.type,
        favicon_id: originalPage.favicon_id || 10,
        slug: originalPage.slug ? `${originalPage.slug}-copy` : null,
        head: originalPage.head || {
          title: `${originalPage.page_name_en} (Copy)`,
          description: "",
          keywords: [],
          image: "",
          imageAlt: "",
        },
        additional: originalPage.additional || [
          {
            pageType: originalPage.type,
            metaTitle: `${originalPage.page_name_en} (Copy)`,
            metaDescription: "",
            keywords: [],
            metaImage: "",
            metaImageAlt: "",
          },
        ],
        body: originalPage.body || [],
      };

      const response = await instance.post("/pages", duplicatedPageData);

      if (response.status === 201) {
        message.success("Page duplicated successfully.");
        fetchPages();
      }
    } catch (error) {
      console.error("Error duplicating page:", error);
      message.error("An error occurred while duplicating the page.");
    }
  }, [fetchPages]);

  const handlePreviewPage = useCallback((id) => {
    router.push(`/page-preview/${id}`);
  }, [router]);

  const handleEditPageInfo = useCallback(async (pageData) => {
    try {
      const { id, pageNameEn, pageNameBn, slug, pageType, type, metaTitle, metaDescription, keywords, metaImage, metaImageAlt } = pageData;

      const response = await instance.put(`/pages/${id}`, {
        page_name_en: pageNameEn,
        page_name_bn: pageNameBn,
        slug,
        type,
        additional: [{ pageType, metaTitle, metaDescription, keywords, metaImage, metaImageAlt }],
      });

      if (response.status === 200) {
        message.success("Page info updated successfully.");
        setTypePages(prevPages =>
          prevPages?.map(page =>
            page.id === id
              ? { ...page, page_name_en: pageNameEn, page_name_bn: pageNameBn, slug, type, additional: [{ pageType, metaTitle, metaDescription, keywords, metaImage, metaImageAlt }] }
              : page
          )
        );
      } else {
        message.error("Failed to update page info.");
      }
    } catch (error) {
      console.error("Error updating page info:", error);
      message.error("An error occurred while updating the page info.");
    }
  }, []);

  const handlePageSearch = useCallback((searchText) => {
    if (!searchText.trim()) {
      setTypePages(allPages.filter(page => page.type === "Page"));
      // setTypeSubpages(allPages.filter(page => page.type === "Subpage"));
      setTypeFooters(allPages.filter(page => page.type === "Footer"));
      return;
    }

    const filteredPages = allPages.filter(page =>
      page.page_name_en.toLowerCase().includes(searchText.toLowerCase())
    );

    setTypePages(filteredPages.filter(page => page.type === "Page"));
    // setTypeSubpages(filteredPages.filter(page => page.type === "Subpage"));
    setTypeFooters(filteredPages.filter(page => page.type === "Footer"));
  }, [allPages]);

  const handleFilter = useCallback((filterType) => {
    setCurrentFilter(filterType);

    switch (filterType) {
      case 'all':
        setTypePages(allPages.filter(page => page.type === "Page"));
        // setTypeSubpages(allPages.filter(page => page.type === "Subpage"));
        setTypeFooters(allPages.filter(page => page.type === "Footer"));
        message.success("Showing all pages");
        break;
      case 'pages':
        setTypePages(allPages.filter(page => page.type === "Page"));
        // setTypeSubpages([]);
        setTypeFooters([]);
        message.success("Showing pages only");
        break;
      // case 'subpages':
      //   setTypePages([]);
      //   setTypeSubpages(allPages.filter(page => page.type === "Subpage"));
      //   setTypeFooters([]);
      //   message.success("Showing subpages only");
      //   break;
      case 'footers':
        setTypePages([]);
        // setTypeSubpages([]);
        setTypeFooters(allPages.filter(page => page.type === "Footer"));
        message.success("Showing footers only");
        break;
      default:
        break;
    }
  }, [allPages]);

  const handlePageCreated = useCallback((newPage) => {
    setTypePages(prevPages => [newPage, ...prevPages]);
  }, []);

  const handleFooterCreated = useCallback((newPage) => {
    setTypeFooters(prevFooters => [newPage, ...prevFooters]);
  }, []);

  const openCreateModal = useCallback(() => setCreateModalVisible(true), []);
  const openFooterCreateModal = useCallback(() => setCreateFooterModalVisible(true), []);
  const closeCreateModal = useCallback(() => {
    setCreateModalVisible(false);
    setCreateFooterModalVisible(false);
  }, []);

  const handleShowChange = useCallback((value) => setItemsPerPage(value), []);

  if (loading) {
    return (
      <div className="mavecontainer flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl p-4">
      <PagesHeader
        onSearch={handlePageSearch}
        onCreate={openCreateModal}
        onFooterCreate={openFooterCreateModal}
        createMode={createModalVisible || createFooterModalVisible}
        onCancelCreate={closeCreateModal}
        sortType={sortType}
        setSortType={setSortType}
        onShowChange={handleShowChange}
        handleFilter={handleFilter}
        onRefresh={fetchPages}
        totalPages={typePages.length}
        // totalSubpages={typeSubpages.length}
        totalFooters={typeFooters.length}
      />

      <CreatePageModal
        visible={createModalVisible}
        onCancel={closeCreateModal}
        onPageCreated={handlePageCreated}
        fetchPages={fetchPages}
      />

      <CreateFooterModal
        visible={createFooterModalVisible}
        onCancel={closeCreateModal}
        onFooterCreated={handleFooterCreated}
        fetchPages={fetchPages}
      />

      <PagesTabs
        typePages={paginatedData.pages}
        // typeSubpages={paginatedData.subpages}
        typeFooters={paginatedData.footers}
        handleExpand={handleExpand}
        expandedPageId={expandedPageId}
        handleDeletePage={handleDeletePage}
        handlePreviewPage={handlePreviewPage}
        handleEditPageInfo={handleEditPageInfo}
        handleDuplicatePage={handleDuplicatePage}
      />
    </div>
  );
};

export default Pages;
