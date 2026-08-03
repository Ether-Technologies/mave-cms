// components/slider/SliderForm/CardSelector.jsx

import React, { useMemo } from "react";
import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import SortableMenuItemsPicker from "../../Menus/SortableMenuItemsPicker";

const CardSelector = ({
  selectedCards,
  setSelectedCards,
  cards,
  onCreateCard,
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
    <div>
      {onCreateCard && (
        <div className="flex justify-end mb-3">
          <Button
            icon={<PlusCircleOutlined />}
            onClick={onCreateCard}
            className="h-9 px-4 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg text-xs"
          >
            Create Card
          </Button>
        </div>
      )}
      <SortableMenuItemsPicker
        menuItems={pickerItems}
        value={selectedCards}
        onChange={setSelectedCards}
      />
    </div>
  );
};

export default CardSelector;
