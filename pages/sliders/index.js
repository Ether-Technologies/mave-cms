import React, { useEffect, useState } from "react";
import { message, Spin, Form } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import instance from "../../axios";
import SliderList from "../../components/slider/SliderList";
import SliderForm from "../../components/slider/SliderForm";
import SlidersHeader from "../../components/slider/SlidersHeader";
import { orderByIds } from "../../components/slider/SliderForm/orderByIds";
import { useGlobalRefresh } from "../../src/context/MenuRefreshContext";

const Sliders = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [allSliders, setAllSliders] = useState([]);
  const [displayedSliders, setDisplayedSliders] = useState([]);
  const [imageSliders, setImageSliders] = useState([]);
  const [cardSliders, setCardSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [form] = Form.useForm();
  const [type, setType] = useState("image");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("asc");

  // NEW: We’ll collect all unique tags here
  const [allTags, setAllTags] = useState([]);
  // NEW: The currently selected tag filter
  const [selectedTag, setSelectedTag] = useState("");

  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

  const CustomPrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-transparent border-none"
      aria-label="Previous Slide"
    >
      <LeftOutlined style={{ fontSize: "24px", color: "#000" }} />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-transparent border-none"
      aria-label="Next Slide"
    >
      <RightOutlined style={{ fontSize: "24px", color: "#000" }} />
    </button>
  );

  // Fetch all sliders once
  const fetchSliders = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/sliders");
      if (response.data && Array.isArray(response.data)) {
        setAllSliders(response.data);

        // NEW: Gather all unique tags from 'additional.tags' and from each slider's cards
        const tempTagSet = new Set();
        response.data.forEach((slider) => {
          // Slider-level tags
          if (Array.isArray(slider.additional?.tags)) {
            slider.additional.tags.forEach((tag) => tempTagSet.add(tag));
          }
          // Card-level tags
          if (Array.isArray(slider.cards)) {
            slider.cards.forEach((card) => {
              if (Array.isArray(card.additional?.tags)) {
                card.additional.tags.forEach((cTag) => tempTagSet.add(cTag));
              }
            });
          }
        });

        setAllTags([...tempTagSet]); // Convert to array
      } else {
        message.error("Failed to fetch sliders. Invalid data format.");
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      message.error("Failed to fetch sliders.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  useGlobalRefresh(fetchSliders);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Update displayedSliders based on searchTerm, sortType, and tag
  useEffect(() => {
    let filteredSliders = [...allSliders];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filteredSliders = filteredSliders.filter(
        (slider) =>
          (slider.title_en &&
            slider.title_en.toLowerCase().includes(lowerSearch)) ||
          (slider.title_bn &&
            slider.title_bn.toLowerCase().includes(lowerSearch))
      );
    }

    // Apply sorting
    if (sortType === "asc") {
      // Newest first
      filteredSliders.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else {
      // Oldest first
      filteredSliders.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    }

    // NEW: Filter by selected tag if any
    if (selectedTag) {
      filteredSliders = filteredSliders.filter((slider) => {
        let matchTag = false;

        // Check slider's own tags
        if (Array.isArray(slider.additional?.tags)) {
          if (slider.additional.tags.includes(selectedTag)) {
            matchTag = true;
          }
        }

        // If not found yet, check each card's tags
        if (!matchTag && Array.isArray(slider.cards)) {
          slider.cards.forEach((card) => {
            if (Array.isArray(card.additional?.tags)) {
              if (card.additional.tags.includes(selectedTag)) {
                matchTag = true;
              }
            }
          });
        }

        return matchTag;
      });
    }

    setDisplayedSliders(filteredSliders);
  }, [allSliders, searchTerm, sortType, selectedTag]);

  // Update imageSliders and cardSliders from displayedSliders
  useEffect(() => {
    const images = displayedSliders.filter(
      (slider) => !slider.type || slider.type.toLowerCase() === "image"
    );
    const cards = displayedSliders.filter(
      (slider) => slider.type && slider.type.toLowerCase() === "card"
    );
    setImageSliders(images);
    setCardSliders(cards);
  }, [displayedSliders]);

  // Handle add/edit/cancel
  const handleAddSlider = () => {
    setIsFormVisible(true);
    setEditingItemId(null);
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

  // In Sliders.jsx
  const handleEditClick = (id) => {
    setEditingItemId(id);
    setIsFormVisible(true);

    // Find the slider in local state
    const foundSlider = allSliders.find((s) => s.id === id);
    if (foundSlider) {
      // Populate the AntD form directly
      form.setFieldsValue({
        title_en: foundSlider.title_en,
        title_bn: foundSlider.title_bn,
        description_en: foundSlider.description_en,
        description_bn: foundSlider.description_bn,
        type: foundSlider.type,
        tags: foundSlider.additional?.tags || [],
      });

      // Update media/cards in local state
      setSelectedMedia(
        orderByIds(foundSlider.medias || [], foundSlider.media_ids || [])
      );
      setSelectedCards(foundSlider.card_ids || []);
      setType(foundSlider.type);
    }
  };

  const handleDeleteSlider = async (id) => {
    try {
      setLoading(true);
      await instance.delete(`/sliders/${id}`);
      message.success("Slider deleted successfully.");
      fetchSliders();
    } catch (error) {
      console.error("Error deleting slider:", error);
      message.error("Failed to delete slider.");
    }
    setLoading(false);
  };

  const handleSortTypeChange = (type) => {
    setSortType(type);
  };

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl p-4">
      {/* Header Section: add new props for tag filtering */}
      <SlidersHeader
        onAddSlider={handleAddSlider}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortType={sortType}
        setSortType={handleSortTypeChange}
        // NEW: Pass these down so we can filter by tags
        allTags={allTags}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        onRefresh={fetchSliders}
      />

      {/* Slider Form Modal */}
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

      {/* Slider List Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <SliderList
          imageSliders={imageSliders}
          cardSliders={cardSliders}
          CustomNextArrow={CustomNextArrow}
          CustomPrevArrow={CustomPrevArrow}
          MEDIA_URL={MEDIA_URL}
          handleEditClick={handleEditClick}
          handleDeleteSlider={handleDeleteSlider}
          itemsPerPage={6}
        />
      )}
    </div>
  );
};

export default Sliders;
