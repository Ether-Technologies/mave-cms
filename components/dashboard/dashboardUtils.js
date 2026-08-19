export function asList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function itemTitle(item, fallback = "Untitled") {
  return (
    item?.page_name_en ||
    item?.title_en ||
    item?.title ||
    item?.name ||
    item?.file_name ||
    fallback
  );
}

export function timeAgo(value) {
  if (!value) return "Unknown";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString();
}

export function formatBytes(bytes) {
  const size = Number(bytes) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function mediaCategory(fileType = "") {
  const type = String(fileType).toLowerCase();
  if (type.startsWith("image/")) return "Images";
  if (type.startsWith("video/")) return "Videos";
  if (type.includes("pdf") || type.includes("document") || type.includes("msword") || type.includes("spreadsheet") || type.includes("presentation")) {
    return "Documents";
  }
  return "Other";
}

export function buildActivity(data) {
  const collections = [
    { items: data.pages, type: "Page", action: "updated", link: (item) => `/page-builder/${item.id}` },
    { items: data.media, type: "Media", action: "uploaded", link: () => "/gallery" },
    { items: data.navbars, type: "Navbar", action: "updated", link: () => "/navbars" },
    { items: data.sliders, type: "Slider", action: "updated", link: () => "/sliders" },
    { items: data.footers, type: "Footer", action: "updated", link: () => "/footers" },
  ];

  return collections
    .flatMap(({ items, type, action, link }) =>
      items.map((item) => ({
        id: `${type}-${item.id}`,
        type,
        action,
        title: itemTitle(item, type),
        status: item.status === true || item.status === 1 ? "published" : item.status === false || item.status === 0 ? "draft" : null,
        date: item.updated_at || item.created_at,
        link: link(item),
      }))
    )
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 8);
}
