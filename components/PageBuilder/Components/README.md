# ComponentListSimple - Modular Architecture

This directory contains the refactored `ComponentListSimple` component, broken down into smaller, more manageable pieces for better code organization and maintainability.

## File Structure

```
components/PageBuilder/Components/
├── ComponentListSimple.jsx          # Main component (orchestrator)
├── hooks/
│   ├── useComponentOperations.js    # Business logic for component operations
│   └── useDragAndDrop.js           # Drag and drop functionality
├── components/
│   ├── SectionActionButtons.jsx     # Section-level action buttons
│   ├── DraggableComponent.jsx      # Individual draggable component
│   └── ComponentList.jsx           # Component list container
└── README.md                       # This documentation
```

## Component Breakdown

### 1. ComponentListSimple.jsx (Main Component)

- **Purpose**: Main orchestrator component that coordinates all functionality
- **Responsibilities**:
  - State management for modal visibility and editing state
  - Integration of custom hooks and sub-components
  - Props distribution to child components

### 2. Hooks

#### useComponentOperations.js

- **Purpose**: Centralized business logic for component operations
- **Features**:
  - Add new components
  - Update existing components
  - Delete components
  - Duplicate components
  - Fallback to Redux store operations

#### useDragAndDrop.js

- **Purpose**: Handle drag and drop reordering functionality
- **Features**:
  - Drag end event handling
  - Component reordering logic
  - Integration with Redux store

### 3. Components

#### SectionActionButtons.jsx

- **Purpose**: Render section-level action buttons (duplicate/delete)
- **Features**:
  - Conditional rendering based on props
  - Consistent styling with mavebutton classes
  - Tooltip support

#### DraggableComponent.jsx

- **Purpose**: Individual draggable component wrapper
- **Features**:
  - Drag handle with visual indicators
  - Component rendering with proper props
  - Unique ID generation for drag operations

#### ComponentList.jsx

- **Purpose**: Container for the droppable area
- **Features**:
  - Droppable context setup
  - Component mapping and rendering
  - Placeholder for drag operations

## Benefits of This Architecture

1. **Separation of Concerns**: Each file has a single, well-defined responsibility
2. **Reusability**: Hooks and components can be reused in other parts of the application
3. **Testability**: Smaller, focused components are easier to test
4. **Maintainability**: Changes to specific functionality are isolated to specific files
5. **Readability**: Code is more organized and easier to understand

## Usage

```jsx
import ComponentListSimple from "./ComponentListSimple";

<ComponentListSimple
  components={sectionData}
  sectionIndex={0}
  onComponentsUpdate={handleComponentsUpdate}
  onComponentDelete={handleComponentDelete}
  onComponentDuplicate={handleComponentDuplicate}
  onEditingStateChange={handleEditingStateChange}
  onSectionDuplicate={handleSectionDuplicate}
  onSectionDelete={handleSectionDelete}
/>;
```

## Migration Notes

- The main component maintains the same API as before
- All existing functionality is preserved
- Performance improvements through better memoization
- Enhanced error handling and logging
- Better separation of UI and business logic

## Future Enhancements

- Add unit tests for each component and hook
- Implement performance optimizations (React.memo, useMemo)
- Add TypeScript support
- Create additional specialized hooks for specific use cases
