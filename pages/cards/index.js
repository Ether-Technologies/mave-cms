import React, { useEffect, useState } from "react";
import { message, Spin, Pagination } from "antd";
import instance from "../../axios";
import CardsHeader from "../../components/cards/CardsHeader";
import CardsList from "../../components/cards/CardsList";
import CardDrawer from "../../components/cards/CardDrawer";

const CardsPage = () => {
  const [loading, setLoading]             = useState(false);
  const [cardsData, setCardsData]         = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [pages, setPages]                 = useState([]);
  const [media, setMedia]                 = useState([]);
  const [viewType, setViewType]           = useState("grid");
  const [searchTerm, setSearchTerm]       = useState("");
  const [sortType, setSortType]           = useState("desc");
  const [itemsPerPage, setItemsPerPage]   = useState(12);
  const [currentPage, setCurrentPage]     = useState(1);
  const [selectedTag, setSelectedTag]     = useState(null);
  const [uniqueTags, setUniqueTags]       = useState([]);

  /* single drawer state */
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [selectedCard, setSelectedCard]   = useState(null); // null = create

  /* ── Fetch ── */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [cardsRes, mediaRes, pagesRes] = await Promise.all([
        instance.get("/cards"),
        instance.get("/media"),
        instance.get("/pages"),
      ]);
      if (cardsRes.status === 200 && mediaRes.status === 200 && pagesRes.status === 200) {
        setCardsData(cardsRes.data);
        setFilteredCards(cardsRes.data);
        setMedia(mediaRes.data);
        setPages(pagesRes.data);
      } else {
        message.error("Failed to fetch data.");
      }
    } catch {
      message.error("Failed to fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  /* ── Tags ── */
  useEffect(() => {
    const tagSet = new Set();
    cardsData.forEach(card => (card?.additional?.tags || []).forEach(t => tagSet.add(t)));
    setUniqueTags([...tagSet]);
  }, [cardsData]);

  /* ── Filter / sort ── */
  useEffect(() => {
    let temp = [...cardsData];
    if (searchTerm.trim())
      temp = temp.filter(c => c?.title_en?.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedTag)
      temp = temp.filter(c => c.additional?.tags?.includes(selectedTag));
    temp.sort((a, b) =>
      sortType === "asc"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );
    setFilteredCards(temp);
    setCurrentPage(1);
  }, [cardsData, searchTerm, sortType, selectedTag]);

  /* ── Pagination ── */
  const indexOfLast  = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCards = filteredCards.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setItemsPerPage(pageSize);
  };

  /* ── Handlers ── */
  const openCreate = () => {
    setSelectedCard(null);
    setDrawerOpen(true);
  };

  const openPreview = (card) => {
    setSelectedCard(card);
    setDrawerOpen(true);
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await instance.delete(`/cards/${cardId}`);
      message.success("Card deleted successfully.");
      fetchData();
    } catch {
      message.error("Failed to delete card.");
    }
  };

  return (
    <div className="mavecontainer" style={{ paddingTop: 4 }}>
      <CardsHeader
        onAddCard={openCreate}
        sortType={sortType}
        setSortType={setSortType}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
        onSearch={setSearchTerm}
        uniqueTags={uniqueTags}
        selectedTag={selectedTag}
        handleTagFilterChange={setSelectedTag}
        viewType={viewType}
        setViewType={setViewType}
        cardsData={cardsData}
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 260 }}>
          <Spin size="large" />
        </div>
      ) : filteredCards.length > 0 ? (
        <CardsList
          cards={currentCards}
          viewType={viewType}
          media={media}
          pages={pages}
          onRefresh={fetchData}
          onDeleteCard={handleDeleteCard}
          onPreviewCard={openPreview}
        />
      ) : (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "60px 0", gap: 12,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "#f9fafb", border: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, color: "#d1d5db",
          }}>🃏</div>
          <p style={{ margin: 0, color: "#6b7280", fontWeight: 500 }}>No cards found</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>Create your first card to get started</p>
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredCards.length}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["12","24","48","100"]}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
        />
      </div>

      <CardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedCard={selectedCard}
        pages={pages}
        media={media}
        uniqueTags={uniqueTags}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default CardsPage;
