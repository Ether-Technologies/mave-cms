import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { itemTitle, timeAgo } from "./dashboardUtils";

export default function TrendingContent({ pages }) {
  const router = useRouter();
  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-1">Recent pages</h3>
        <p className="text-gray-600 text-sm">Latest pages in this organization</p>
      </div>

      {recentPages.length === 0 ? (
        <p className="text-sm text-gray-500 py-8 text-center">No pages yet.</p>
      ) : (
        <div className="space-y-4">
          {recentPages.map((page, index) => {
            const published = page.status === true || page.status === 1;
            return (
              <button
                key={page.id}
                type="button"
                onClick={() => router.push(`/page-builder/${page.id}`)}
                className="w-full flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3498db]/10 text-[#3498db] font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm leading-tight text-gray-800">
                      {itemTitle(page, "Untitled page")}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full shrink-0 ${
                        published
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {page.slug ? `/${page.slug}` : "No slug"} · {timeAgo(page.updated_at)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
