import { MoreOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import React, { useState } from "react";
import { Chart } from "react-google-charts";

export const weekData = [
  ["Factor", "Number", { role: "style" }],
  ["Visitors", 113, "#FF6633"],
  ["Users", 100, "#3361FF"],
  ["Page Views", 123, "#8833FF"],
  ["Bounce Rate", 50, "#2EE6CA"],
];

export const monthsData = [
  ["Factor", "Number", { role: "style" }],
  ["Visitors", 1134, "#FF6633"],
  ["Users", 1000, "#fcb813"],
  ["Page Views", 1234, "#8833FF"],
  ["Bounce Rate", 500, "#2EE6CA"],
];

export const yearData = [
  ["Factor", "Number", { role: "style" }],
  ["Visitors", 11345, "#FF6633"],
  ["Users", 10000, "#3361FF"],
  ["Page Views", 12345, "#8833FF"],
  ["Bounce Rate", 5000, "#2EE6CA"],
];

export const options = {
  subtitle: "Site Statistic as per factor",
  bars: "horizontal",
  bar: {
    groupWidth: "15%",
    borderRadius: 10,
  },
  vAxis: {
    title: "Users",
  },
  legend: {
    position: "none",
  },
  animation: {
    startup: true,
    easing: "linear",
    duration: 1500,
  },
};

export default function SiteStat() {
  const [dataTypes, setDataTypes] = useState("Week");

  const data =
    dataTypes === "Week"
      ? weekData
      : dataTypes === "Months"
        ? monthsData
        : yearData;

  return (
    <div
      style={{
        padding: "2rem",
        borderRadius: "1rem",
        backgroundColor: "white",
      }}
    >
      <div
        className="flexed-among"
        style={{
          borderBottom: "1px solid var(--gray)",
          marginBottom: "1rem",
        }}
      >
        <h4
          style={{
            fontSize: "1.1rem",
            fontWeight: 500,
            color: "var(--black)",
          }}
        >
          Site Stat
        </h4>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["Week"]}
          onClick={(e) => setDataTypes(e.key)}
        >
          <Menu.Item key="Week">Week</Menu.Item>
          <Menu.Item key="Months">Months</Menu.Item>
          <Menu.Item key="Year">Year</Menu.Item>
        </Menu>
        <MoreOutlined />
      </div>

      <Chart
        chartType="BarChart"
        width={"100%"}
        height={"600px"}
        data={data}
        options={options}
      />
    </div>
  );
}
