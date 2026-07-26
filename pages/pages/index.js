// pages/pages.jsx

import { message, Spin } from "antd";
import React, { useState, useEffect, useMemo } from "react";
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
  const [typeSubpages, setTypeSubpages] = useState([]);
  const [typeFooters, setTypeFooters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createFooterModalVisible, setCreateFooterModalVisible] =
    useState(false);
  const [expandedPageId, setExpandedPageId] = useState(null);
  const [sortType, setSortType] = useState("asc");
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  const router = useRouter();

  // Fetch all pages from the API with caching
  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await cachedApiCall("pages", () => instance.get("/pages"));
      if (response.data) {
        setAllPages(response.data);
        const mainPages = response.data.filter((page) => page.type === "Page");
        const subPages = response.data.filter(
          (page) => page.type === "Subpage"
        );

        const footers = response.data.filter((page) => page.type === "Footer");
        setTypePages(mainPages);
        setTypeSubpages(subPages);
        setTypeFooters(footers);
        setLoading(false);
      } else {
        message.error("Failed to fetch pages.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      message.error("An error occurred while fetching pages.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // Sort pages when data is fetched or sortType changes
  const sortedTypePages = React.useMemo(() => {
    return [...typePages].sort((a, b) => {
      if (sortType === "asc") {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });
  }, [typePages, sortType]);

  const handleExpand = (pageId) => {
    setExpandedPageId((prevId) => (prevId === pageId ? null : pageId));
  };

  const openCreateModal = () => {
    setCreateModalVisible(true);
  };

  const openFooterCreateModal = () => {
    setCreateFooterModalVisible(true);
  };

  const closeCreateModal = () => {
    setCreateModalVisible(false);
    setCreateFooterModalVisible(false);
  };

  const handlePageCreated = (newPage) => {
    // Optionally, add the new page to the state without refetching
    setTypePages((prevPages) => [newPage, ...prevPages]);
  };

  const handleFooterCreated = (newPage) => {
    // Optionally, add the new page to the state without refetching
    setTypePages((prevPages) => [newPage, ...prevPages]);
  };

  const handleDeletePage = async (deletePageId) => {
    try {
      await instance.delete(`/pages/${deletePageId}`);
      message.success("Page deleted successfully.");
      // Remove the deleted page from state
      setTypePages((prevPages) =>
        prevPages.filter((page) => page.id !== deletePageId)
      );
    } catch (error) {
      console.error("Error deleting page:", error);
      message.error("An error occurred while deleting the page.");
    }
  };

  const handleDuplicatePage = async (pageId) => {
    try {
      const response = await instance.post(`/pages/${pageId}/duplicate`);
      if (response.status === 201) {
        message.success("Page duplicated successfully.");
        fetchPages(); // Refresh the list
      }
    } catch (error) {
      console.error("Error duplicating page:", error);
      message.error("An error occurred while duplicating the page.");
    }
  };

  const handlePreviewPage = (id) => {
    router.push(`/page-preview/${id}`);
  };

  const handleEditPageInfo = async ({
    id,
    pageNameEn,
    pageNameBn,
    slug,
    pageType,
    type,
    metaTitle,
    metaDescription,
    keywords,
    metaImage,
    metaImageAlt,
  }) => {
    try {
      const response = await instance.put(`/pages/${id}`, {
        page_name_en: pageNameEn,
        page_name_bn: pageNameBn,
        slug: slug,
        type: type,
        additional: [
          {
            pageType: pageType,
            metaTitle: metaTitle,
            metaDescription: metaDescription,
            keywords: keywords,
            metaImage: metaImage,
            metaImageAlt: metaImageAlt,
          },
        ],
      });
      if (response.status === 200) {
        message.success("Page info updated successfully.");
        // Update the page in state
        setTypePages((prevPages) =>
          prevPages?.map((page) =>
            page.id === id
              ? {
                ...page,
                page_name_en: pageNameEn,
                page_name_bn: pageNameBn,
                slug: slug,
                type: type,
                additional: [
                  {
                    pageType,
                    metaTitle,
                    metaDescription,
                    keywords,
                    metaImage,
                    metaImageAlt,
                  },
                ],
              }
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
  };

  const handlePageSearch = (searchText) => {
    if (searchText.trim() === "") {
      // Reset to original data
      const mainPages = allPages.filter((page) => page.type === "Page");
      const subPages = allPages.filter((page) => page.type === "Subpage");
      const footers = allPages.filter((page) => page.type === "Footer");

      setTypePages(mainPages);
      setTypeSubpages(subPages);
      setTypeFooters(footers);
      return;
    }

    // Filter from the original data
    const filteredPages = allPages.filter((page) =>
      page.page_name_en.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredMainPages = filteredPages.filter((page) => page.type === "Page");
    const filteredSubPages = filteredPages.filter((page) => page.type === "Subpage");
    const filteredFooters = filteredPages.filter((page) => page.type === "Footer");

    setTypePages(filteredMainPages);
    setTypeSubpages(filteredSubPages);
    setTypeFooters(filteredFooters);
  };

  const handleShowChange = (value) => {
    setItemsPerPage(value);
  };

  const handleFilter = () => {
    // Implement your filter logic here
    message.info("Filter functionality is not implemented yet.");
  };

  return (
    <div className="mavecontainer" style={{ paddingTop: 4 }}>
      {/* Header */}
      <PagesHeader
        onSearch={handlePageSearch}
        onCreate={openCreateModal}
        onFooterCreate={openFooterCreateModal}
        sortType={sortType}
        setSortType={setSortType}
        onShowChange={handleShowChange}
        itemsPerPage={itemsPerPage}
        stats={{
          total:    allPages.length,
          pages:    typePages.length,
          subpages: typeSubpages.length,
          footers:  typeFooters.length,
        }}
      />

      {/* Create Page Modal */}
      <CreatePageModal
        visible={createModalVisible}
        onCancel={closeCreateModal}
        onPageCreated={handlePageCreated}
        fetchPages={fetchPages}
      />

      {/* Create Footer Modal */}
      <CreateFooterModal
        visible={createFooterModalVisible}
        onCancel={closeCreateModal}
        onFooterCreated={handleFooterCreated}
        fetchPages={fetchPages}
      />

      {/* Tabs for Pages and Subpages */}
      <PagesTabs
        typePages={sortedTypePages.slice(0, itemsPerPage)}
        typeSubpages={typeSubpages.slice(0, itemsPerPage)}
        typeFooters={typeFooters.slice(0, itemsPerPage)}
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
