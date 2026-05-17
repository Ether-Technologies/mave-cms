import React, { useState } from "react";
import { Chart } from "react-google-charts";

const WEEK  = [["Factor","Number",{role:"style"}],["Visitors",113,"#fcb813"],["Users",100,"#3b82f6"],["Page Views",123,"#8b5cf6"],["Bounce Rate",50,"#10b981"]];
const MONTH = [["Factor","Number",{role:"style"}],["Visitors",1134,"#fcb813"],["Users",1000,"#3b82f6"],["Page Views",1234,"#8b5cf6"],["Bounce Rate",500,"#10b981"]];
const YEAR  = [["Factor","Number",{role:"style"}],["Visitors",11345,"#fcb813"],["Users",10000,"#3b82f6"],["Page Views",12345,"#8b5cf6"],["Bounce Rate",5000,"#10b981"]];

const CHART_OPTIONS = {
  bars: "horizontal",
  bar: { groupWidth: "55%", borderRadius: 6 },
  legend: { position: "none" },
  backgroundColor: "transparent",
  hAxis: {
    textStyle: { color: "#9ca3af", fontSize: 11 },
    baselineColor: "#e5e7eb",
    gridlines: { color: "#f3f4f6" },
  },
  vAxis: { textStyle: { color: "#6b7280", fontSize: 11 }, baselineColor: "#e5e7eb" },
  animation: { startup: true, easing: "out", duration: 700 },
  chartArea: { left: 90, right: 20, top: 10, bottom: 20 },
};

const TABS = ["Week", "Month", "Year"];

export default function SiteStat() {
  const [tab, setTab] = useState("Week");
  const data = tab === "Week" ? WEEK : tab === "Month" ? MONTH : YEAR;

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.4rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "0.75rem", borderBottom: "1px solid #f3f4f6", marginBottom: "0.5rem" }}>
        <div>
          <h3 style={{ color: "#111827", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>Site Statistics</h3>
          <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: "2px 0 0" }}>Visitors, users &amp; engagement</p>
        </div>
        <div style={{ display: "flex", gap: 2, background: "#f3f4f6", borderRadius: 8, padding: 3 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? "#fff" : "transparent",
              border: "none", borderRadius: 6, padding: "4px 12px",
              fontSize: "0.75rem", fontWeight: 600,
              color: tab === t ? "#111827" : "#6b7280",
              cursor: "pointer", boxShadow: tab === t ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </div>
      <Chart chartType="BarChart" width="100%" height="320px" data={data} options={CHART_OPTIONS} />
    </div>
  );
}
