// components/PageBuilder/PagesTabs.jsx

import React from "react";
import { Tabs } from "antd";
import RenderPages from "./Renderpages";

const { TabPane } = Tabs;

const PagesTabs = ({
  typePages,
  typeSubpages,
  typeFooters,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handlePreviewPage,
  handleEditPageInfo,
  handleDuplicatePage,
}) => {
  const tabs = [
    { key: "1", tab: "Pages", data: typePages },
    { key: "2", tab: "Subpages", data: typeSubpages },
    { key: "3", tab: "Footers", data: typeFooters },
  ];

  return (
    <Tabs centered animated defaultActiveKey="1" className="mt-8">
      {tabs.map(({ key, tab, data }) => (
        <TabPane tab={tab} key={key}>
          <RenderPages
            webpages={data}
            handlePreviewPage={handlePreviewPage}
            handleExpand={handleExpand}
            expandedPageId={expandedPageId}
            handleDeletePage={handleDeletePage}
            handleEditPageInfo={handleEditPageInfo}
            handleDuplicatePage={handleDuplicatePage}
          />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default PagesTabs;
