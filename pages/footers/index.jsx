// pages/footers/index.jsx

import { message, Spin } from "antd";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import instance from "../../axios";
import { cachedApiCall } from "../../utils/apiUtils";
import { useRouter } from "next/router";
import PagesHeader from "../../components/PageBuilder/PagesHeader";
import CreateFooterModal from "../../components/PageBuilder/CreateFooterModal";
import RenderPages from "../../components/PageBuilder/Renderpages";

const Footers = () => {
  const [allFooters, setAllFooters] = useState([]);
  const [footers, setFooters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createFooterModalVisible, setCreateFooterModalVisible] =
    useState(false);
  const [expandedPageId, setExpandedPageId] = useState(null);
  const [sortType, setSortType] = useState("desc");
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const router = useRouter();

  const fetchFooters = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cachedApiCall("footers-pages", () =>
        instance.get("/pages?type=Footer")
      );
      if (response.data) {
        setAllFooters(response.data);
        setFooters(response.data);
      } else {
        message.error("Failed to fetch footers.");
      }
    } catch (error) {
      console.error("Error fetching footers:", error);
      message.error("An error occurred while fetching footers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFooters();
  }, [fetchFooters]);

  const sortedFooters = useMemo(() => {
    return [...footers].sort((a, b) =>
      sortType === "asc" ? a.id - b.id : b.id - a.id
    );
  }, [footers, sortType]);

  const paginatedFooters = useMemo(
    () => sortedFooters.slice(0, itemsPerPage),
    [sortedFooters, itemsPerPage]
  );

  const handleExpand = useCallback((pageId) => {
    setExpandedPageId((prevId) => (prevId === pageId ? null : pageId));
  }, []);

  const openCreateFooterModal = useCallback(
    () => setCreateFooterModalVisible(true),
    []
  );

  const closeCreateFooterModal = useCallback(
    () => setCreateFooterModalVisible(false),
    []
  );

  const handleFooterCreated = useCallback((newFooter) => {
    setAllFooters((prev) => [newFooter, ...prev]);
    setFooters((prev) => [newFooter, ...prev]);
  }, []);

  const handleDeleteFooter = useCallback(async (deletePageId) => {
    try {
      await instance.delete(`/pages/${deletePageId}`);
      message.success("Footer deleted successfully.");
      setAllFooters((prev) => prev.filter((page) => page.id !== deletePageId));
      setFooters((prev) => prev.filter((page) => page.id !== deletePageId));
    } catch (error) {
      console.error("Error deleting footer:", error);
      message.error("An error occurred while deleting the footer.");
    }
  }, []);

  const handlePreviewPage = useCallback(
    (id) => {
      router.push(`/page-preview/${id}`);
    },
    [router]
  );

  const handleDuplicateFooter = useCallback(
    async (pageId) => {
      try {
        const originalPageResponse = await instance.get(`/pages/${pageId}`);
        const originalPage = originalPageResponse.data;

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
          message.success("Footer duplicated successfully.");
          fetchFooters();
        }
      } catch (error) {
        console.error("Error duplicating footer:", error);
        message.error("An error occurred while duplicating the footer.");
      }
    },
    [fetchFooters]
  );

  const handleEditFooterInfo = useCallback(async (updatedData) => {
    try {
      const response = await instance.put(`/pages/${updatedData.id}`, {
        page_name_en: updatedData.pageNameEn,
        page_name_bn: updatedData.pageNameBn,
        slug: updatedData.slug,
        additional: [
          {
            pageType: updatedData.pageType,
            metaTitle: updatedData.metaTitle,
            metaDescription: updatedData.metaDescription,
            keywords: updatedData.keywords,
            metaImage: updatedData.metaImage,
            metaImageAlt: updatedData.metaImageAlt,
          },
        ],
      });
      if (response.status === 200) {
        message.success("Footer info updated successfully.");
        const mapFooter = (page) =>
          page.id === updatedData.id
            ? {
                ...page,
                page_name_en: updatedData.pageNameEn,
                page_name_bn: updatedData.pageNameBn,
                slug: updatedData.slug,
                additional: [
                  {
                    pageType: updatedData.pageType,
                    metaTitle: updatedData.metaTitle,
                    metaDescription: updatedData.metaDescription,
                    keywords: updatedData.keywords,
                    metaImage: updatedData.metaImage,
                    metaImageAlt: updatedData.metaImageAlt,
                  },
                ],
              }
            : page;
        setAllFooters((prev) => prev.map(mapFooter));
        setFooters((prev) => prev.map(mapFooter));
      } else {
        message.error("Failed to update footer info.");
      }
    } catch (error) {
      console.error("Error updating footer info:", error);
      message.error("An error occurred while updating the footer info.");
    }
  }, []);

  const handleFooterSearch = useCallback(
    (searchText) => {
      if (!searchText.trim()) {
        setFooters(allFooters);
        return;
      }
      const filtered = allFooters.filter((page) =>
        page.page_name_en.toLowerCase().includes(searchText.toLowerCase())
      );
      setFooters(filtered);
    },
    [allFooters]
  );

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
        section="footers"
        onSearch={handleFooterSearch}
        onCreate={openCreateFooterModal}
        createMode={createFooterModalVisible}
        onCancelCreate={closeCreateFooterModal}
        sortType={sortType}
        setSortType={setSortType}
        onShowChange={handleShowChange}
        onRefresh={fetchFooters}
        title="Footers"
        totalFooters={footers.length}
      />

      <CreateFooterModal
        visible={createFooterModalVisible}
        onCancel={closeCreateFooterModal}
        onFooterCreated={handleFooterCreated}
        fetchPages={fetchFooters}
      />

      <RenderPages
        webpages={paginatedFooters}
        handlePreviewPage={handlePreviewPage}
        handleExpand={handleExpand}
        expandedPageId={expandedPageId}
        handleDeletePage={handleDeleteFooter}
        handleEditPageInfo={handleEditFooterInfo}
        handleDuplicatePage={handleDuplicateFooter}
      />
    </div>
  );
};

export default Footers;
