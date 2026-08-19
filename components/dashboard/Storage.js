import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { formatBytes, mediaCategory } from "./dashboardUtils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function Storage({ media }) {
  const { series, labels, totalSize, totalFiles } = useMemo(() => {
    const buckets = {
      Images: { count: 0, size: 0 },
      Videos: { count: 0, size: 0 },
      Documents: { count: 0, size: 0 },
      Other: { count: 0, size: 0 },
    };

    media.forEach((item) => {
      const category = mediaCategory(item.file_type);
      buckets[category].count += 1;
      buckets[category].size += Number(item.file_size) || 0;
    });

    const entries = Object.entries(buckets).filter(([, value]) => value.count > 0);

    return {
      labels: entries.map(([name]) => name),
      series: entries.map(([, value]) => value.count),
      totalSize: Object.values(buckets).reduce((sum, value) => sum + value.size, 0),
      totalFiles: media.length,
    };
  }, [media]);

  const chartOptions = {
    chart: { type: "donut" },
    labels,
    colors: ["#3498db", "#2980b9", "#f59e0b", "#94a3b8"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Media library</h3>
        <p className="text-gray-600 text-sm">
          {totalFiles} files · {formatBytes(totalSize)}
        </p>
      </div>

      {series.length > 0 ? (
        <ReactApexChart options={chartOptions} series={series} type="donut" height={280} />
      ) : (
        <p className="text-sm text-gray-500 py-12 text-center">No media uploaded yet.</p>
      )}
    </div>
  );
}
