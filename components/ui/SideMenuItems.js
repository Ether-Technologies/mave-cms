import {
  LoginOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  ReadOutlined,
  RobotOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Spin, Dropdown } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import AuthorizedSideMenuData   from "../../src/data/authorisedsidemenus.json";
import UnAuthorizedSideMenuData from "../../src/data/unauthorisedsidemenu.json";
import NiloyLabs  from "../../src/data/niloy.json";
import Godfather  from "../../src/data/godfather.json";
import Changelog  from "../../pages/usermanual/changelog.json";
import Image from "next/image";
import Link from "next/link";
import instance from "../../axios";
import { useMenuRefresh } from "../../src/context/MenuRefreshContext";

/* ── Section groupings ─────────────────────── */
const SECTIONS = {
  "Components":    "CONTENT",
  "Creator Studio":"CONTENT",
  "User Manual":   "REFERENCE",
  "Settings":      "SYSTEM",
  "Tools":         "SYSTEM",
  "E-Labs":        "LABS",
};

const NAV_ICONS = {
  "/":              <DashboardOutlined />,
  "/pages":         <FileTextOutlined />,
  "/blogs":         <ReadOutlined />,
  "/build-with-ai": <RobotOutlined />,
};

/* ── SubMenuItem ─────────────────────────────── */
function SubMenuItem({ item, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "6px 10px 6px 40px",
        borderRadius: 7, marginBottom: 1, cursor: "pointer",
        background: active ? "#fffbeb" : hov ? "#f5f5f5" : "transparent",
        transition: "all 0.15s",
      }}
    >
      <Image
        src={item.icon} alt={item.title} width={13} height={13}
        style={{ opacity: active ? 1 : 0.4 }}
      />
      <span style={{
        fontSize: "0.83rem", fontWeight: active ? 600 : 400,
        color: active ? "#d97706" : "#4b5563",
      }}>
        {item.title}
      </span>
    </div>
  );
}

/* ── SubMenuGroup ─────────────────────────────── */
function SubMenuGroup({ item, currentPath, onNavigate, collapsed }) {
  const isChildActive = item.submenu?.some(s => currentPath.startsWith(s.link) && s.link !== "/");
  const [open, setOpen] = useState(isChildActive);
  const [hov, setHov]   = useState(false);

  useEffect(() => { if (isChildActive) setOpen(true); }, [isChildActive]);

  return (
    <div style={{ marginBottom: 1 }}>
      <div
        onClick={() => !collapsed && setOpen(o => !o)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        title={collapsed ? item.title : ""}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 10px 8px 12px", borderRadius: 7, cursor: "pointer",
          background: isChildActive ? "#fffbeb" : hov ? "#f5f5f5" : "transparent",
          transition: "all 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, flexShrink: 0,
            background: isChildActive ? "rgba(252,184,19,0.12)" : "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Image
              src={item.icon} alt={item.title} width={15} height={15}
              style={{ opacity: isChildActive ? 1 : 0.5 }}
            />
          </div>
          {!collapsed && (
            <span style={{
              fontSize: "0.875rem", fontWeight: isChildActive ? 700 : 500,
              color: isChildActive ? "#d97706" : "#1f2937",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {item.title}
            </span>
          )}
        </div>
        {!collapsed && (
          <span style={{
            color: "#c4c4c4", fontSize: "0.5rem", flexShrink: 0,
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}>▼</span>
        )}
      </div>

      {open && !collapsed && (
        <div style={{ marginTop: 1 }}>
          {item.submenu.map(sub => (
            <SubMenuItem
              key={sub.id} item={sub}
              active={currentPath === sub.link || (sub.link !== "/" && currentPath.startsWith(sub.link))}
              onClick={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Section header ─────────────────────────── */
function SectionHeader({ label, collapsed }) {
  if (collapsed) return <div style={{ height: 12 }} />;
  return (
    <p style={{
      fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em",
      color: "#d1d5db", textTransform: "uppercase",
      padding: "16px 12px 5px", margin: 0,
    }}>
      {label}
    </p>
  );
}

/* ── Flat item ───────────────────────────────── */
function FlatItem({ item, active, onClick, collapsed }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={collapsed ? item.title : ""}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px 8px 12px",
        borderRadius: 7, cursor: "pointer", marginBottom: 1,
        background: active ? "#fffbeb" : hov ? "#f5f5f5" : "transparent",
        transition: "all 0.15s",
      }}
    >
      <div style={{
        width: 28, height: 28, borderRadius: 7, flexShrink: 0,
        background: active ? "rgba(252,184,19,0.12)" : "#f5f5f5",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Image
          src={item.icon} alt={item.title} width={15} height={15}
          style={{ opacity: active ? 1 : 0.5 }}
        />
      </div>
      {!collapsed && (
        <span style={{
          fontSize: "0.875rem", fontWeight: active ? 700 : 500,
          color: active ? "#d97706" : "#1f2937",
        }}>
          {item.title}
        </span>
      )}
    </div>
  );
}

/* ── Main ────────────────────────────────────── */
const SideMenuItems = ({ token, user, handleLogout, setIsModalOpen, collapsed }) => {
  const { refreshMenu } = useMenuRefresh();
  const [isLoading, setIsLoading]         = useState(false);
  const [sideMenuData, setSideMenuData]   = useState([]);
  const [godfatherData, setGodfatherData] = useState([]);
  const [customModels, setCustomModels]   = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [version, setVersion]             = useState("v1.0.0");
  const router = useRouter();

  const topNavData = [
    { id: 2, name: "Dashboard",  link: "/" },
    { id: 3, name: "Pages",      link: "/pages" },
    { id: 4, name: "Blogs",      link: "/blogs" },
    { id: 5, name: "MAVE AI",    link: "/build-with-ai" },
  ];

  useEffect(() => {
    const sorted = [...Changelog].sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sorted.length > 0) setVersion(`v${sorted[0].version}`);
  }, []);

  useEffect(() => {
    if (token && user) {
      setSideMenuData(JSON.parse(JSON.stringify(AuthorizedSideMenuData)));
      setGodfatherData(Godfather);
    } else {
      setSideMenuData(UnAuthorizedSideMenuData);
      setGodfatherData([]);
    }
  }, [token, user]);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    instance.get("/generated-models")
      .then(r => r.status === 200 && setCustomModels(r.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [token, refreshMenu]);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "AD";

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

  const allMenuData = useMemo(() => [...sideMenuData, ...godfatherData], [sideMenuData, godfatherData]);

  const roleName = (
    user?.role_mave?.name ||
    user?.role_mave?.title ||
    user?.role ||
    ""
  ).toLowerCase();
  const isAdmin =
    roleName === "admin" ||
    user?.is_admin === true ||
    String(user?.role_id) === "1";

  const finalMenuData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(allMenuData));
    if (user?.email === "atiqisrak@niloy.com")
      data.push(...JSON.parse(JSON.stringify(NiloyLabs)));
    if (token && user && customModels.length > 0) {
      const studio = data.find(m => m.title === "Creator Studio");
      if (studio) {
        studio.submenu = [
          ...(studio.submenu || []),
          ...customModels.map(m => ({
            id: `custom-${m.id}`,
            icon: "/icons/mave/custom-models.svg",
            link: `/custom-models/${m.id}`,
            title: m.model_name.split(" ").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
          })),
        ];
      }
    }
    // Hide Tenants menu from non-admin users
    data.forEach(item => {
      if (item.submenu) {
        item.submenu = item.submenu.filter(
          sub => sub.link !== "/tenants" || isAdmin
        );
      }
    });
    return data;
  }, [allMenuData, customModels, token, user, isAdmin]);

  const navigate = (item) => item.link && router.push(item.link);

  const grouped = useMemo(() => {
    const map = {};
    finalMenuData.forEach(item => {
      const sec = SECTIONS[item.title] || "OTHER";
      if (!map[sec]) map[sec] = [];
      map[sec].push(item);
    });
    return map;
  }, [finalMenuData]);

  const sectionOrder = ["CONTENT", "REFERENCE", "SYSTEM", "LABS", "OTHER"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#fff" }}>

      {/* ── Logo ── */}
      <div style={{
        padding: collapsed ? "16px 0" : "16px 14px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex", alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        flexShrink: 0, minHeight: 60,
      }}>
        {collapsed ? (
          <div onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            <Image src="/images/ui/mave_new_logo.png" alt="Mave" width={30} height={30} objectFit="contain" />
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
              <Image src="/images/ui/mave_new_logo.png" alt="Mave" width={88} height={26} objectFit="contain" />
            </div>
            <span
              onClick={() => router.push("/usermanual/changelog")}
              style={{
                fontSize: "0.6rem", fontWeight: 700, padding: "2px 6px",
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 5, color: "#d97706", cursor: "pointer",
              }}
            >
              {version}
            </span>
          </div>
        )}
      </div>

      {/* ── User card ── */}
      {token && user && (
        <div style={{
          padding: collapsed ? "10px 0" : "10px 10px",
          borderBottom: "1px solid #f3f4f6",
          display: "flex", alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          flexShrink: 0,
        }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomLeft" trigger={["click"]}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer", minWidth: 0 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #fcb813, #f97316)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: "0.72rem", fontWeight: 700,
                boxShadow: "0 2px 6px rgba(252,184,19,0.35)",
              }}>
                {initials}
              </div>
              {!collapsed && (
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    margin: 0, fontSize: "0.8rem", fontWeight: 600,
                    color: "#111827", whiteSpace: "nowrap",
                    overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110,
                  }}>
                    {user?.username || user?.name || "Admin"}
                  </p>
                  <p style={{
                    margin: 0, fontSize: "0.67rem", color: "#9ca3af",
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110,
                  }}>
                    {user?.email || ""}
                  </p>
                </div>
              )}
            </div>
          </Dropdown>

          {!collapsed && (
            <div style={{ display: "flex", gap: 2 }}>
              <button
                style={{
                  width: 28, height: 28, borderRadius: 7, border: "none",
                  background: "transparent", cursor: "pointer", color: "#9ca3af",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", position: "relative",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.color = "#fcb813"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <BellOutlined />
                <span style={{
                  position: "absolute", top: 4, right: 4,
                  width: 5, height: 5, borderRadius: "50%",
                  background: "#fcb813", border: "1px solid #fff",
                }} />
              </button>
              <button
                onClick={() => router.push("/settings/cms-settings")}
                style={{
                  width: 28, height: 28, borderRadius: 7, border: "none",
                  background: "transparent", cursor: "pointer", color: "#9ca3af",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#f5f5f5"; e.currentTarget.style.color = "#fcb813"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                <SettingOutlined />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Search ── */}
      {!collapsed && token && (
        <div style={{ padding: "10px 10px 6px", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: searchFocused ? "#fff" : "#f5f5f5",
            border: `1.5px solid ${searchFocused ? "#fcb813" : "transparent"}`,
            borderRadius: 9, padding: "7px 11px",
            transition: "all 0.2s",
            boxShadow: searchFocused ? "0 0 0 3px rgba(252,184,19,0.1)" : "none",
          }}>
            <SearchOutlined style={{ color: "#9ca3af", fontSize: 12 }} />
            <input
              placeholder="Search..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: "0.79rem", color: "#374151", width: "100%",
              }}
            />
            {!searchFocused && (
              <span style={{ fontSize: "0.6rem", color: "#c4c4c4", flexShrink: 0 }}>⌘K</span>
            )}
          </div>
        </div>
      )}

      {/* ── Top nav links ── */}
      {token && user && (
        <div style={{ padding: collapsed ? "6px 4px" : "6px 8px", flexShrink: 0 }}>
          {topNavData.map(item => {
            const active = router.pathname === item.link || (item.link !== "/" && router.pathname.startsWith(item.link));
            const icon = NAV_ICONS[item.link] || <AppstoreOutlined />;
            return (
              <Link key={item.id} href={item.link}>
                <div
                  title={collapsed ? item.name : ""}
                  style={{
                    display: "flex", alignItems: "center",
                    justifyContent: collapsed ? "center" : "flex-start",
                    gap: 9, padding: collapsed ? "9px 0" : "7px 10px",
                    borderRadius: 8, marginBottom: 1, cursor: "pointer",
                    background: active ? "#fffbeb" : "transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f5f5f5"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: active ? "rgba(252,184,19,0.15)" : "#f0f0f0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem",
                    color: active ? "#d97706" : "#9ca3af",
                    transition: "all 0.15s",
                  }}>
                    {icon}
                  </div>
                  {!collapsed && (
                    <span style={{
                      fontSize: "0.875rem", fontWeight: active ? 700 : 500,
                      color: active ? "#d97706" : "#1f2937",
                    }}>
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Divider ── */}
      <div style={{ height: 1, background: "#f3f4f6", margin: "2px 10px" }} />

      {/* ── Scrollable menu ── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "4px 8px 32px" }}>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <Spin size="small" />
          </div>
        ) : (
          sectionOrder.map(sec => {
            const items = grouped[sec];
            if (!items) return null;
            return (
              <div key={sec}>
                <SectionHeader label={sec} collapsed={collapsed} />
                {items.map(item =>
                  item?.submenu?.length > 0 ? (
                    <SubMenuGroup
                      key={item.id} item={item}
                      currentPath={router.pathname}
                      onNavigate={navigate}
                      collapsed={collapsed}
                    />
                  ) : (
                    <FlatItem
                      key={item.id} item={item}
                      active={router.pathname === item.link}
                      onClick={navigate}
                      collapsed={collapsed}
                    />
                  )
                )}
              </div>
            );
          })
        )}

        {!token && (
          <>
            <div style={{ height: 1, background: "#f3f4f6", margin: "12px 4px" }} />
            <div
              onClick={() => setIsModalOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 8,
                cursor: "pointer", border: "1px solid #e5e7eb",
                color: "#6b7280", fontSize: "0.82rem", fontWeight: 500,
              }}
            >
              <LoginOutlined style={{ fontSize: 15 }} />
              {!collapsed && <span>Login</span>}
            </div>
          </>
        )}
      </div>

      {/* ── Bottom logout ── */}
      {token && (
        <div style={{
          borderTop: "1px solid #f3f4f6", flexShrink: 0,
        }}>
          {/* Logout */}
          <div style={{
            padding: collapsed ? "10px 0" : "10px 14px",
            display: "flex", justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent", border: "none",
                cursor: "pointer", color: "#9ca3af",
                fontSize: "0.8rem", fontWeight: 500, padding: "6px 8px",
                borderRadius: 7, transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "transparent"; }}
            >
              <LogoutOutlined style={{ fontSize: 15 }} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>

          {/* Footer */}
          {!collapsed && (
            <div style={{ padding: "8px 14px 12px", borderTop: "1px solid #f3f4f6" }}>
              <p style={{ margin: 0, fontSize: "0.62rem", color: "#c4c9d4", textAlign: "center", lineHeight: 1.6 }}>
                © {new Date().getFullYear()}{" "}
                <a href="https://www.linkedin.com/in/atiq-israk/" target="_blank" rel="noopener noreferrer"
                  style={{ color: "#d97706", fontWeight: 600, textDecoration: "none" }}>
                  MAVE CMS
                </a>
                <br />
                Powered by{" "}
                <a href="https://www.ethertech.ltd" target="_blank" rel="noopener noreferrer"
                  style={{ color: "#9ca3af", textDecoration: "none" }}>
                  Ether Technologies
                </a>
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default SideMenuItems;
