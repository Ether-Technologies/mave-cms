import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { SlidersOutlined } from "@ant-design/icons";
import ImageSlider from "./ImageSlider";
import CardSlider from "./CardSlider";

const TypeChip = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 6,
      height: 32, padding: "0 14px", borderRadius: 20,
      border: active ? "none" : "1px solid #e5e7eb",
      background: active ? "#111827" : "#fff",
      color: active ? "#fcb813" : "#374151",
      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
      transition: "all 0.15s",
      boxShadow: active ? "0 2px 8px rgba(17,24,39,0.2)" : "none",
    }}
  >
    {label}
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 18, height: 18, borderRadius: "50%",
      background: active ? "rgba(252,184,19,0.2)" : "#f3f4f6",
      color: active ? "#fcb813" : "#6b7280",
      fontSize: "0.68rem", fontWeight: 700,
    }}>{count}</span>
  </button>
);

const SliderList = ({
  sliders = [],
  viewType = "grid",
  MEDIA_URL,
  handleEditClick,
  handleDeleteSlider,
  itemsPerPage = 12,
}) => {
  const [activeType, setActiveType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [activeType, itemsPerPage]);

  const imageCount = sliders.filter(s => !s.type || s.type.toLowerCase() === "image").length;
  const cardCount  = sliders.filter(s => s.type?.toLowerCase() === "card").length;

  const filtered = activeType === "all"
    ? sliders
    : sliders.filter(s =>
        activeType === "image"
          ? (!s.type || s.type.toLowerCase() === "image")
          : s.type?.toLowerCase() === "card"
      );

  const indexOfLast  = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paged = filtered.slice(indexOfFirst, indexOfLast);

  const gridCols = viewType === "grid"
    ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }
    : { display: "flex", flexDirection: "column", gap: 12 };

  if (sliders.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "60px 0", gap: 12,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(252,184,19,0.35)",
        }}>
          <SlidersOutlined style={{ fontSize: 26, color: "#fff" }} />
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontWeight: 500 }}>No sliders found</p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>Create your first slider to get started</p>
      </div>
    );
  }

  return (
    <div>
      {/* Type filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <TypeChip label="All"   count={sliders.length} active={activeType === "all"}   onClick={() => setActiveType("all")} />
        <TypeChip label="Image" count={imageCount}      active={activeType === "image"} onClick={() => setActiveType("image")} />
        <TypeChip label="Card"  count={cardCount}       active={activeType === "card"}  onClick={() => setActiveType("card")} />
      </div>

      {paged.length > 0 ? (
        <div style={gridCols}>
          {paged.map(slider =>
            (!slider.type || slider.type.toLowerCase() === "image") ? (
              <ImageSlider
                key={slider.id}
                slider={slider}
                MEDIA_URL={MEDIA_URL}
                handleEditClick={handleEditClick}
                handleDeleteSlider={handleDeleteSlider}
                viewType={viewType}
              />
            ) : (
              <CardSlider
                key={slider.id}
                slider={slider}
                MEDIA_URL={MEDIA_URL}
                handleEditClick={handleEditClick}
                handleDeleteSlider={handleDeleteSlider}
                viewType={viewType}
              />
            )
          )}
        </div>
      ) : (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "40px 0", gap: 8,
        }}>
          <p style={{ margin: 0, color: "#6b7280", fontWeight: 500 }}>
            No {activeType === "all" ? "" : activeType} sliders found
          </p>
        </div>
      )}

      {/* Pagination */}
      {filtered.length > itemsPerPage && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filtered.length}
            onChange={setCurrentPage}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
          />
        </div>
      )}
    </div>
  );
};

export default SliderList;
