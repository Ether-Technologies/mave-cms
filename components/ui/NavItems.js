// components/ui/NavItems.js

import {
  SearchOutlined,
  LoginOutlined,
  SettingOutlined,
  UserOutlined,
  DeploymentUnitOutlined,
  ReloadOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Input, Layout, Dropdown, Button, Tooltip, message, Badge } from "antd";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Changelog from "../../src/data/changelog.json";
import TopNavData from "../../src/data/topnavdata.json";
import AuthorisedMenus from "../../src/data/authorisedsidemenus.json";
import Link from "next/link";
import Image from "next/image";
import { useMenuRefresh } from "../../src/context/MenuRefreshContext";
import OrganizationSelector from "../admin/OrganizationSelector";

export default function NavItems({
  user,
  token,
  organization,
  handleLogout,
  theme,
  setTheme,
}) {
  const [hovered, setHovered] = useState(false);
  const [topNavData, setTopNavData] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("Home");
  const [changeLogs, setChangeLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();
  const { triggerGlobalRefresh, isRefreshing } = useMenuRefresh();

  const handleGlobalRefresh = async () => {
    try {
      await triggerGlobalRefresh();
      message.success("All data refreshed successfully");
    } catch {
      message.error("Failed to refresh data");
    }
  };

  useEffect(() => {
    setTopNavData(TopNavData);
    const sortedChangelog = Changelog.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setChangeLogs(sortedChangelog);
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = [];
    const query = searchQuery.toLowerCase();

    AuthorisedMenus.forEach((menu) => {
      if (menu.submenu) {
        menu.submenu.forEach((item) => {
          if (
            item.title.toLowerCase().includes(query) ||
            menu.title.toLowerCase().includes(query)
          ) {
            results.push({
              ...item,
              category: menu.title,
              categoryIcon: menu.icon,
            });
          }
        });
      }
    });

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [searchQuery]);

  // Click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchResultClick = (link) => {
    router.push(link);
    setSearchQuery("");
    setShowSearchResults(false);
  };

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
          className="px-2 py-1 rounded-xl text-sm font-semibold text-white
            bg-gradient-to-r from-brand to-blue-600 shadow-md"
        >
          {changeLogs && changeLogs.length > 0
            ? `v${changeLogs[0].version}`
            : "v1.0"}
        </div>
        {user?.is_super_admin ? (
          <OrganizationSelector />
        ) : (
          organization?.name && (
            <div
              className="hidden md:flex items-center gap-2"
            >
              <div
                className="px-3 py-1 rounded-xl text-xs font-semibold text-white
                  bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md max-w-[180px] truncate"
                title={organization.name}
              >
                {organization.name}
              </div>
            </div>
          )
        )}
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
                      ${topNavData && item === topNavData[topNavData.length - 1] ? "flex gap-2 text-white maveaibutton" : "mavetopnavbutton"}
                      transition-all duration-300 transform hover:scale-105 ${selectedMenuItem === item.name
                        ? "underline decoration-brand decoration-2 underline-offset-8 text-gray-800"
                        : "text-gray-400 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-900"
                      }`}
                    onClick={() => setSelectedMenuItem(item.name)}
                  >
                    {item.name}

                    {topNavData && item === topNavData[topNavData.length - 1] ? (
                      <DeploymentUnitOutlined />
                    ) : ""}
                  </div>
                </Link>
              ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Search Bar - Desktop only on larger screens */}
            <div className="hidden xl:flex items-center gap-2 mr-2">
              <div className="relative" ref={searchRef}>
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined className="text-gray-400 text-base" />}
                className="w-[28rem] h-10 rounded-xl text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-12 right-0 w-96 max-h-96 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 search-results-dropdown z-50">
                  <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                    <p className="text-sm font-semibold text-gray-700">
                      Quick Navigation ({searchResults.length} results)
                    </p>
                  </div>

                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.id}-${index}`}
                        onClick={() => handleSearchResultClick(result.link)}
                        className="search-result-item flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300 group mb-1"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-100 group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
                          <Image
                            src={result.icon}
                            alt={result.title}
                            width={20}
                            height={20}
                            className="opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-base font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Image
                              src={result.categoryIcon}
                              alt={result.category}
                              width={12}
                              height={12}
                              className="opacity-60"
                            />
                            {result.category}
                          </p>
                        </div>

                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                          <span className="text-purple-600 text-xs">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>

            <Badge count={3} size="default" color="#A259FF80">
              <div
                className="w-10 h-10 flex items-center justify-center rounded-lg
                bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-50
                cursor-pointer transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md"
              >
                <BellOutlined className="text-gray-600 hover:text-orange-500 text-lg transition-colors duration-300" />
              </div>
            </Badge>

            {/* Refresh All Data */}
            <Tooltip title={isRefreshing ? "Refreshing..." : "Refresh All Data"}>
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg
                bg-gradient-to-br from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50
                transition-all duration-300 transform shadow-sm hover:shadow-md
                ${isRefreshing ? "cursor-wait opacity-70" : "cursor-pointer hover:scale-110 hover:rotate-180"}`}
                onClick={isRefreshing ? undefined : handleGlobalRefresh}
              >
                <ReloadOutlined
                  spin={isRefreshing}
                  className="text-gray-600 hover:text-indigo-500 text-lg transition-colors duration-300"
                />
              </div>
            </Tooltip>

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
                className="w-10 h-10 flex items-center justify-center rounded-xl
                  bg-gradient-to-r from-brand to-blue-600
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
              bg-gradient-to-r from-brand to-blue-600
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
