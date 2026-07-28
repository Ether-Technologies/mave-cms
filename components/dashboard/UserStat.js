// components/UserStat.js
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export const generateRandomActiveUsersData = () => {
  const data = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(now.getTime() + i * 60 * 60 * 1000); // Increment by 1 hour
    data.push({
      x: date, // Use Date objects for datetime
      y: Math.floor(Math.random() * 1000) + 200, // Random value between 200 and 1200
    });
  }

  return data;
};

export default function UserStat() {
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const seriesData = generateRandomActiveUsersData();

    setChartOptions({
      chart: {
        type: "area",
        toolbar: { show: false },
        height: 350,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: ["#000000"],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0,
          stops: [25, 100],
          colorStops: [
            {
              offset: 0,
              color: "#000000",
              opacity: 1,
            },
            {
              offset: 100,
              color: "#000000",
              opacity: 0.25,
            },
          ],
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          rotate: -45,
        },
        tickAmount: 7,
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        x: {
          format: "yyyy-MM-dd HH:mm",
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
        name: "Concurrent Active Users",
        data: seriesData,
      },
    ]);
  }, []);

  return (
    <div className="border-2 border-gray-300 rounded-xl bg-white p-4">
      <div className="flex justify-between items-center border-b-2 border-gray-300 p-3 mb-4">
        <h3 className="text-lg font-semibold">Concurrent Active Users</h3>
        <Image
          src="/icons/mave_icons/threedots.svg"
          alt="Three Dots"
          width={40}
          height={40}
          className="transform rotate-90"
        />
      </div>
      {chartSeries.length > 0 && (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="area"
          height={350}
          className="w-full"
        />
      )}
      {/* {console.log("Chart Series: ", chartSeries)} */}
    </div>
  );
}
