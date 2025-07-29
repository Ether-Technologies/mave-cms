# Dependencies

This document lists all the key dependencies used in the Mave CMS project.

## Core Dependencies

| **Package**   | **Version** | **Description**                                                         |
| ------------- | ----------- | ----------------------------------------------------------------------- |
| **react**     | 18.2.0      | Core React library for building user interfaces.                        |
| **react-dom** | 18.2.0      | React DOM library for rendering React components in the browser.        |
| **next**      | ^12.3.4     | Next.js framework for server-side rendering and static site generation. |
| **antd**      | ^5.19.0     | Ant Design UI component library.                                        |

## Drag and Drop Libraries

| **Package**                 | **Version** | **Description**                                          |
| --------------------------- | ----------- | -------------------------------------------------------- |
| **@dnd-kit/core**           | ^6.1.0      | Core drag and drop functionality for React applications. |
| **@dnd-kit/sortable**       | ^8.0.0      | Sortable drag and drop functionality for React.          |
| **@dnd-kit/modifiers**      | ^7.0.0      | Modifiers for drag and drop behavior customization.      |
| **@dnd-kit/utilities**      | ^3.2.2      | Utility functions for @dnd-kit.                          |
| **react-dnd**               | ^16.0.1     | Drag and drop library for React.                         |
| **react-dnd-html5-backend** | ^16.0.1     | HTML5 backend for React DnD.                             |

## UI and Styling

| **Package**           | **Version** | **Description**                                       |
| --------------------- | ----------- | ----------------------------------------------------- |
| **@ant-design/icons** | ^5.2.6      | Icon library for Ant Design components.               |
| **framer-motion**     | ^12.12.2    | Animation library for React applications.             |
| **tailwindcss**       | ^3.4.14     | Utility-first CSS framework for rapid UI development. |

## Data Management and State

| **Package**          | **Version** | **Description**                      |
| -------------------- | ----------- | ------------------------------------ |
| **@reduxjs/toolkit** | ^2.6.1      | Redux Toolkit for state management.  |
| **swr**              | ^2.2.5      | React Hooks for data fetching.       |
| **axios**            | ^1.6.7      | HTTP client for making API requests. |

## Rich Text and Content Editing

| **Package**                 | **Version** | **Description**                            |
| --------------------------- | ----------- | ------------------------------------------ |
| **@tiptap/react**           | ^2.10.3     | React wrapper for TipTap rich text editor. |
| **@tiptap/starter-kit**     | ^2.10.3     | Starter kit for TipTap editor.             |
| **@tiptap/extension-table** | ^2.10.3     | Table extension for TipTap.                |
| **react-froala-wysiwyg**    | ^4.2.0      | React wrapper for Froala WYSIWYG editor.   |
| **react-quill**             | ^2.0.0      | React wrapper for the Quill editor.        |
| **react-markdown**          | ^9.0.1      | Markdown rendering in React applications.  |

## Media and File Handling

| **Package**                     | **Version** | **Description**                           |
| ------------------------------- | ----------- | ----------------------------------------- |
| **cloudinary**                  | ^2.5.1      | Cloudinary SDK for image management.      |
| **@cloudinary/url-gen**         | ^1.21.0     | Cloudinary URL generation library.        |
| **react-easy-crop**             | ^5.0.5      | React component for cropping media files. |
| **react-pdf**                   | ^7.7.1      | Display PDFs in React applications.       |
| **@react-pdf-viewer/core**      | ^3.12.0     | PDF viewer component for React.           |
| **@react-pdf-viewer/thumbnail** | ^3.12.0     | Thumbnail component for PDF viewer.       |

## Charts and Data Visualization

| **Package**             | **Version** | **Description**                        |
| ----------------------- | ----------- | -------------------------------------- |
| **apexcharts**          | ^3.53.0     | Modern charting library for React.     |
| **react-apexcharts**    | ^1.4.1      | React wrapper for ApexCharts library.  |
| **react-google-charts** | ^4.0.1      | Google Charts wrapper for React.       |
| **recharts**            | ^2.12.7     | Composable charting library for React. |

## AI and Machine Learning

| **Package**               | **Version** | **Description**                           |
| ------------------------- | ----------- | ----------------------------------------- |
| **openai**                | ^4.70.2     | OpenAI API client for AI features.        |
| **@google/generative-ai** | ^0.8.0      | Google Generative AI SDK for AI features. |

## Utilities and Helpers

| **Package**   | **Version** | **Description**                               |
| ------------- | ----------- | --------------------------------------------- |
| **dayjs**     | ^1.11.13    | Modern date utility library.                  |
| **lodash**    | ^4.17.21    | JavaScript utility library.                   |
| **uuid**      | ^10.0.0     | Generate RFC-compliant UUIDs.                 |
| **js-yaml**   | ^4.1.0      | YAML parser and emitter for JavaScript.       |
| **ajv**       | ^8.17.1     | JSON Schema validator.                        |
| **papaparse** | ^5.4.1      | CSV parser for handling tabular data.         |
| **pluralize** | ^8.0.0      | Pluralization utility for naming conventions. |

## Development and Build Tools

| **Package**                | **Version** | **Description**                                                 |
| -------------------------- | ----------- | --------------------------------------------------------------- |
| **next-transpile-modules** | ^10.0.1     | Allows transpiling of third-party modules in a Next.js project. |
| **eslint**                 | 8.49.0      | JavaScript linting utility.                                     |
| **eslint-config-next**     | 13.4.19     | ESLint configuration for Next.js.                               |
| **autoprefixer**           | ^10.4.20    | PostCSS plugin to parse CSS and add vendor prefixes.            |
| **postcss**                | ^8.4.47     | Tool for transforming CSS with JavaScript.                      |

## Legacy Dependencies (Removed)

| **Package**             | **Version** | **Description**                                      |
| ----------------------- | ----------- | ---------------------------------------------------- |
| **react-beautiful-dnd** | ^13.1.1     | Legacy drag and drop library (replaced by @dnd-kit). |

## Migration Notes

### Recent Changes

1. **Migrated from react-beautiful-dnd to @dnd-kit**:

   - Replaced `react-beautiful-dnd` with `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, and `@dnd-kit/utilities`
   - Better performance and modern React support
   - Improved accessibility features
   - More flexible and customizable drag and drop behavior

2. **Updated Components**:

   - `ComponentList.jsx` - Updated to use `@dnd-kit/sortable`
   - `DraggableComponent.jsx` - Updated to use `useSortable` hook
   - `Section.jsx` - Updated to use `@dnd-kit/sortable`
   - `SectionList.jsx` - Updated to use `@dnd-kit/sortable`
   - `HeadersSection.jsx` - Updated to use `@dnd-kit/sortable`
   - `Component.jsx` - Updated to use `@dnd-kit/sortable`

3. **Updated Hooks**:
   - `useDragAndDrop.js` - Updated to work with `@dnd-kit` event structure
   - `useSectionDragAndDrop.js` - Updated to work with `@dnd-kit` event structure

### Benefits of @dnd-kit Migration

- **Better Performance**: More efficient rendering and event handling
- **Modern React Support**: Full support for React 18+ features
- **Accessibility**: Built-in accessibility features and ARIA support
- **Flexibility**: More customizable drag and drop behavior
- **TypeScript Support**: Better TypeScript support and type safety
- **Active Maintenance**: Actively maintained and updated
