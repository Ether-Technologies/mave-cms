// components/PageBuilder/RenderPages.jsx

import React from "react";
import { Spin } from "antd";
import PageCard from "./PageCard";

const RenderPages = ({
  webpages = [], // Ensure default value is an empty array
  handleEditPage,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handleEditPageInfo,
  handleDuplicatePage,
}) => {
  return (
    <div>
      {webpages.length > 0 ? (
        <div className="columns-1 gap-4 xl:columns-2 2xl:columns-2">
          {webpages?.map((page) => (
            <div className="break-inside-avoid" key={page.id}>
              <PageCard
                page={page}
                handleEditPage={handleEditPage}
                handleExpand={handleExpand}
                expandedPageId={expandedPageId}
                handleDeletePage={handleDeletePage}
                handleEditPageInfo={handleEditPageInfo}
                handleDuplicatePage={handleDuplicatePage}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default RenderPages;
