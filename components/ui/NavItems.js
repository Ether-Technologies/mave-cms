// components/ui/NavItems.js

import {
  SearchOutlined,
  LoginOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Input, Layout, Dropdown, Button, Badge } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Changelog from "../../pages/usermanual/changelog.json";
import TopNavData from "../../src/data/topnavdata.json";
import Link from "next/link";
import Image from "next/image";

export default function NavItems({
  user,
  token,
  handleLogout,
  theme,
  setTheme,
}) {
  const [hovered, setHovered] = useState(false);
  const [topNavData, setTopNavData] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Home");
  const [changeLogs, setChangeLogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setTopNavData(TopNavData);
    const sortedChangelog = Changelog.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setChangeLogs(sortedChangelog);
  }, []);

  const userItems = [
    {
      key: "1",
      label: (
        <Link href="/user/profile" className="text-base">
          Profile
        </Link>
      ),
    },
    {
      key: "2",
      label: (
        <Link href="/dashboard" className="text-base">
          Dashboard
        </Link>
      ),
    },
    {
      key: "3",
      label: <span className="text-base">Help</span>,
    },
    {
      key: "4",
      label: (
        <div onClick={handleLogout} className="cursor-pointer text-base">
          Logout
        </div>
      ),
    },
  ];

  return (
    <Layout.Header
      className="fixed w-full h-16 flex items-center justify-between px-3 
    md:px-4 lg:px-6 bg-white border-b border-gray-200 z-50"
    >
      {/* Logo and Version */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/images/ui/mave_new_logo.png"
            alt="Mave Logo"
            width={110}
            height={36}
            objectFit="contain"
          />
        </div>
        <div
          className="px-2 py-1 rounded-xl text-sm font-semibold text-white cursor-pointer 
            bg-gradient-to-r from-yellow-500 to-orange-500 
            hover:from-orange-500 hover:to-red-500 
            transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/usermanual/changelog");
          }}
        >
          {changeLogs && changeLogs.length > 0
            ? `v${changeLogs[0].version}`
            : "v1.0"}
        </div>
      </div>

      {user && token ? (
        <>
          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-4 mx-2 flex-1 justify-center">
            {topNavData &&
              topNavData?.map((item) => (
                <Link key={item.name} href={item.link}>
                  <div
                    className={`px-3.5 py-1 rounded-lg text-base font-semibold cursor-pointer
                      ${topNavData && item === topNavData[topNavData.length - 1] ? "bg-yellow-500 text-white" : ""}
                      transition-all duration-300 transform hover:scale-105 ${
                        selectedMenuItem === item.name
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md"
                          : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900"
                      }`}
                    onClick={() => setSelectedMenuItem(item.name)}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Search Bar - Desktop only on larger screens */}
            <div className="hidden xl:block mr-2">
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined className="text-gray-400 text-base" />}
                className="w-48 h-10 rounded-xl text-base"
              />
            </div>

            {/* Notification Bell */}
            <Badge count={3} size="default" color="#A259FF80">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg 
                bg-gradient-to-br from-gray-50 to-gray-100 hover:from-yellow-50 hover:to-orange-50 
                cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
              >
                <BellOutlined className="text-gray-600 hover:text-orange-500 text-lg transition-colors duration-300" />
              </div>
            </Badge>

            {/* Settings */}
            <div
              className="w-10 h-10 flex items-center justify-center rounded-lg 
                bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50
                cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
              onClick={() => router.push("/settings/cms-settings")}
            >
              <SettingOutlined className="text-gray-600 hover:text-indigo-500 text-lg transition-colors duration-300" />
            </div>

            {/* User Dropdown */}
            <Dropdown menu={{ items: userItems }} placement="bottomRight">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg 
                  bg-gradient-to-r from-yellow-500 to-orange-500 
                  hover:from-orange-500 hover:to-red-500 
                  cursor-pointer transition-all duration-300 transform hover:scale-110 
                  shadow-md hover:shadow-xl mr-8"
              >
                <UserOutlined className="text-white text-lg" />
              </div>
            </Dropdown>
          </div>
        </>
      ) : (
        <div className="flex justify-end flex-shrink-0">
          <Button
            icon={<LoginOutlined className="text-base" />}
            onClick={() => router.push("/login")}
            className="h-10 px-6 text-white border-0 font-semibold rounded-lg text-base
              bg-gradient-to-r from-yellow-500 to-orange-500 
              hover:from-orange-500 hover:to-red-500 
              transition-all duration-300 transform hover:scale-105 
              shadow-md hover:shadow-xl"
            style={{
              background: "linear-gradient(to right, #eab308, #f97316)",
            }}
          >
            Login
          </Button>
        </div>
      )}
    </Layout.Header>
  );
}
