// components/slider/SliderForm/orderByIds.js

export const orderByIds = (items = [], ids = []) => {
  if (!ids?.length || !items?.length) return items || [];

  const itemMap = Object.fromEntries(items.map((item) => [item.id, item]));
  const ordered = ids.map((id) => itemMap[id]).filter(Boolean);

  items.forEach((item) => {
    if (!ids.includes(item.id)) {
      ordered.push(item);
    }
  });

  return ordered;
};
