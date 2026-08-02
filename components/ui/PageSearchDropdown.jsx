import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Dropdown, Input, Spin, Empty, message, Tooltip } from "antd";
import {
  DownOutlined,
  SearchOutlined,
  LinkOutlined,
  CopyOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import { cachedApiCall } from "../../utils/apiUtils";
import { useGlobalRefresh } from "../../src/context/MenuRefreshContext";

const PageSearchDropdown = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPages = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      const response = await cachedApiCall(
        "pages",
        () => instance.get("/pages"),
        undefined,
        { force: forceRefresh }
      );
      if (response.data) {
        setPages(
          response.data.filter(
            (page) => page.type === "Page" || page.type === "Subpage"
          )
        );
      }
    } catch {
      message.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchPages();
    }
  }, [open, fetchPages]);

  useGlobalRefresh(() => fetchPages(true));

  const filteredPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pages;

    return pages.filter(
      (page) =>
        page.page_name_en?.toLowerCase().includes(query) ||
        page.page_name_bn?.toLowerCase().includes(query) ||
        page.slug?.toLowerCase().includes(query)
    );
  }, [pages, searchQuery]);

  const handleCopyUrl = (e, slug) => {
    e.stopPropagation();
    if (!slug) {
      message.warning("This page has no URL slug");
      return;
    }
    const fullUrl = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    message.success("Page URL copied");
  };

  const handleEditPage = (e, pageId) => {
    e.stopPropagation();
    setOpen(false);
    setSearchQuery("");
    router.push(`/page-builder/${pageId}?edit=true`);
  };

  const dropdownContent = (
    <div className="w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Search Pages
        </p>
        <Input
          placeholder="Search by name or URL..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
          autoFocus
          className="rounded-lg"
        />
      </div>

      <div className="max-h-72 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spin size="small" />
          </div>
        ) : filteredPages.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={searchQuery ? "No pages found" : "No pages available"}
            className="py-8"
          />
        ) : (
          <div className="p-2">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-default"
              >
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-lg bg-blue-100 text-brand">
                  <FileTextOutlined />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {page.page_name_en}
                  </p>
                  {page.page_name_bn && (
                    <p className="text-xs text-gray-500 truncate">
                      {page.page_name_bn}
                    </p>
                  )}
                  <p className="text-xs text-brand mt-0.5 flex items-center gap-1 truncate">
                    <LinkOutlined className="flex-shrink-0" />
                    {page.slug ? `/${page.slug}` : "No slug"}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {page.slug && (
                    <Tooltip title="Copy URL">
                      <button
                        type="button"
                        onClick={(e) => handleCopyUrl(e, page.slug)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-brand hover:bg-white transition-colors"
                        aria-label="Copy page URL"
                      >
                        <CopyOutlined className="text-xs" />
                      </button>
                    </Tooltip>
                  )}
                  <Tooltip title="Edit page">
                    <button
                      type="button"
                      onClick={(e) => handleEditPage(e, page.id)}
                      className="p-1.5 rounded-md text-gray-500 hover:text-brand hover:bg-white transition-colors"
                      aria-label="Edit page"
                    >
                      <EditOutlined className="text-xs" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && filteredPages.length > 0 && (
        <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
          {filteredPages.length} page{filteredPages.length !== 1 ? "s" : ""}
          {searchQuery ? " found" : ""}
        </div>
      )}
    </div>
  );

  return (
    <Dropdown
      open={open}
      onOpenChange={(visible) => {
        setOpen(visible);
        if (!visible) setSearchQuery("");
      }}
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomLeft"
    >
      <button
        type="button"
        className="flex items-center gap-2 h-10 px-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-colors whitespace-nowrap"
      >
        <FileTextOutlined className="text-brand" />
        <span>Pages</span>
        <DownOutlined className="text-xs text-gray-400" />
      </button>
    </Dropdown>
  );
};

export default PageSearchDropdown;
