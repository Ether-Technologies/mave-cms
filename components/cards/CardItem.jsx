// components/cards/CardItem.jsx
import React from "react";
import { Card, Button, Popconfirm, List, Tag } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Image from "next/image";

const tagColors = [
  "magenta",
  "purple",
  "orange",
  "lime",
  "red",
  "volcano",
  "gold",
  "green",
  "cyan",
  "yellow",
  "geekblue",
  "pink",
];

function getExcerpt(html = "", length = 30) {
  if (!html || html.trim() === "") return "Not Available";
  if (html.length <= length) return html;
  return html.slice(0, length) + "...";
}

// Helper to render media
function renderMedia(card) {
  if (!card?.media_files) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
        <Image
          alt="No Media"
          src="/images/Image_Placeholder.png"
          width={500}
          height={300}
          objectFit="cover"
        />
      </div>
    );
  }

  const mediaFile = card.media_files;
  const isVideo = mediaFile.file_type?.startsWith("video/");
  const mediaUrl = mediaFile.file_path
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaFile.file_path}`
    : null;

  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    setIsPlaying(true);
    const videoElement =
      e.currentTarget.parentElement.parentElement.querySelector("video");
    if (videoElement) {
      videoElement.play();
    }
  };

  const handleVideoClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    const videoElement = e.currentTarget;
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
      {isVideo ? (
        <>
          <video
            className="w-full h-full object-cover cursor-pointer"
            preload="metadata"
            muted={!isPlaying}
            playsInline
            onClick={handleVideoClick}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={`${mediaUrl}#t=0.1`} type={mediaFile.file_type} />
            <Image
              alt={card?.title_en || "No Title"}
              src="/images/Video_Placeholder.png"
              width={500}
              height={300}
              objectFit="cover"
            />
          </video>
          {!isPlaying && (
            <div
              className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center cursor-pointer"
              onClick={handlePlayClick}
            >
              <div className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-75 transition-all">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-xs">
                {mediaFile.file_type?.split("/")[0]?.toUpperCase() || "Video"}
              </div>
            </div>
          )}
        </>
      ) : (
        <Image
          alt={card?.title_en || "No Title"}
          src={mediaUrl || "/images/Image_Placeholder.png"}
          width={500}
          height={300}
          objectFit="cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/Image_Placeholder.png";
          }}
        />
      )}
    </div>
  );
}

// Helper to render tags
function renderTags(card) {
  const tags = card?.additional?.tags || [];
  return tags.map((tag, i) => (
    <Tag color={tagColors[i % tagColors.length]} key={tag}>
      {tag}
    </Tag>
  ));
}

const CardItem = ({ card, viewType, onDeleteCard, onPreviewCard }) => {
  const actions = [
    <Button
      key="preview"
      icon={<EyeOutlined />}
      onClick={() => onPreviewCard(card)}
      className="mavebutton"
    >
      Preview
    </Button>,
    <Popconfirm
      key="delete"
      title="Are you sure you want to delete this card?"
      onConfirm={() => onDeleteCard(card.id)}
      okText="Yes"
      cancelText="No"
    >
      <Button className="mavecancelbutton" icon={<DeleteOutlined />}>
        Delete
      </Button>
    </Popconfirm>,
  ];

  if (viewType === "grid") {
    return (
      <Card
        hoverable
        cover={renderMedia(card)}
        actions={actions}
        className="flex flex-col"
      >
        <Card.Meta
          className="pt-10"
          title={card?.title_en || "Title Unavailable"}
          description={
            <>
              {/* <div
                dangerouslySetInnerHTML={{
                  __html: getExcerpt(card?.description_en || "", 30),
                }}
              /> */}
              <div className="mt-4 min-h-[24px] flex flex-wrap gap-2">
                {renderTags(card)}
              </div>
            </>
          }
        />
      </Card>
    );
  }

  // LIST VIEW
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={
          <div className="flex items-center justify-center bg-gray-200">
            <Image
              alt={card?.title_en || "No Title"}
              src={
                card?.media_files?.file_path
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.media_files.file_path}`
                  : "/images/Image_Placeholder.png"
              }
              width={100}
              height={100}
              objectFit="cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/Image_Placeholder.png";
              }}
            />
          </div>
        }
        title={card?.title_en || "Title Unavailable"}
        description={
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: getExcerpt(card?.description_en || "", 100),
              }}
            />
            {card?.additional?.tags?.length > 0 && (
              <div className="mt-2 min-h-[24px] flex flex-wrap gap-2">
                {renderTags(card)}
              </div>
            )}
          </>
        }
      />
    </List.Item>
  );
};

export default CardItem;
