import dynamic from "next/dynamic";
import React, { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const LABELS  = ["Image", "Video", "Documents", "Others", "Empty"];
const COLORS  = ["#fcb813", "#3b82f6", "#8b5cf6", "#10b981", "#e5e7eb"];
const SERIES  = [44, 55, 41, 17, 15];
const TOTAL   = SERIES.reduce((a, b) => a + b, 0);
const USED_PC = Math.round((SERIES.slice(0, 4).reduce((a, b) => a + b, 0) / TOTAL) * 100);

export default function Storage() {
  const [chartOptions] = useState({
    chart: { type: "donut", background: "transparent" },
    labels: LABELS,
    colors: COLORS,
    legend: { position: "bottom", fontSize: "12px", labels: { colors: "#6b7280" }, markers: { width: 8, height: 8, radius: 4 } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true, label: "Used",
              color: "#6b7280", fontSize: "12px", fontWeight: 600,
              formatter: () => `${USED_PC}%`,
            },
            value: { color: "#111827", fontSize: "1.4rem", fontWeight: 800 },
          },
        },
      },
    },
    stroke: { width: 0 },
    tooltip: { y: { formatter: v => `${v} files` } },
  });

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.4rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid #f3f4f6", marginBottom: "0.75rem" }}>
        <div>
          <h3 style={{ color: "#111827", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Media Storage</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: "2px 0 0" }}>Distribution by file type</p>
        </div>
        <span style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 6, padding: "3px 10px", fontSize: "0.72rem", color: "#d97706", fontWeight: 600 }}>
          {USED_PC}% used
        </span>
      </div>

      {/* Segmented progress bar */}
      <div style={{ display: "flex", height: 5, borderRadius: 4, overflow: "hidden", gap: 2, marginBottom: "0.5rem" }}>
        {SERIES.map((val, i) => (
          <div key={i} style={{ flex: val, background: COLORS[i], borderRadius: 4 }} />
        ))}
      </div>

      <ReactApexChart options={chartOptions} series={SERIES} type="donut" height={290} />
    </div>
  );
}
