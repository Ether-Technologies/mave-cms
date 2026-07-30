// components/slider/SliderForm/CardSelector.jsx

import React, { useMemo } from "react";
import SortableMenuItemsPicker from "../../Menus/SortableMenuItemsPicker";

const CardSelector = ({
  selectedCards,
  setSelectedCards,
  cards,
}) => {
  const pickerItems = useMemo(
    () =>
      cards.map((card) => ({
        id: card.id,
        title: card.title_en || "Title Unavailable",
        title_bn: card.title_bn,
      })),
    [cards]
  );

  return (
    <SortableMenuItemsPicker
      menuItems={pickerItems}
      value={selectedCards}
      onChange={setSelectedCards}
    />
  );
};

export default CardSelector;
