// components/AverageRequests.js
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Tabs } from "antd";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// Function to generate random data for different time views
const generateRandomData = (type) => {
  const data = [];
  const categories = [];
  const now = new Date();

  if (type === "day") {
    // Generate data for each hour of a day
    for (let i = 0; i < 24; i++) {
      const date = new Date(now.getTime() + i * 60 * 60 * 1000);
      categories.push(`${i}:00`);
      data.push(Math.floor(Math.random() * 50) + 10); // Random hits between 10 to 60
    }
  } else if (type === "week") {
    // Generate data for each day of a week
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
      const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      categories.push(weekdays[date.getDay()]);
      data.push(Math.floor(Math.random() * 300) + 100); // Random hits between 100 to 400
    }
  } else {
    // Generate data for each month
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (let i = 0; i < 12; i++) {
      categories.push(months[i]);
      data.push(Math.floor(Math.random() * 1000) + 500); // Random hits between 500 to 1500
    }
  }

  return { data, categories };
};

export default function AverageRequests() {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [activeTab, setActiveTab] = useState("month");

  useEffect(() => {
    const seriesData = generateRandomData(activeTab);

    setChartOptions({
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 2,
        colors: ["#000000"],
      },
      fill: {
        colors: ["#000000"],
        opacity: 1,
      },
      xaxis: {
        categories: seriesData.categories,
      },
      yaxis: {
        title: {
          text: "API Hits",
        },
      },
      tooltip: {
        x: {
          format:
            activeTab === "day"
              ? "HH:mm"
              : activeTab === "week"
              ? "dd/MM/yy"
              : "MMM",
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            xaxis: {
              labels: {
                rotate: -45,
              },
            },
          },
        },
      ],
    });

    setChartSeries([
      {
        name: "API Requests",
        data: seriesData.data,
      },
    ]);
  }, [activeTab]);

  return (
    <div className="border-2 border-gray-300 rounded-xl flex flex-col justify-between bg-white">
      <div className="flex justify-between items-center border-b-2 border-gray-300 p-3 mb-4">
        <h3 className="text-lg font-semibold">Average Requests</h3>
        <Image
          src="/icons/mave_icons/threedots.svg"
          alt="Three Dots"
          width={40}
          height={40}
          className="transform rotate-90"
        />
      </div>

      {/* Tabs for Day, Week, and Month */}
      <div className="px-4 mb-4">
        <Tabs
          type="card"
          centered
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          className="ant-tabs-card ant-tabs-card-bordered"
        >
          <Tabs.TabPane tab="Day" key="day" />
          <Tabs.TabPane tab="Week" key="week" />
          <Tabs.TabPane tab="Month" key="month" />
        </Tabs>
      </div>

      {chartOptions && chartSeries.length > 0 && (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
          className="w-full"
        />
      )}
      {/* {console.log("Chart Options: ", chartOptions)} */}
    </div>
  );
}
