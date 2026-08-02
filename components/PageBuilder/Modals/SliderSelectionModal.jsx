// components/PageBuilder/Modals/SliderSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  message,
  Carousel,
  Tabs,
  Input,
  Pagination,
  Button,
  Space,
  Tooltip,
  Typography,
  Select,
  Switch,
  Form,
} from "antd";
import instance from "../../../axios";
import Image from "next/image";
import {
  CheckCircleOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import SliderForm from "../../slider/SliderForm";

const { TabPane } = Tabs;
const { Text } = Typography;

const SliderSelectionModal = ({ isVisible, onClose, onSelectSlider }) => {
  const [sliderList, setSliderList] = useState([]);
  const [filteredSliders, setFilteredSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSliderId, setSelectedSliderId] = useState(null);
  const [activeTab, setActiveTab] = useState("image");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfig, setShowConfig] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [sliderConfig, setSliderConfig] = useState({
    autoplay: true,
    dots: true,
    effect: "scroll",
    speed: 500,
    height: 400,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form] = Form.useForm();
  const [formType, setFormType] = useState("image");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const pageSize = 6;

  useEffect(() => {
    if (isVisible) {
      fetchSliders();
      setSelectedSliderId(null);
      setSearchTerm("");
      setCurrentPage(1);
      setShowConfig(false);
      setIsFormVisible(false);
      setSelectedSlider(null);
    }
  }, [isVisible]);

  const handleOpenCreateForm = () => {
    form.resetFields();
    setSelectedMedia([]);
    setSelectedCards([]);
    setFormType(activeTab);
    setIsFormVisible(true);
  };

  const handleCancelForm = () => {
    setIsFormVisible(false);
    form.resetFields();
    setSelectedMedia([]);
    setSelectedCards([]);
    setFormType("image");
  };

  const handleSliderCreated = async (createdSlider) => {
    setIsFormVisible(false);
    const sliders = await fetchSliders();
    const sliderType = createdSlider.type || "image";
    setActiveTab(sliderType);
    filterAndSortSliders(sliders, sliderType, searchTerm, sortOrder);
    setSelectedSlider(createdSlider);
    setSliderConfig({
      autoplay: true,
      dots: true,
      effect: "scroll",
      speed: 500,
      height: 400,
    });
    setShowConfig(true);
    message.success("Slider created. Configure carousel settings and save.");
  };

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/sliders");
      const sliders = response.data || [];
      setSliderList(sliders);
      filterAndSortSliders(sliders, activeTab, searchTerm, sortOrder);
      return sliders;
    } catch (error) {
      message.error("Failed to fetch sliders");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSliders = (sliders, type, search, order) => {
    let filtered = sliders.filter((slider) => {
      const sliderType = slider.type || "image";
      return sliderType === type;
    });

    if (search) {
      filtered = filtered.filter((slider) =>
        (slider.title_en || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredSliders(filtered);
    setCurrentPage(1);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    filterAndSortSliders(sliderList, key, searchTerm, sortOrder);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAndSortSliders(sliderList, activeTab, value, sortOrder);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    filterAndSortSliders(sliderList, activeTab, searchTerm, order);
  };

  const handleSliderSelect = (item) => {
    if (item.type === "card" && (!item.cards || item.cards.length === 0)) {
      message.error("Selected card slider has no cards");
      return;
    }
    if (item.type === "image" && (!item.medias || item.medias.length === 0)) {
      message.error("Selected image slider has no images");
      return;
    }

    setSelectedSlider(item);
    setShowConfig(true);
  };

  const handleSaveConfig = () => {
    if (!selectedSlider) {
      message.error("No slider selected");
      return;
    }

    if (
      selectedSlider.type === "card" &&
      (!selectedSlider.cards || selectedSlider.cards.length === 0)
    ) {
      message.error("Selected card slider has no cards");
      return;
    }
    if (
      selectedSlider.type === "image" &&
      (!selectedSlider.medias || selectedSlider.medias.length === 0)
    ) {
      message.error("Selected image slider has no images");
      return;
    }

    onSelectSlider({
      ...selectedSlider,
      config: sliderConfig,
    });
    onClose();
    message.success("Slider selected successfully");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedSliders = filteredSliders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderSliderImages = (medias) => {
    return medias?.map((media) => (
      <div key={media.id} className="relative w-full">
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
          alt={media.title || "Slider Image"}
          width={800}
          height={800}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          objectFit="cover"
          className="rounded-lg"
          priority
        />
      </div>
    ));
  };

  const renderSliderCards = (cards) => {
    if (!cards || cards.length === 0) return null;

    return cards?.map((card) => (
      <div key={card.id} className="bg-white rounded-lg shadow-md">
        {card.media_files?.file_path && (
          <div className="relative w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.media_files.file_path}`}
              alt={card.title_en || "Card Image"}
              width={800}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
        )}
      </div>
    ));
  };

  return (
    <Drawer
      title={showConfig ? "Configure Slider" : "Select Slider"}
      placement="right"
      onClose={onClose}
      open={isVisible}
      width={showConfig ? 700 : 900}
      extra={
        showConfig ? (
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setShowConfig(false)}
            >
              Back
            </Button>
            <Button type="primary" onClick={handleSaveConfig}>
              Save
            </Button>
          </Space>
        ) : null
      }
    >
      {!showConfig ? (
        <>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            centered
            type="card"
          >
            <TabPane tab="Image Sliders" key="image" />
            <TabPane tab="Card Sliders" key="card" />
          </Tabs>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Tooltip title="Sort Ascending">
                <Button
                  icon={<SortAscendingOutlined />}
                  onClick={() => handleSortChange("asc")}
                  className={sortOrder === "asc" ? "mavebutton" : ""}
                />
              </Tooltip>
              <Tooltip title="Sort Descending">
                <Button
                  icon={<SortDescendingOutlined />}
                  onClick={() => handleSortChange("desc")}
                  className={sortOrder === "desc" ? "mavebutton" : ""}
                />
              </Tooltip>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search sliders..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={handleSearchChange}
                allowClear
                className="w-full md:w-64"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenCreateForm}
                className="mavebutton whitespace-nowrap"
              >
                Create Slider
              </Button>
            </div>
          </div>

          <List
            loading={loading}
            dataSource={paginatedSliders}
            renderItem={(item) => (
              <List.Item>
                <div
                  className="relative w-full cursor-pointer border rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleSliderSelect(item)}
                >
                  <div className="p-4 bg-white">
                    <Carousel
                      dots={false}
                      autoplay
                      className="rounded-lg overflow-hidden"
                      width={600}
                      height={600}
                    >
                      {activeTab === "image" ? (
                        item.medias && item.medias.length > 0 ? (
                          renderSliderImages(item.medias)
                        ) : (
                          <div className="flex items-center justify-center h-48 bg-gray-100">
                            <Text type="secondary">No images available</Text>
                          </div>
                        )
                      ) : item.cards && item.cards.length > 0 ? (
                        renderSliderCards(item.cards)
                      ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100">
                          <Text type="secondary">No cards available</Text>
                        </div>
                      )}
                    </Carousel>
                  </div>

                  <div className="p-4">
                    <Text strong className="text-lg">
                      {item.title_en || "Untitled Slider"}
                    </Text>
                  </div>

                  {selectedSlider?.id === item.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <CheckCircleOutlined
                        style={{ fontSize: "48px", color: "#fff" }}
                      />
                      <Text className="text-white text-xl font-bold ml-2">
                        Selected
                      </Text>
                    </div>
                  )}
                </div>
              </List.Item>
            )}
            grid={{ gutter: 16, column: 3 }}
            locale={{
              emptyText: (
                <div className="text-center py-8">
                  <Text type="secondary">No sliders found.</Text>
                  <div className="mt-4">
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleOpenCreateForm}
                      className="mavebutton"
                    >
                      Create New Slider
                    </Button>
                  </div>
                </div>
              ),
            }}
          />

          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredSliders.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div>
            <Text strong>Preview</Text>
            <div className="mt-2 border rounded-lg overflow-hidden">
              <Carousel
                autoplay={sliderConfig.autoplay}
                dots={sliderConfig.dots}
                effect={sliderConfig.effect}
                speed={sliderConfig.speed}
                className="rounded-lg"
              >
                {activeTab === "image" ? (
                  selectedSlider?.medias && selectedSlider.medias.length > 0 ? (
                    renderSliderImages(selectedSlider.medias)
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100">
                      <Text type="secondary">No images available</Text>
                    </div>
                  )
                ) : selectedSlider?.cards && selectedSlider.cards.length > 0 ? (
                  renderSliderCards(selectedSlider.cards)
                ) : (
                  <div className="flex items-center justify-center bg-gray-100">
                    <Text type="secondary">No cards available</Text>
                  </div>
                )}
              </Carousel>
            </div>
          </div>

          <div>
            <Text strong className="text-lg">
              Slider Settings
            </Text>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Text className="font-medium mb-0">Autoplay</Text>
                  <Text type="secondary" className="text-xs mb-0">
                    Automatically advance slides
                  </Text>
                </div>
                <Switch
                  checked={sliderConfig.autoplay}
                  onChange={(checked) =>
                    setSliderConfig({ ...sliderConfig, autoplay: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Text className="font-medium mb-0">Show Dots</Text>
                  <Text type="secondary" className="text-xs mb-0">
                    Display navigation dots
                  </Text>
                </div>
                <Switch
                  checked={sliderConfig.dots}
                  onChange={(checked) =>
                    setSliderConfig({ ...sliderConfig, dots: checked })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Text className="font-medium">Effect</Text>
                  <Select
                    value={sliderConfig.effect}
                    onChange={(value) =>
                      setSliderConfig({ ...sliderConfig, effect: value })
                    }
                    className="w-full"
                    size="small"
                  >
                    <Select.Option value="scroll">Scroll</Select.Option>
                    <Select.Option value="fade">Fade</Select.Option>
                    <Select.Option value="slide">Slide</Select.Option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Text className="font-medium">Speed</Text>
                  <Select
                    value={sliderConfig.speed}
                    onChange={(value) =>
                      setSliderConfig({ ...sliderConfig, speed: value })
                    }
                    className="w-full"
                    size="small"
                  >
                    <Select.Option value={300}>Fast</Select.Option>
                    <Select.Option value={500}>Medium</Select.Option>
                    <Select.Option value={800}>Slow</Select.Option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Text className="font-medium">Height</Text>
                  <Select
                    value={sliderConfig.height}
                    onChange={(value) =>
                      setSliderConfig({ ...sliderConfig, height: value })
                    }
                    className="w-full"
                    size="small"
                  >
                    <Select.Option value={300}>Small</Select.Option>
                    <Select.Option value={400}>Medium</Select.Option>
                    <Select.Option value={500}>Large</Select.Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <SliderForm
        form={form}
        type={formType}
        setType={setFormType}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        selectedCards={selectedCards}
        setSelectedCards={setSelectedCards}
        editingItemId={null}
        onCancelEdit={handleCancelForm}
        isFormVisible={isFormVisible}
        setIsFormVisible={setIsFormVisible}
        allTags={[]}
        onSliderCreated={handleSliderCreated}
      />
    </Drawer>
  );
};

export default SliderSelectionModal;
