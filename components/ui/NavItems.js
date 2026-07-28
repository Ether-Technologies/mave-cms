// components/ui/NavItems.js

import {
  SearchOutlined,
  LoginOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Input, Layout, Dropdown, Button, Badge } from "antd";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Changelog from "../../pages/usermanual/changelog.json";
import TopNavData from "../../src/data/topnavdata.json";
import AuthorisedMenus from "../../src/data/authorisedsidemenus.json";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

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
      className="fixed w-full h-14 flex items-center justify-between px-3 
    md:px-4 lg:px-6 mave-shell-header z-50"
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
          className="px-2 py-0.5 rounded-md text-xs font-medium text-zinc-600 cursor-pointer 
            bg-zinc-100 border border-zinc-200 hover:bg-zinc-200 hover:text-zinc-900
            transition-colors duration-150"
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
          <div className="hidden lg:flex items-center gap-1 mx-2 flex-1 justify-center">
            {topNavData &&
              topNavData?.map((item) => (
                <Link key={item.name} href={item.link}>
                  <div
                    className={`mave-nav-pill cursor-pointer inline-flex items-center gap-2
                      ${topNavData && item === topNavData[topNavData.length - 1] ? "maveaibutton !text-white !px-3.5 !py-1.5" : "mavetopnavbutton"}
                      ${selectedMenuItem === item.name ? "mave-nav-pill--active" : ""}`}
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
            <div className="hidden xl:block mr-2 relative" ref={searchRef}>
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined className="text-zinc-400 text-base" />}
                className="w-52 h-10 rounded-lg text-sm bg-zinc-50 border-zinc-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchResults(true)}
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-12 right-0 w-96 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg border border-zinc-200 search-results-dropdown z-50">
                  <div className="p-3 border-b border-zinc-100 bg-zinc-50">
                    <p className="text-sm font-medium text-zinc-700">
                      Quick Navigation ({searchResults.length} results)
                    </p>
                  </div>

                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.id}-${index}`}
                        onClick={() => handleSearchResultClick(result.link)}
                        className="search-result-item flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-zinc-50 transition-colors duration-150 group mb-1"
                      >
                        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-100 group-hover:bg-zinc-200 transition-colors duration-150">
                          <Image
                            src={result.icon}
                            alt={result.title}
                            width={20}
                            height={20}
                            className="opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-medium text-zinc-800 group-hover:text-zinc-900 transition-colors">
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

                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <span className="text-zinc-700 text-xs">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <Badge count={3} size="default" color="#a1a1aa">
              <div className="mave-icon-btn cursor-pointer">
                <BellOutlined className="text-lg" />
              </div>
            </Badge>

            <div
              className="mave-icon-btn cursor-pointer"
              onClick={() => router.push("/settings/cms-settings")}
            >
              <SettingOutlined className="text-lg" />
            </div>

            <Dropdown menu={{ items: userItems }} placement="bottomRight">
              <div className="mave-icon-btn !bg-zinc-900 !border-zinc-900 !text-white hover:!bg-zinc-800 cursor-pointer mr-6 md:mr-8">
                <UserOutlined className="text-lg" />
              </div>
            </Dropdown>
          </div>
        </>
      ) : (
        <div className="flex justify-end flex-shrink-0">
          <Button
            type="primary"
            icon={<LoginOutlined className="text-base" />}
            onClick={() => router.push("/login")}
            className="h-10 px-5 font-medium rounded-lg text-sm mr-2 md:mr-0"
          >
            Login
          </Button>
        </div>
      )}
    </Layout.Header>
  );
}
