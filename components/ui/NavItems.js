// components/ui/NavItems.js

import { SearchOutlined, LoginOutlined } from "@ant-design/icons";
import { Input, Space, Layout, Dropdown, Button, Menu } from "antd";
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
    // Sort changelog by date in descending order and set the state
    const sortedChangelog = Changelog.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setChangeLogs(sortedChangelog);
  }, []);

  const userItems = [
    {
      key: "1",
      label: <Link href="/user/profile">Profile</Link>,
    },
    {
      key: "2",
      label: <Link href="/dashboard">Dashboard</Link>,
    },
    {
      key: "3",
      label: "Help",
    },
    {
      key: "4",
      label: (
        <div onClick={handleLogout} className="cursor-pointer">
          Logout
        </div>
      ),
    },
  ];

  return (
    <Layout.Header
      className={`fixed w-full h-16 grid items-center bg-white z-50 ${
        user ? "grid-cols-12" : "grid-cols-2"
      }`}
    >
      {/* Logo and Version */}
      <div
        className={`flex items-center gap-2 cursor-pointer lg:pl-0 ${
          user ? "col-span-2" : ""
        }`}
        onClick={() => router.push("/")}
      >
        <Image
          src="/images/ui/mave_new_logo.png"
          alt="Mave Logo"
          width={120}
          height={40}
          objectFit="contain"
        />
        {/* Version */}
        <Button
          className="px-2 py-1 rounded-md text-white lg:text-xs md:text-xs font-bold bg-theme border-2 border-themedark"
          onClick={() => router.push("/usermanual/changelog")}
        >
          {changeLogs && changeLogs.length > 0
            ? `v${changeLogs[0].version}`
            : "v1.0.0"}
        </Button>
      </div>

      {user && token ? (
        <>
          <Menu
            mode="horizontal"
            selectedKeys={[selectedMenuItem]}
            className="flex flex-1 justify-center items-center md:space-x-2 lg:space-x-0 col-span-5 bg-transparent"
          >
            {topNavData &&
              topNavData?.map((item) => (
                <Menu.Item
                  key={item.name}
                  onClick={() => {
                    setSelectedMenuItem(item.name);
                  }}
                  className="text-md font-semibold rounded-md cursor-pointer"
                >
                  <Link
                    className="text-base font-semibold rounded-md cursor-pointer "
                    href={item.link}
                  >
                    {item.name}
                  </Link>
                </Menu.Item>
              ))}
          </Menu>

          {/* Search Bar */}
          <div className="flex flex-1 justify-center items-center col-span-3 mr-6">
            <Input
              placeholder="Try searching «Headless CMS»"
              suffix={<SearchOutlined />}
              className="w-full max-w-md h-10 rounded-full shadow-inner"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4 col-span-2">
            {/* Notification Bell */}
            <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer">
              <Image
                src="/icons/mave_icons/bell-ring.svg"
                alt="Notifications"
                width={20}
                height={20}
                objectFit="contain"
              />
            </div>

            {/* Settings */}
            <div
              className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
              onClick={() => router.push("/settings/cms-settings")}
            >
              <Image
                src="/icons/mave_icons/wrench.svg"
                alt="Settings"
                width={20}
                height={20}
                objectFit="contain"
              />
            </div>

            {/* User Dropdown */}
            <Dropdown menu={{ items: userItems }} placement="bottomRight">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer">
                <Image
                  src="/icons/mave_icons/user.svg"
                  alt="User"
                  width={20}
                  height={20}
                  objectFit="contain"
                />
              </div>
            </Dropdown>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <Button
            icon={<LoginOutlined />}
            onClick={() => router.push("/login")}
            className="mavebutton w-fit"
          >
            Login
          </Button>
        </div>
      )}
    </Layout.Header>
  );
}
