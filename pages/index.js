import React, { useEffect, useState } from "react";
import instance from "../axios";
import { cachedApiCall } from "../utils/apiUtils";
import CounterCards from "../components/dashboard/CounterCards";
import UserStat from "../components/dashboard/UserStat";
import SiteStat from "../components/dashboard/SiteStat";
import LatestEvents from "../components/dashboard/LatestEvents";
import SiteSpeed from "../components/dashboard/SiteSpeed";
import Storage from "../components/dashboard/Storage";
import AverageRequests from "../components/dashboard/AverageRequests";
import {
  FileTextOutlined,
  PictureOutlined,
  ReadOutlined,
  SettingOutlined,
  AppstoreAddOutlined,
  BellOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const quickActions = [
  { label: "New Page",     icon: <FileTextOutlined />,   href: "/pages" },
  { label: "Upload Media", icon: <PictureOutlined />,    href: "/gallery" },
  { label: "New Blog",     icon: <ReadOutlined />,       href: "/blogs" },
  { label: "Components",   icon: <AppstoreAddOutlined />, href: "#" },
  { label: "Settings",     icon: <SettingOutlined />,    href: "/settings" },
];

const Index = () => {
  const [data, setData]         = useState({});
  const [loading, setLoading]   = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const safe = (p) => p.catch(() => ({ data: [] }));

      const [
        pages_r, media_r, menus_r, navbars_r,
        sliders_r, cards_r, forms_r, footers_r,
        users_r,
      ] = await Promise.all([
        safe(cachedApiCall("pages",        () => instance.get("/pages"))),
        safe(cachedApiCall("media",        () => instance.get("/media"))),
        safe(cachedApiCall("menus",        () => instance.get("/menus"))),
        safe(cachedApiCall("navbars",      () => instance.get("/navbars"))),
        safe(cachedApiCall("sliders",      () => instance.get("/sliders"))),
        safe(cachedApiCall("cards",        () => instance.get("/cards"))),
        safe(cachedApiCall("forms",        () => instance.get("/forms"))),
        safe(cachedApiCall("footers",      () => instance.get("/footers"))),
        safe(cachedApiCall("admin-users",  () => instance.get("/admin/users"))),
      ]);

      const allPages = Array.isArray(pages_r.data) ? pages_r.data : [];

      setData({
        pages:   allPages.filter(p => p.type === "Page" || p.type === "Subpage"),
        blogs:   allPages.filter(p => p.type === "Blog"),
        media:   media_r.data,
        menus:   menus_r.data,
        navbars: navbars_r.data,
        sliders: sliders_r.data,
        cards:   cards_r.data,
        forms:   forms_r.data,
        footers: footers_r.data,
        users:   users_r.data,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const stored = localStorage.getItem("user");
    setUserData(stored ? JSON.parse(stored) : null);
  }, []);

  const now   = new Date();
  const hour  = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr  = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ background: "#f4f6f8", minHeight: "100vh", margin: "0 -50%", padding: "2rem 50%", paddingBottom: "2rem" }}>
      <div style={{ maxWidth: "86%", margin: "0 auto" }}>

        {/* ── Header bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <p style={{ color: "#9ca3af", fontSize: "0.78rem", marginBottom: 2 }}>{dateStr}</p>
            <h1 style={{ color: "#111827", fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
              {greeting},{" "}
              <span style={{ color: "#fcb813" }}>
                {userData?.username || userData?.name || "Admin"}
              </span>
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Status badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 8, padding: "6px 14px",
              fontSize: "0.8rem", color: "#16a34a", fontWeight: 500,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
              All systems operational
            </div>
            <button style={{
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "7px 11px", color: "#6b7280", cursor: "pointer", fontSize: "1rem",
            }}>
              <BellOutlined />
            </button>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div style={{
          background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
          padding: "0.875rem 1.25rem", display: "flex", alignItems: "center",
          gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.75rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <span style={{ color: "#9ca3af", fontSize: "0.78rem", marginRight: 4 }}>Quick actions</span>
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#f9fafb", border: "1px solid #e5e7eb",
                borderRadius: 8, padding: "5px 14px",
                fontSize: "0.8rem", color: "#374151",
                cursor: "pointer", fontWeight: 500,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#fcb813"; e.currentTarget.style.color = "#b45309"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
              >
                <span style={{ color: "#fcb813" }}>{a.icon}</span>
                {a.label}
              </div>
            </Link>
          ))}
        </div>

        {/* ── Stat Cards ── */}
        <CounterCards data={data} loading={loading} />

        {/* ── Row 1 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <UserStat userData={userData} />
          <SiteStat data={data} />
        </div>

        {/* ── Row 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <LatestEvents data={data} />
          <SiteSpeed />
        </div>

        {/* ── Row 3 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <Storage data={data} />
          <AverageRequests />
        </div>

      </div>
    </div>
  );
};

export default Index;
