// components/cards/CardsList.jsx

import React from "react";
import CardItem from "./CardItem";
import { List } from "antd";

const CardsList = ({
  cards,
  viewType,
  media,
  pages,
  onRefresh,
  onDeleteCard,
  onPreviewCard,
}) => {
  return (
    <>
      {viewType === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: 16, marginTop: 4 }}>
          {cards?.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              media={media}
              pages={pages}
              viewType="grid"
              onDeleteCard={onDeleteCard}
              onPreviewCard={onPreviewCard}
            />
          ))}
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={cards}
          renderItem={(card) => (
            <CardItem
              key={card.id}
              card={card}
              media={media}
              pages={pages}
              viewType="list"
              onDeleteCard={onDeleteCard}
              onPreviewCard={onPreviewCard}
            />
          )}
        />
      )}
    </>
  );
};

export default CardsList;
