import React from "react";
import { Carousel, Typography } from "antd";
import Image from "next/image";

const { Text } = Typography;

// Helper function to render slider images
export const renderSliderImages = (medias) => {
  if (!medias || medias.length === 0) return null;

  return medias.map((media) => (
    <div key={media.id} className="relative w-full">
      <Image
        src={
          media.file_path
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`
            : "/images/Image_Placeholder.png"
        }
        alt={media.title || "Slider Image"}
        width={900}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        objectFit="cover"
        className="rounded-lg"
        priority
      />
    </div>
  ));
};

// Helper function to render card slider
export const renderCardSlider = (cards) => {
  if (!cards || cards.length === 0) return null;

  return cards.map((card) => (
    <div key={card.id} className="p-4 bg-white rounded-lg shadow-md">
      {card.media_files?.file_path && (
        <div className="relative w-full">
          <Image
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.media_files.file_path}`}
            alt={card.title_en || "Card Image"}
            width={900}
            height={600}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            objectFit="cover"
            className="rounded-lg"
            priority
          />
        </div>
      )}
      <div className="mt-2">
        <Text strong className="text-lg">
          {card.title_en || "Untitled Card"}
        </Text>
      </div>
    </div>
  ));
};

// Main slider renderer component
const SliderRenderer = React.memo(({ sliderData, config = {} }) => {
  if (!sliderData) {
    return <p className="text-gray-500 text-center">No slider selected.</p>;
  }

  const defaultConfig = {
    autoplay: true,
    dots: false,
    effect: "scroll",
    speed: 500,
    height: 400,
  };

  const finalConfig = { ...defaultConfig, ...config };

  const renderCarousel = (children) => (
    <Carousel
      autoplay={finalConfig.autoplay}
      dots={finalConfig.dots}
      effect={finalConfig.effect}
      speed={finalConfig.speed}
      className="rounded-lg overflow-hidden"
    >
      {children}
    </Carousel>
  );

  if (sliderData.type === "image" && sliderData.medias?.length > 0) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-theme pb-4">
          {sliderData.title_en || "Slider Title"}
        </h2>
        {renderCarousel(renderSliderImages(sliderData.medias))}
      </div>
    );
  }

  if (sliderData.type === "card" && sliderData.cards?.length > 0) {
    return (
      <div className="w-full">
        <h2 className="text-xl font-bold text-theme pb-4">
          {sliderData.title_en || "Slider Title"}
        </h2>
        {renderCarousel(renderCardSlider(sliderData.cards))}
      </div>
    );
  }

  return (
    <p className="text-gray-500 text-center">No slider content available.</p>
  );
});

SliderRenderer.displayName = "SliderRenderer";

export default SliderRenderer;
