// components/PageBuilder/PageInfoDisplay.jsx

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const PageInfoDisplay = ({ page }) => {
  const [type, setType] = useState("");

  useEffect(() => {
    if (page?.type === "Event") {
      setType("Event");
    } else if (page?.type === "Blog") {
      setType("Blog");
    } else if (page?.type === "Footer") {
      setType("Footer");
    } else if (page?.type === "Page") {
      setType("Page");
    } else if (page?.type === "Subpage") {
      setType("Subpage");
    } else {
      setType("Unknown");
    }
  }, [page]);

  return (
    <div className="grid grid-cols-2 transition-all duration-300">
      <div className="flex flex-col transition-all duration-300">
        {/* Page Name EN */}
        <h1>
          <span className="font-semibold text-theme">{type} Title:</span>
          {page.page_name_en}
        </h1>

        {/* Page Name Alt */}
        <h1>
          <span className="font-semibold text-theme">{type} Title (Alt):</span>
          {page.page_name_bn}
        </h1>

        {/* Page Slug */}
        {type === "Page" && (
          <Link href={`/page-builder/${page.id}`}>
            <div className="cursor-pointer flex gap-1 items-center">
              <span className="font-semibold text-theme">Link:</span>
              <span className="text-black hover:underline">
                /{page.slug}
              </span>
            </div>
          </Link>
        )}

        {/* Page Type */}
        <h1>
          <span className="font-semibold text-theme">Type: </span>
          <span className="text-gray-600 font-semibold">
            {page.additional && page.additional.length > 0
              ? page.additional?.map((type) => type.pageType).join(", ")
              : "Page"}
          </span>
        </h1>
      </div>

      {/* Page Meta Image Display */}
      {page.additional &&
        page.additional.length > 0 &&
        page.additional[0].metaImage && (
          <div className="flex flex-col items-end">
            <span className="font-semibold text-theme">Page Meta Image</span>
            <div className="relative w-32 h-32 mt-2">
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${page.additional[0].metaImage}`}
                alt={page.additional[0].metaImageAlt || "Meta Image"}
                objectFit="cover"
                className="rounded-md"
                width={300}
                height={150}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default PageInfoDisplay;
