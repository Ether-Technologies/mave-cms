import React from "react";
import { Button, Tabs, Tooltip, message } from "antd";
import { CopyOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const NavigationHeader = ({
  activeTab,
  onTabChange,
  onCreateMenu,
  showCreateMenu = true,
}) => {
  const tabItems = [
    { key: "builder", label: "Menu builder" },
    { key: "items", label: "All menu items" },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="border-2 border-gray-200 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-300 rounded-2xl p-3.5 shadow-md">
              <Image
                src="/icons/mave/menus.svg"
                width={30}
                height={30}
                alt="Navigation"
              />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Navigation
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Build menus and manage links with drag and drop
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showCreateMenu && activeTab === "builder" && (
              <Button
                icon={<PlusCircleOutlined />}
                onClick={onCreateMenu}
                className="h-11 px-6 bg-black hover:bg-gray-800 text-white border-0 font-semibold rounded-xl"
                size="large"
              >
                New menu
              </Button>
            )}
            <Tooltip title="Copy menus API endpoint">
              <Button
                icon={<CopyOutlined />}
                className="h-11 w-11 flex items-center justify-center rounded-xl"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/menus`
                  );
                  message.success("API endpoint copied");
                }}
                size="large"
              />
            </Tooltip>
          </div>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={tabItems}
          className="mt-4 navigation-tabs [&_.ant-tabs-nav]:mb-0"
        />
      </div>
    </div>
  );
};

export default NavigationHeader;
