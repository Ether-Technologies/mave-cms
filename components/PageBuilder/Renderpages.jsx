// components/PageBuilder/RenderPages.jsx

import React from "react";
import { Empty } from "antd";
import PageCard from "./PageCard";

const RenderPages = ({
  webpages = [],
  handlePreviewPage,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handleEditPageInfo,
  handleDuplicatePage,
}) => {
  if (!webpages.length) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Empty description="No pages found" />
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 xl:columns-2 2xl:columns-2">
      {webpages.map((page) => (
        <div className="break-inside-avoid mb-4" key={page.id}>
          <PageCard
            page={page}
            handlePreviewPage={handlePreviewPage}
            handleExpand={handleExpand}
            expandedPageId={expandedPageId}
            handleDeletePage={handleDeletePage}
            handleEditPageInfo={handleEditPageInfo}
            handleDuplicatePage={handleDuplicatePage}
          />
        </div>
      ))}
    </div>
  );
};

export default RenderPages;
