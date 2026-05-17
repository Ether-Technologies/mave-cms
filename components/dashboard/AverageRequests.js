import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const generateData = (type) => {
  const now = new Date();
  if (type === "day") {
    return {
      categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 50) + 10),
    };
  }
  if (type === "week") {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return {
      categories: Array.from({ length: 7 }, (_, i) => days[new Date(now.getTime() + i * 86400000).getDay()]),
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 300) + 100),
    };
  }
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return {
    categories: months,
    data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 1000) + 500),
  };
};

const TABS = [{ key: "day", label: "Day" }, { key: "week", label: "Week" }, { key: "month", label: "Month" }];

export default function AverageRequests() {
  const [options, setOptions] = useState({});
  const [series, setSeries]   = useState([]);
  const [tab, setTab]         = useState("month");

  useEffect(() => {
    const { categories, data } = generateData(tab);
    setOptions({
      chart: { type: "bar", toolbar: { show: false }, background: "transparent" },
      dataLabels: { enabled: false },
      plotOptions: { bar: { borderRadius: 5, columnWidth: "52%" } },
      fill: { colors: ["#fcb813"] },
      xaxis: {
        categories,
        labels: { style: { fontSize: "10px", colors: "#9ca3af" } },
        axisBorder: { color: "#e5e7eb" },
        axisTicks: { color: "#e5e7eb" },
      },
      yaxis: { labels: { style: { colors: "#9ca3af", fontSize: "10px" } } },
      grid: { borderColor: "#f3f4f6", strokeDashArray: 4, xaxis: { lines: { show: false } } },
      tooltip: { y: { formatter: v => `${v} hits` } },
    });
    setSeries([{ name: "API Requests", data }]);
  }, [tab]);

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.4rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid #f3f4f6", marginBottom: "0.5rem" }}>
        <div>
          <h3 style={{ color: "#111827", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>API Requests</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: "2px 0 0" }}>Average hits per period</p>
        </div>
        <div style={{ display: "flex", gap: 2, background: "#f3f4f6", borderRadius: 8, padding: 3 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: tab === t.key ? "#fff" : "transparent",
              border: "none", borderRadius: 6, padding: "4px 12px",
              fontSize: "0.75rem", fontWeight: 600,
              color: tab === t.key ? "#111827" : "#6b7280",
              cursor: "pointer", boxShadow: tab === t.key ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      {options && series.length > 0 && (
        <ReactApexChart options={options} series={series} type="bar" height={290} />
      )}
    </div>
  );
}
