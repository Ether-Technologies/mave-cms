// components/PageBuilder/Components/PageContent.jsx

import React, { useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SectionList from "../Sections/SectionList";

const PageContent = ({
  pageData,
  isEditing,
  onSectionsUpdate,
  onSectionDuplicate,
  onSectionDelete,
  onEditingStateChange,
  onAddSection,
}) => {
  // Debug pageData
  useEffect(() => {
    console.log("🔧 PageContent received pageData:", {
      hasPageData: !!pageData,
      bodyLength: pageData?.body?.length,
      bodySections: pageData?.body?.map((section, idx) => ({
        index: idx,
        title: section.title,
        id: section._id,
      })),
    });
  }, [pageData]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        {pageData?.body?.length > 0 ? (
          <>
            <SectionList
              sections={pageData.body}
              setSections={onSectionsUpdate}
              onSectionDuplicate={onSectionDuplicate}
              onSectionDelete={onSectionDelete}
              onEditingStateChange={onEditingStateChange}
              isEditing={isEditing}
            />
            {isEditing && (
              <div className="text-center py-8">
                <Button
                  icon={<PlusOutlined />}
                  onClick={onAddSection}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 px-6 py-2 font-semibold"
                  size="large"
                >
                  Add Section
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No sections found in this page.</p>
            <p className="text-sm text-gray-400 mt-2">
              Add sections to start building your page.
            </p>
            {isEditing && (
              <div className="mt-4">
                <Button
                  icon={<PlusOutlined />}
                  onClick={onAddSection}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 px-6 py-2 font-semibold"
                  size="large"
                >
                  Add Section
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageContent;
