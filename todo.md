# Page Builder Widgets - Multi-Language Support Analysis

## Overview

This document tracks the implementation status of multi-language support for Page Builder widgets. Multi-language support allows content editors to add alternative content in different languages (primarily Bengali alongside English).

## ✅ Widgets WITH Multi-Language Support (12 Total)

### 1. **TextComponent** ✅

- **File**: `components/PageBuilder/Components/TextComponent.jsx`
- **Has**: `altText` field for alternative text content
- **Features**: Dual color support with alternative text

### 2. **TitleDescriptionComponent** ✅

- **File**: `components/PageBuilder/Components/TitleDescriptionComponent.jsx`
- **Has**: `altTitle` and `altDescription` fields
- **Features**: Full multi-language support with alternative title and description

### 3. **ParagraphComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/ParagraphComponent.jsx`
- **Has**: `altContent` field with `showAltContent` toggle
- **Features**: Alternative paragraph content with collapsible configuration panel
- **Implementation**: Added multi-language support with RichTextEditor for both main and alternative content

### 4. **ButtonComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/ButtonComponent.jsx`
- **Has**: `altText` field with `showAltText` toggle in ButtonSelectionModal
- **Features**: Alternative button text with form validation
- **Implementation**: Updated ButtonSelectionModal to include multi-language configuration

### 5. **CardComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/CardComponent.jsx`
- **Has**: `showAltContent` toggle to display Bengali content (`title_bn`, `description_bn`)
- **Features**: Toggle between English and Bengali card content with visual distinction
- **Implementation**: Added helper functions and configuration panel for language switching

### 6. **MenuComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/MenuComponent.jsx`
- **Has**: `showAltTitles` toggle to display Bengali menu item titles (`title_bn`)
- **Features**: Alternative menu item labels with configuration in drawer
- **Implementation**: Added language switching for menu items with preview support

### 7. **NavbarComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/NavbarComponent.jsx`
- **Has**: `altTitle` field for alternative navbar title
- **Features**: Alternative navbar title with configuration panel
- **Implementation**: Added language switching for navbar titles with preview support

### 8. **GoogleMapComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/GoogleMapComponent.jsx`
- **Has**: `altTitle` field for alternative map title
- **Features**: Alternative map title with configuration panel
- **Implementation**: Added multi-language support for map titles

### 9. **GalleryComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/GalleryComponent.jsx`
- **Has**: `altTitle` field for alternative gallery title
- **Features**: Alternative gallery title with configuration panel
- **Implementation**: Added multi-language support for gallery titles

### 10. **FooterComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/FooterComponent.jsx`
- **Has**: `altTitle` field for alternative footer title
- **Features**: Alternative footer title with configuration panel
- **Implementation**: Added multi-language support for footer titles

### 11. **AccordionComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/AccordionComponent.jsx`
- **Has**: `showAltContent` toggle to display alternative titles and content (`altTitle`, `altContent`)
- **Features**: Alternative accordion item titles and content with toggle switch
- **Implementation**: Added language switching for accordion items with preview support

## ✅ Widgets WITH Multi-Language Support (12 Total)

### 12. **MediaComponent** ✅ **[NEWLY IMPLEMENTED]**

- **File**: `components/PageBuilder/Components/MediaComponent.jsx`
- **Has**: `showAltContent` toggle to display alternative titles and descriptions (`altTitle`, `altDescription`)
- **Features**: Alternative media titles and descriptions with configuration panel
- **Implementation**: Added multi-language support for media items with toggle switch and preview support

## ❌ Widgets Missing Multi-Language Support (6 Remaining)

### 1. **VideoComponent**

- **File**: `components/PageBuilder/Components/VideoComponent.jsx`
- **Missing**: Alternative title and description fields for video content
- **Current Fields**: Only video URL and basic configuration
- **Impact**: Cannot add video titles or descriptions in other languages

### 2. **FormComponent**

- **File**: `components/PageBuilder/Components/FormComponent.jsx`
- **Missing**: Alternative title and description fields for form elements
- **Current Fields**: Only basic form configuration
- **Impact**: Cannot add form labels and descriptions in other languages

### 3. **IconListComponent**

- **File**: `components/PageBuilder/Components/IconListComponent/IconListComponent.jsx`
- **Missing**: Alternative text fields for icon list items
- **Current Fields**: Only `text` field for icon items
- **Impact**: Cannot add icon item descriptions in other languages

### 4. **InfoBoxComponent**

- **File**: `components/PageBuilder/Components/InfoBoxComponent/InfoBoxComponent.jsx`
- **Missing**: Alternative title and description fields for info box content and items
- **Current Fields**: Only `title` and `description` for main content and info items
- **Impact**: Cannot add info box content in other languages

### 5. **SliderComponent**

- **File**: `components/PageBuilder/Components/SliderComponent/SliderComponent.jsx`
- **Missing**: Alternative title and description fields for slider content
- **Current Fields**: Only basic slider configuration and media
- **Impact**: Cannot add slider content descriptions in other languages

### 6. **TestimonialComponent**

- **File**: `components/PageBuilder/Components/TestimonialComponent/TestimonialComponent.jsx`
- **Missing**: Alternative quote and author fields for testimonials
- **Current Fields**: Only `quote` and `author` fields
- **Impact**: Cannot add testimonial content in other languages

## Summary

- **Total Widgets Analyzed**: 19
- **Widgets WITH Multi-Language Support**: 12 ✅ (63% Complete)
- **Widgets Missing Multi-Language Support**: 7 ❌ (37% Remaining)

## ✅ Implementation Progress

### **Phase 1 - COMPLETED** (High & Medium Priority)

- ✅ **ParagraphComponent** - Alternative content with RichTextEditor
- ✅ **ButtonComponent** - Alternative text in ButtonSelectionModal
- ✅ **CardComponent** - Bengali content toggle (`title_bn`, `description_bn`)
- ✅ **MenuComponent** - Bengali menu item titles (`title_bn`)
- ✅ **NavbarComponent** - Bengali navbar menu titles (`title_bn`)
- ✅ **MediaComponent** - Alternative titles and descriptions (`altTitle`, `altDescription`)

### **Phase 2 - REMAINING** (Lower Priority)

- ❌ **TableComponent** - Alternative table content
- ❌ **VideoComponent** - Alternative video descriptions
- ❌ **FormComponent** - Alternative form labels
- ❌ **IconListComponent** - Alternative icon descriptions
- ❌ **InfoBoxComponent** - Alternative info box content
- ❌ **SliderComponent** - Alternative slider content
- ❌ **TestimonialComponent** - Alternative testimonial content

## 🎯 Implementation Strategy

### **Consistent Pattern Applied:**

- **Toggle Switch**: Each component has a switch to enable/disable alternative language display
- **Collapsible Sections**: Multi-language settings organized in dedicated sections
- **Global Icon**: `GlobalOutlined` icon for visual consistency
- **Field Naming**: Consistent naming (`altContent`, `altText`, `showAltContent`, `showAltTitles`)
- **Data Storage**: Alternative content stored in `_mave` object
- **Preview Support**: All components support multi-language display in preview mode
- **Mobile Responsive**: All implementations follow mobile-responsive design principles

### **Next Steps for Remaining Components:**

1. **TableComponent** - Add alternative table headers and cell content
2. **VideoComponent** - Add alternative video titles and descriptions
3. **FormComponent** - Add alternative form labels and descriptions
4. **IconListComponent** - Add alternative icon descriptions
5. **InfoBoxComponent** - Add alternative info box content
6. **SliderComponent** - Add alternative slider content
7. **TestimonialComponent** - Add alternative testimonial content

## 📊 Impact Assessment

**High Impact Completed:**

- Content-heavy widgets (Paragraph, Card, Button) now support multi-language
- Navigation components (Menu, Navbar) now support multi-language
- Media components (MediaComponent) now support multi-language
- All implementations maintain backward compatibility
- Consistent user experience across all implemented components

**Remaining Impact:**

- Specialized components (Table, Video, Form) still need multi-language support
- Form components need localization for better accessibility
- Complex components (Accordion, Table) need structured multi-language approach
