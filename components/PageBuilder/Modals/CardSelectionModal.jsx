// components/PageBuilder/Modals/CardSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  Input,
  Select,
  message,
  Pagination,
  Typography,
  Button,
  Space,
  Tooltip,
  Switch,
} from "antd";
import instance from "../../../axios";
import Image from "next/image";
import {
  CheckCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const CardSelectionModal = ({
  isVisible,
  onClose,
  onSelectCard,
  initialCard,
}) => {
  const [cardList, setCardList] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [cardConfig, setCardConfig] = useState({
    showDescription: true,
    showImage: true,
    layout: "horizontal",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    if (isVisible) {
      fetchCards();
      setSelectedCard(null);
      setSearchQuery("");
      setCurrentPage(1);
      setShowConfig(false);
    }
  }, [isVisible]);

  useEffect(() => {
    filterAndSortCards();
  }, [cardList, sortOrder, searchQuery]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/cards");
      setCardList(response.data);
    } catch (error) {
      message.error("Failed to fetch cards");
    }
    setLoading(false);
  };

  const filterAndSortCards = () => {
    let data = [...cardList];

    if (searchQuery) {
      data = data.filter(
        (card) =>
          card?.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card?.title_bn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card?.description_en
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          card?.description_bn
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    data.sort((a, b) => {
      const titleA = a.title_en?.toLowerCase();
      const titleB = b.title_en?.toLowerCase();
      if (titleA < titleB) return sortOrder === "asc" ? -1 : 1;
      if (titleA > titleB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCards(data);
    setCurrentPage(1);
  };

  const handleCardSelect = (item) => {
    setSelectedCard(item);
    setShowConfig(true);
  };

  const handleSaveConfig = () => {
    if (!selectedCard) {
      message.error("No card selected");
      return;
    }

    onSelectCard({
      ...selectedCard,
      config: cardConfig,
    });
    onClose();
    message.success("Card selected successfully");
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedData = filteredCards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderCardMedia = (media) => {
    if (!media || !media.file_path) {
      return (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
          <Image
            src="/images/Image_Placeholder.png"
            alt="No Image"
            width={400}
            height={400}
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>
      );
    }
    return (
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
        alt={media.title_en || "Card Image"}
        width={400}
        height={400}
        objectFit="cover"
        className="rounded-lg"
        priority
      />
    );
  };

  return (
    <Drawer
      title={showConfig ? "Configure Card" : "Select Card"}
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
            <Input
              placeholder="Search cards..."
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={handleSearchChange}
              allowClear
              className="w-full md:w-64"
            />
          </div>

          <List
            loading={loading}
            dataSource={paginatedData}
            grid={{ gutter: 16, column: 3 }}
            renderItem={(item) => (
              <List.Item>
                <div
                  className="relative w-full cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleCardSelect(item)}
                >
                  <div className="p-4 bg-white">
                    {renderCardMedia(item.media_files)}
                    <div className="mt-4">
                      <Text strong className="text-lg">
                        {item.title_en || "Untitled Card"}
                      </Text>
                    </div>
                  </div>

                  {selectedCard?.id === item.id && (
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
            locale={{ emptyText: "No cards found" }}
          />

          <div className="flex justify-end mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredCards.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div>
            <Text strong>Preview</Text>
            <div className="mt-2 border rounded-lg overflow-hidden p-4 bg-gray-50">
              <div
                className={`flex ${cardConfig.layout === "horizontal" ? "flex-row" : "flex-col"} gap-4`}
              >
                {cardConfig.showImage && (
                  <div
                    className={
                      cardConfig.layout === "horizontal" ? "w-1/3" : "w-full"
                    }
                  >
                    {renderCardMedia(selectedCard?.media_files)}
                  </div>
                )}
                <div
                  className={
                    cardConfig.layout === "horizontal" ? "w-2/3" : "w-full"
                  }
                >
                  <Text strong className="text-xl">
                    {selectedCard?.title_en || "Untitled Card"}
                  </Text>
                  {cardConfig.showDescription && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedCard?.description_en?.length <= 200
                            ? selectedCard?.description_en
                            : selectedCard?.description_en?.slice(0, 200) +
                              "...",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Text strong className="text-lg">
              Card Settings
            </Text>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Text className="font-medium mb-0">Show Image</Text>
                  <Text type="secondary" className="text-xs mb-0">
                    Display card image
                  </Text>
                </div>
                <Switch
                  checked={cardConfig.showImage}
                  onChange={(checked) =>
                    setCardConfig({ ...cardConfig, showImage: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Text className="font-medium mb-0">Show Description</Text>
                  <Text type="secondary" className="text-xs mb-0">
                    Display card description
                  </Text>
                </div>
                <Switch
                  checked={cardConfig.showDescription}
                  onChange={(checked) =>
                    setCardConfig({ ...cardConfig, showDescription: checked })
                  }
                />
              </div>

              <div className="space-y-1">
                <Text className="font-medium">Layout</Text>
                <Select
                  value={cardConfig.layout}
                  onChange={(value) =>
                    setCardConfig({ ...cardConfig, layout: value })
                  }
                  className="w-full"
                  size="small"
                >
                  <Select.Option value="horizontal">Horizontal</Select.Option>
                  <Select.Option value="vertical">Vertical</Select.Option>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default CardSelectionModal;
