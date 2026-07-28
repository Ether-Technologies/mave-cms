// components/Storage.js
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Storage() {
  const [chartOptions] = useState({
    chart: {
      type: "donut",
    },
    labels: ["Image", "Video", "Documents", "Others", "Empty"],
    colors: ["#000000", "#525252", "#FEE9B6", "#FFF4DC", "#FFFFFF"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "right",
    },
  });

  const [chartSeries] = useState([44, 55, 41, 17, 15]);

  return (
    <div className="border-2 border-gray-300 rounded-xl flex flex-col justify-between bg-white">
      <div className="flex justify-between items-center border-b-2 border-gray-300 p-3 mb-4">
        <h3 className="text-lg font-semibold">Storage</h3>
        <Image
          src="/icons/mave_icons/threedots.svg"
          alt="Three Dots"
          width={40}
          height={40}
          className="transform rotate-90"
        />
      </div>
      {chartOptions && chartSeries.length > 0 && (
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={350}
        />
      )}
      {/* {console.log("Chart Series: ", chartSeries)} */}
    </div>
  );
}
