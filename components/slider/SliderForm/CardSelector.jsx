// components/slider/SliderForm/CardSelector.jsx

import React from "react";
import { Select, Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Option } = Select;

const CardSelector = ({
  selectedCards,
  setSelectedCards,
  cards,
  cardPlaceholder,
}) => (
  <div>
    <Select
      showSearch
      mode="multiple"
      placeholder="Select cards"
      value={selectedCards}
      onChange={setSelectedCards}
      className="w-full"
      optionFilterProp="children"
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
    >
      {cards.length > 0 ? (
        cards?.map((card) => (
          <Option key={card.id} value={card.id}>
            {card.title_en || "Title Unavailable"}
          </Option>
        ))
      ) : (
        <Option disabled>No cards available</Option>
      )}
    </Select>
    {selectedCards.length > 0 && (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {selectedCards?.map((cardId) => {
          const card = cards.find((c) => c.id === cardId);
          return (
            <div key={cardId} className="relative">
              <Image
                src={
                  card?.media_files?.file_path
                    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.media_files.file_path}`
                    : cardPlaceholder
                }
                alt={card?.title_en || "Card Unavailable"}
                width={100}
                height={100}
                className="rounded-md object-cover"
                fallback={cardPlaceholder}
              />
              <Button
                type="text"
                icon={<CloseCircleOutlined className="text-gray-800" />}
                onClick={() =>
                  setSelectedCards(selectedCards.filter((id) => id !== cardId))
                }
                className="absolute top-0 right-0"
              />
              <div className="mt-1 text-center text-sm">
                {card?.title_en || "Title Unavailable"}
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

export default CardSelector;
