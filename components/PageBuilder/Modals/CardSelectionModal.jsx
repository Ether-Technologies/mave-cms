// components/PageBuilder/Modals/CardSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  Modal,
  List,
  Input,
  Select,
  message,
  Pagination,
  Typography,
  Button,
} from "antd";
import instance from "../../../axios";
import Image from "next/image";
import {
  CheckCircleOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
const { Paragraph } = Typography;
const { Option } = Select;

const CardSelectionModal = ({ isVisible, onClose, onSelectCard }) => {
  const [cardList, setCardList] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of cards per page

  useEffect(() => {
    if (isVisible) {
      fetchCards();
    }
  }, [isVisible]);

  useEffect(() => {
    filterAndSortCards();
  }, [cardList, sortOrder, searchQuery]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/cards"); // Replace with your actual API endpoint
      // Ensure that the response data matches the expected card structure
      setCardList(response.data);
    } catch (error) {
      message.error("Failed to fetch cards");
    }
    setLoading(false);
  };

  const filterAndSortCards = () => {
    let data = [...cardList];

    // Search filter
    if (searchQuery) {
      data = data.filter((card) =>
        // card?.title_en
        //   ? card?.title_en?.toLowerCase().includes(searchQuery.toLowerCase())
        //   : card?.page_name?.toLowerCase().includes(searchQuery.toLowerCase())
        // if both title_en and page_name are not available, show no results
        card?.title_en ||
        card?.title_bn ||
        card?.page_name ||
        card?.description_en ||
        card?.description_bn
          ? card?.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card?.title_bn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card?.page_name
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            card?.description_en
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            card?.description_bn
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          : false
      );
    }

    // Sorting
    data.sort((a, b) => {
      const titleA = a.title_en?.toLowerCase();
      const titleB = b.title_en?.toLowerCase();
      if (titleA < titleB) return sortOrder === "asc" ? -1 : 1;
      if (titleA > titleB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCards(data);
    setCurrentPage(1); // Reset to first page on filter/sort
  };

  // Handle card selection
  const handleCardSelect = (item) => {
    setSelectedCardId(item.id);
    onSelectCard(item); // Pass the selected card back to the parent component
    onClose(); // Close the modal after selection
  };

  // Handle sorting change
  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get current page data
  const paginatedData = filteredCards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Helper function to render card media
  const renderCardMedia = (media) => {
    if (!media || !media.file_path) {
      return (
        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
          <Image
            src="/images/Image_Placeholder.png"
            alt="No Image"
            width={360}
            height={360}
            objectFit="cover"
            className="rounded-md"
            priority
          />
        </div>
      );
    }
    return (
      <Image
        src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
        alt={media.title_en || "Card Image"}
        width={260}
        height={260}
        objectFit="cover"
        className="rounded-md"
        priority
      />
    );
  };

  return (
    <Modal
      title="Select Card"
      open={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {/* Sorting and Search Controls */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button
            icon={<SortAscendingOutlined />}
            onClick={() => handleSortChange("asc")}
            className={`mr-2 ${sortOrder === "asc" ? "mavebutton" : ""}`}
          >
            Ascending
          </Button>
          <Button
            icon={<SortDescendingOutlined />}
            onClick={() => handleSortChange("desc")}
            className={`${sortOrder === "desc" ? "mavebutton" : ""}`}
          >
            Descending
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search by Title"
          value={searchQuery}
          onChange={handleSearchChange}
          allowClear
          style={{ width: 300 }}
        />
      </div>

      {/* Card List */}
      <List
        loading={loading}
        dataSource={paginatedData}
        locale={{ emptyText: "No cards found" }}
        renderItem={(item) => (
          <List.Item>
            <div
              className="relative w-full cursor-pointer border rounded-md overflow-hidden flex items-center p-4 bg-white gap-10"
              onClick={() => handleCardSelect(item)}
            >
              {/* Media on the Left */}
              <div className="mr-4">{renderCardMedia(item.media_files)}</div>

              {/* Content on the Right */}
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">
                  {item.title_en || "Card Title"}
                </h2>
                <Paragraph className="text-sm text-gray-600">
                  {item.description_en ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: item.description_en.slice(0, 200) + "...",
                      }}
                    />
                  ) : (
                    "No description."
                  )}
                </Paragraph>
              </div>

              {/* Selected Overlay */}
              {selectedCardId === item.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <CheckCircleOutlined
                    style={{ fontSize: "48px", color: "#fff" }}
                  />
                  <span className="text-white text-xl font-bold ml-2">
                    Selected
                  </span>
                </div>
              )}
            </div>
          </List.Item>
        )}
        // Remove grid to have a vertical list with one card per row
        grid={false}
      />

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredCards.length}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </Modal>
  );
};

export default CardSelectionModal;
