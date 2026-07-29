import React from "react";
import {
  Carousel,
  Button,
  Popconfirm,
  Space,
  Typography,
  Card,
  Tag,
  Badge,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import Image from "next/image";
import { capitalize } from "lodash";

const { Title } = Typography;

const idBadgeStyle = {
  backgroundColor: "#f0f0f0",
  color: "#666",
  fontSize: "12px",
  fontWeight: "500",
};

const CardSlider = ({
  slider,
  CustomNextArrow,
  CustomPrevArrow,
  MEDIA_URL,
  handleEditClick,
  handleDeleteSlider,
}) => {
  const cardPlaceholder = "/images/Image_Placeholder.png";

  const actions = [
    <Button
      key="edit"
      icon={<EditOutlined />}
      onClick={() => handleEditClick(slider.id)}
      className="mavebutton"
    >
      Edit
    </Button>,
    <Popconfirm
      key="delete"
      title="Are you sure you want to delete this slider?"
      onConfirm={() => handleDeleteSlider(slider.id)}
      okText="Yes"
      cancelText="No"
      okButtonProps={{ danger: true }}
    >
      <Button className="mavecancelbutton" icon={<DeleteOutlined />}>
        Delete
      </Button>
    </Popconfirm>,
  ];

  const hasCards = Array.isArray(slider.cards) && slider.cards.length > 0;

  return (
    <Card
      hoverable
      cover={
        hasCards ? (
          <Carousel autoplay className="mb-4">
            {slider.cards.map((card) => (
              <div key={card.id}>
                <div
                  className="flex flex-col items-center justify-center bg-gray-200 pt-6"
                  style={{ height: "250px" }}
                >
                  <Title level={5}>
                    {card.title_en || "Title Unavailable"}
                  </Title>
                  <Image
                    src={
                      card.media_files && card.media_files.file_path
                        ? `${MEDIA_URL}/${card.media_files.file_path}`
                        : cardPlaceholder
                    }
                    alt={card.title_en || "Card Unavailable"}
                    width={400}
                    height={200}
                    objectFit="cover"
                    className="rounded-md"
                  />

                  {/* NEW: Show each card’s own tags (if any) */}
                  {/* {Array.isArray(card.additional?.tags) &&
                    card.additional.tags.length > 0 && (
                      <div className="mt-2 text-center">
                        {card.additional.tags.map((t) => (
                          <Tag key={t} color="green" className="mx-1">
                            {t}
                          </Tag>
                        ))}
                      </div>
                    )} */}
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-200">
            <Image
              src={cardPlaceholder}
              alt="Placeholder Card"
              width={400}
              height={200}
              objectFit="contain"
              className="rounded-md"
            />
          </div>
        )
      }
      actions={actions}
      className="slider-card shadow-md rounded-md"
    >
      <div className="min-h-16">
        <Space
          className="media-card-meta flex flex-col sm:flex-row justify-between items-start sm:items-center"
          direction="vertical"
        >
          <div className="flex items-center gap-2 flex-wrap max-w-xs">
            <Badge count={`ID-${slider.id}`} style={idBadgeStyle} />
            <h3 className="text-lg font-semibold truncate m-0">
              {slider.title_en || "Title Unavailable"}
            </h3>
          </div>
          <h5 className="text-md text-gray-400 font-bold">
            {capitalize(slider.type) || "Type Unavailable"}
          </h5>
        </Space>
        {Array.isArray(slider.additional?.tags) &&
          slider.additional.tags.length > 0 && (
            <div className="mt-3">
              {slider.additional.tags.slice(0, 6).map((tagItem) => (
                <Tag key={tagItem} color="yellow" className="mb-1">
                  {tagItem}
                </Tag>
              ))}
              {slider.additional.tags.length > 6 && (
                <Tag key="more" color="green" className="mb-1">
                  ...
                </Tag>
              )}
            </div>
          )}
      </div>
    </Card>
  );
};

export default CardSlider;
