// components/slider/SliderList.jsx

import React, { useState } from "react";
import { Tabs, Pagination } from "antd";
import ImageSlider from "./ImageSlider";
import CardSlider from "./CardSlider";

const { TabPane } = Tabs;

const SliderList = ({
  imageSliders = [],
  cardSliders = [],
  CustomNextArrow,
  CustomPrevArrow,
  MEDIA_URL,
  handleEditClick,
  handleDeleteSlider,
  itemsPerPage = 6, // Default items per page
}) => {
  // Separate pagination states for each tab
  const [imageCurrentPage, setImageCurrentPage] = useState(1);
  const [cardCurrentPage, setCardCurrentPage] = useState(1);

  const [imageItemsPerPage, setImageItemsPerPage] = useState(itemsPerPage);
  const [cardItemsPerPage, setCardItemsPerPage] = useState(itemsPerPage);

  // Calculate paginated sliders for Image Sliders
  const paginatedImageSliders = imageSliders.slice(
    (imageCurrentPage - 1) * imageItemsPerPage,
    imageCurrentPage * imageItemsPerPage
  );

  // Calculate paginated sliders for Card Sliders
  const paginatedCardSliders = cardSliders.slice(
    (cardCurrentPage - 1) * cardItemsPerPage,
    cardCurrentPage * cardItemsPerPage
  );

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <Tabs defaultActiveKey="1" centered>
        {/* <TabPane tab={`Image Sliders (${imageSliders.length})`} key="1"> */}
        <TabPane tab={"Image Sliders"} key="1">
          {paginatedImageSliders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedImageSliders?.map((slider) => (
                  <ImageSlider
                    key={slider.id}
                    slider={slider}
                    CustomNextArrow={CustomNextArrow}
                    CustomPrevArrow={CustomPrevArrow}
                    MEDIA_URL={MEDIA_URL}
                    handleEditClick={handleEditClick}
                    handleDeleteSlider={handleDeleteSlider}
                  />
                ))}
              </div>
              {/* Pagination for Image Sliders */}
              <Pagination
                current={imageCurrentPage}
                pageSize={imageItemsPerPage}
                total={imageSliders.length}
                onChange={(page, pageSize) => {
                  setImageCurrentPage(page);
                  setImageItemsPerPage(pageSize);
                }}
                showSizeChanger
                onShowSizeChange={(current, size) => {
                  setImageItemsPerPage(size);
                  setImageCurrentPage(1);
                }}
                className="mt-4 flex justify-center"
                showQuickJumper
              />
            </>
          ) : (
            <div className="text-center py-8">
              <h2>No Image Sliders Found</h2>
            </div>
          )}
        </TabPane>
        {/* <TabPane tab={`Card Sliders (${cardSliders.length})`} key="2"> */}
        <TabPane tab={"Card Sliders"} key="2">
          {paginatedCardSliders.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedCardSliders?.map((slider) => (
                  <CardSlider
                    key={slider.id}
                    slider={slider}
                    CustomNextArrow={CustomNextArrow}
                    CustomPrevArrow={CustomPrevArrow}
                    MEDIA_URL={MEDIA_URL}
                    handleEditClick={handleEditClick}
                    handleDeleteSlider={handleDeleteSlider}
                  />
                ))}
              </div>
              {/* Pagination for Card Sliders */}
              <Pagination
                current={cardCurrentPage}
                pageSize={cardItemsPerPage}
                total={cardSliders.length}
                onChange={(page, pageSize) => {
                  setCardCurrentPage(page);
                  setCardItemsPerPage(pageSize);
                }}
                showSizeChanger
                onShowSizeChange={(current, size) => {
                  setCardItemsPerPage(size);
                  setCardCurrentPage(1);
                }}
                className="mt-4 flex justify-center"
                showQuickJumper
              />
            </>
          ) : (
            <div className="text-center py-8">
              <h2>No Card Sliders Found</h2>
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SliderList;
