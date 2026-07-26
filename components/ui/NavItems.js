import {
  SearchOutlined,
  LoginOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Dropdown, Input } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Changelog from "../../pages/usermanual/changelog.json";
import TopNavData from "../../src/data/topnavdata.json";
import Link from "next/link";
import Image from "next/image";

export default function NavItems({ user, token, handleLogout, theme, setTheme }) {
  const [changeLogs, setChangeLogs]   = useState([]);
  const [topNavData, setTopNavData]   = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTopNavData(TopNavData);
    const sorted = [...Changelog].sort((a, b) => new Date(b.date) - new Date(a.date));
    setChangeLogs(sorted);
  }, []);

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <Link href="/user/profile" style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", color: "#374151" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><UserOutlined style={{ color: "#9ca3af" }} /> Profile</span>
        </Link>
      ),
    },
    {
      key: "dashboard",
      label: (
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", color: "#374151" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><DashboardOutlined style={{ color: "#9ca3af" }} /> Dashboard</span>
        </Link>
      ),
    },
    {
      key: "help",
      label: (
        <span style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", color: "#374151" }}>
          <QuestionCircleOutlined style={{ color: "#9ca3af" }} /> Help
        </span>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <div onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", color: "#dc2626", cursor: "pointer" }}>
          <LogoutOutlined /> Logout
        </div>
      ),
    },
  ];

  const version = changeLogs.length > 0 ? `v${changeLogs[0].version}` : "v1.0.0";
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: 60, background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      display: "flex", alignItems: "center",
      padding: "0 1.25rem", gap: "1rem",
    }}>

      {/* ── Logo ── */}
      <div
        onClick={() => router.push("/")}
        style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }}
      >
        <Image src="/images/ui/mave_new_logo.png" alt="Mave" width={100} height={32} objectFit="contain" />
        <span
          onClick={e => { e.stopPropagation(); router.push("/usermanual/changelog"); }}
          style={{
            fontSize: "0.65rem", fontWeight: 700, padding: "2px 7px",
            background: "#fffbeb", border: "1px solid #fde68a",
            borderRadius: 6, color: "#d97706", cursor: "pointer",
          }}
        >
          {version}
        </span>
      </div>

      {/* ── Nav links (center) ── */}
      {user && token && (
        <nav style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "center" }}>
          {topNavData.map(item => {
            const active = router.pathname === item.link || (item.link !== "/" && router.pathname.startsWith(item.link));
            return (
              <Link key={item.id} href={item.link}>
                <span style={{
                  display: "inline-block", padding: "6px 14px",
                  borderRadius: 8, fontSize: "0.85rem", fontWeight: 600,
                  color: active ? "#d97706" : "#6b7280",
                  background: active ? "#fffbeb" : "transparent",
                  border: active ? "1px solid #fde68a" : "1px solid transparent",
                  cursor: "pointer", transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = "#374151"; e.currentTarget.style.background = "#f9fafb"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.background = "transparent"; } }}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* ── Right: search + actions ── */}
      {user && token ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: searchFocused ? "#fff" : "#f9fafb",
            border: `1px solid ${searchFocused ? "#fcb813" : "#e5e7eb"}`,
            borderRadius: 20, padding: "5px 14px",
            transition: "all 0.2s", width: 220,
            boxShadow: searchFocused ? "0 0 0 3px rgba(252,184,19,0.15)" : "none",
          }}>
            <SearchOutlined style={{ color: "#9ca3af", fontSize: 13 }} />
            <input
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: "0.82rem", color: "#374151", width: "100%",
              }}
            />
          </div>

          {/* Bell */}
          <button
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#f9fafb", border: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#6b7280", fontSize: "0.95rem",
              position: "relative", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#fcb813"; e.currentTarget.style.color = "#d97706"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <BellOutlined />
            <span style={{
              position: "absolute", top: 7, right: 7,
              width: 7, height: 7, borderRadius: "50%",
              background: "#fcb813", border: "2px solid #fff",
            }} />
          </button>

          {/* Settings */}
          <button
            onClick={() => router.push("/settings/cms-settings")}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#f9fafb", border: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#6b7280", fontSize: "0.95rem",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#fcb813"; e.currentTarget.style.color = "#d97706"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
          >
            <SettingOutlined />
          </button>

          {/* User avatar */}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "linear-gradient(135deg, #fcb813, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#fff", fontSize: "0.75rem", fontWeight: 700,
              border: "2px solid #fff",
              boxShadow: "0 0 0 2px #fde68a",
              flexShrink: 0,
            }}>
              {initials}
            </div>
          </Dropdown>
        </div>
      ) : (
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fcb813", border: "none",
              borderRadius: 8, padding: "8px 18px",
              fontSize: "0.85rem", fontWeight: 700,
              color: "#111827", cursor: "pointer",
            }}
          >
            <LoginOutlined /> Login
          </button>
        </div>
      )}
    </header>
  );
}
