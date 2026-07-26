import React, { useEffect, useState } from "react";
import { message, Spin, Form } from "antd";
import instance from "../../axios";
import SliderList from "../../components/slider/SliderList";
import SliderForm from "../../components/slider/SliderForm";
import SlidersHeader from "../../components/slider/SlidersHeader";

const Sliders = () => {
  const [allSliders, setAllSliders]           = useState([]);
  const [displayedSliders, setDisplayedSliders] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedMedia, setSelectedMedia]     = useState([]);
  const [selectedCards, setSelectedCards]     = useState([]);
  const [editingItemId, setEditingItemId]     = useState(null);
  const [form]                                = Form.useForm();
  const [type, setType]                       = useState("image");
  const [searchTerm, setSearchTerm]           = useState("");
  const [sortType, setSortType]               = useState("desc"); // desc = newest first
  const [allTags, setAllTags]                 = useState([]);
  const [selectedTag, setSelectedTag]         = useState("");
  const [isFormVisible, setIsFormVisible]     = useState(false);
  const [viewType, setViewType]               = useState("grid");
  const [itemsPerPage, setItemsPerPage]       = useState(12);

  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/sliders");
      if (response.data && Array.isArray(response.data)) {
        setAllSliders(response.data);
        const tagSet = new Set();
        response.data.forEach(slider => {
          (slider.additional?.tags || []).forEach(t => tagSet.add(t));
          (slider.cards || []).forEach(card => {
            (card.additional?.tags || []).forEach(t => tagSet.add(t));
          });
        });
        setAllTags([...tagSet]);
      } else {
        message.error("Failed to fetch sliders.");
      }
    } catch {
      message.error("Failed to fetch sliders.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchSliders(); }, []);

  /* ── Filter / sort ── */
  useEffect(() => {
    let temp = [...allSliders];
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter(s =>
        s.title_en?.toLowerCase().includes(lower) ||
        s.title_bn?.toLowerCase().includes(lower)
      );
    }
    if (selectedTag) {
      temp = temp.filter(s => {
        if (s.additional?.tags?.includes(selectedTag)) return true;
        return (s.cards || []).some(c => c.additional?.tags?.includes(selectedTag));
      });
    }
    temp.sort((a, b) =>
      sortType === "desc"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );
    setDisplayedSliders(temp);
  }, [allSliders, searchTerm, sortType, selectedTag]);

  /* ── Handlers ── */
  const handleAddSlider = () => {
    setEditingItemId(null);
    setIsFormVisible(true);
    form.resetFields();
    setSelectedMedia([]);
    setSelectedCards([]);
    setType("image");
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    setEditingItemId(null);
    form.resetFields();
    setSelectedMedia([]);
    setSelectedCards([]);
    setType("image");
  };

  const handleEditClick = (id) => {
    setEditingItemId(id);
    setIsFormVisible(true);
    const s = allSliders.find(sl => sl.id === id);
    if (s) {
      form.setFieldsValue({
        title_en: s.title_en,
        title_bn: s.title_bn,
        description_en: s.description_en,
        description_bn: s.description_bn,
        type: s.type,
      });
      setSelectedMedia(s.medias || []);
      setSelectedCards(s.card_ids || []);
      setType(s.type);
    }
  };

  const handleDeleteSlider = async (id) => {
    try {
      setLoading(true);
      await instance.delete(`/sliders/${id}`);
      message.success("Slider deleted successfully.");
      fetchSliders();
    } catch {
      message.error("Failed to delete slider.");
    }
    setLoading(false);
  };

  return (
    <div className="mavecontainer" style={{ paddingTop: 4 }}>
      <SlidersHeader
        onAddSlider={handleAddSlider}
        sortType={sortType}
        setSortType={setSortType}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(v) => setItemsPerPage(v)}
        onSearch={setSearchTerm}
        allTags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        viewType={viewType}
        setViewType={setViewType}
        slidersData={allSliders}
      />

      <SliderForm
        form={form}
        type={type}
        setType={setType}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        editingItemId={editingItemId}
        fetchSliders={fetchSliders}
        onCancelEdit={handleCancelForm}
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        allTags={allTags}
      />

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 260 }}>
          <Spin size="large" />
        </div>
      ) : (
        <SliderList
          key={itemsPerPage}
          sliders={displayedSliders}
          viewType={viewType}
          MEDIA_URL={MEDIA_URL}
          handleEditClick={handleEditClick}
          handleDeleteSlider={handleDeleteSlider}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
};

export default Sliders;
