import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export const generateRandomActiveUsersData = () => {
  const now = new Date();
  return Array.from({ length: 7 }, (_, i) => ({
    x: new Date(now.getTime() + i * 3600000),
    y: Math.floor(Math.random() * 1000) + 200,
  }));
};

export default function UserStat() {
  const [options, setOptions] = useState({});
  const [series, setSeries]   = useState([]);

  useEffect(() => {
    setOptions({
      chart: { type: "area", toolbar: { show: false }, background: "transparent" },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2, colors: ["#fcb813"] },
      fill: {
        type: "gradient",
        gradient: {
          colorStops: [
            { offset: 0,   color: "#fcb813", opacity: 0.2 },
            { offset: 100, color: "#fcb813", opacity: 0   },
          ],
        },
      },
      xaxis: {
        type: "datetime",
        labels: { rotate: -30, style: { fontSize: "10px", colors: "#9ca3af" } },
        axisBorder: { color: "#e5e7eb" },
        axisTicks: { color: "#e5e7eb" },
      },
      yaxis: { labels: { style: { colors: "#9ca3af", fontSize: "10px" } } },
      grid: { borderColor: "#f3f4f6", strokeDashArray: 4, xaxis: { lines: { show: false } } },
      tooltip: { x: { format: "HH:mm" } },
    });
    setSeries([{ name: "Active Users", data: generateRandomActiveUsersData() }]);
  }, []);

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.4rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid #f3f4f6", marginBottom: "0.5rem" }}>
        <div>
          <h3 style={{ color: "#111827", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Active Users</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: "2px 0 0" }}>Concurrent sessions · last 7h</p>
        </div>
        <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "3px 10px", fontSize: "0.72rem", color: "#16a34a", fontWeight: 600 }}>
          ● Live
        </span>
      </div>
      {series.length > 0 && (
        <ReactApexChart options={options} series={series} type="area" height={260} />
      )}
    </div>
  );
}
