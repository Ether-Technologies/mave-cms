// components/cards/CardGridView.jsx

import React from "react";
import CardItem from "./CardItem";

const CardGridView = ({
  cards,
  media,
  pages,
  onRefresh,
  onDeleteCard,
  onPreviewCard,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
  );
};

export default CardGridView;
