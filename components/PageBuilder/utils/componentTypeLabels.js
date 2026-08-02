import { componentOptions } from "../Modals/ComponentSelector/constants";

const TYPE_LABELS = Object.fromEntries(
  componentOptions.map((c) => [c.type, c.name])
);

export const getComponentTypeLabel = (type) => {
  if (!type) return "Component";
  const key = typeof type === "object" ? type.type : type;
  if (TYPE_LABELS[key]) return TYPE_LABELS[key];
  return key.charAt(0).toUpperCase() + key.slice(1);
};
