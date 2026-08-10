import SortableMenuItemsPicker from "../../Menus/SortableMenuItemsPicker";

export default function PermissionPicker({ permissions = [], value, onChange }) {
  return (
    <SortableMenuItemsPicker
      menuItems={permissions}
      value={value || []}
      onChange={onChange}
      availableLabel="Available Permissions"
      selectedLabel="Assigned Permissions"
      availableSearchPlaceholder="Search permissions..."
      emptyAvailableDescription="No permissions available"
      emptySelectedDescription="Add permissions from the left panel"
      selectedHint="Click to add, drag to reorder, or use checkboxes for bulk actions"
    />
  );
}
