// components/PageBuilder/Components/PageContent.jsx

import React from "react";
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
  onAddSectionAtPosition,
}) => {
  const sections = Object.values(pageData?.body?.data || {});

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        {sections.length > 0 ? (
          <>
            <SectionList
              sections={sections}
              setSections={onSectionsUpdate}
              onSectionDuplicate={onSectionDuplicate}
              onSectionDelete={onSectionDelete}
              onEditingStateChange={onEditingStateChange}
              onAddSectionAtPosition={onAddSectionAtPosition}
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
