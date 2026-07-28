import React from "react";
import { Button, Tooltip, message } from "antd";
import { CopyOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const NavbarsPageHeader = ({ onCreateNavbar }) => {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-lg border border-gray-200/50 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="border-2 border-gray-200 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-300 rounded-2xl p-3.5 shadow-md">
            <Image
              src="/icons/mave/navbar.svg"
              width={30}
              height={30}
              alt="Navbars"
            />
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Navbars
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Attach menus with drag and drop — edit link structure under Navigation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={onCreateNavbar}
            className="h-11 px-6 bg-black hover:bg-gray-800 text-white border-0 font-semibold rounded-xl"
            size="large"
          >
            New navbar
          </Button>
          <Tooltip title="Copy navbars API endpoint">
            <Button
              icon={<CopyOutlined />}
              className="h-11 w-11 flex items-center justify-center rounded-xl"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/navbars`
                );
                message.success("API endpoint copied");
              }}
              size="large"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default NavbarsPageHeader;
