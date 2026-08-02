// components/formbuilder/FormBuilderHeader.jsx

import React from "react";
import { Button, message, Tooltip, Badge } from "antd";
import { PlusCircleOutlined, CopyOutlined, ReloadOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/router";

const FormBuilderHeader = ({ formCount, onRefresh }) => {
  const router = useRouter();

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      message.success("Data refreshed successfully");
    }
  };

  const copyFormBuilderApi = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/form_builder`
    );
    message.success("API endpoint copied to clipboard");
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6 backdrop-blur-sm mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="border-2 border-gray-200 bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 rounded-2xl p-3.5 hover:bg-gradient-to-br hover:from-blue-100 hover:via-purple-100 hover:to-teal-100 transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 transform">
              <Image
                src="/icons/mave/forms.svg"
                width={30}
                height={30}
                alt="Form Builder"
                className="w-7.5 h-7.5"
              />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-brand to-brand-dark rounded-full border-2 border-white shadow-sm animate-pulse" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Form Builder
            </h2>
            {typeof formCount === "number" && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-blue-50 px-3 py-1.5 rounded-full border border-blue-200 hover:shadow-sm transition-all">
                  <Badge
                    count={formCount}
                    showZero
                    className="[&_.ant-badge-count]:bg-brand [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs [&_.ant-badge-count]:min-w-[20px] [&_.ant-badge-count]:h-5 [&_.ant-badge-count]:leading-5 [&_.ant-badge-count]:shadow-sm"
                  />
                  <span className="text-xs font-medium text-blue-700 ml-1">
                    {formCount === 1 ? "Form" : "Forms"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={() => router.push("/formbuilder/create-form")}
            className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
            size="large"
          >
            Create Form
          </Button>
          <Tooltip title="Refresh Data">
            <Button
              icon={<ReloadOutlined />}
              className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all rounded-xl hover:rotate-180"
              onClick={handleRefresh}
              size="large"
            />
          </Tooltip>
          <Tooltip title="Copy API Endpoint">
            <Button
              icon={<CopyOutlined />}
              className="h-11 w-11 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:text-gray-800 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all rounded-xl"
              onClick={copyFormBuilderApi}
              size="large"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderHeader;
