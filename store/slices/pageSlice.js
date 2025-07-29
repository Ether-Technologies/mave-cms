import { createSlice } from "@reduxjs/toolkit";
import { pushToHistory } from "./historySlice";

const initialState = {
  pageData: null,
  loading: false,
  error: null,
  isDirty: false,
  lastSaved: null,
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPageData: (state, action) => {
      state.pageData = action.payload;
      state.isDirty = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setIsDirty: (state, action) => {
      state.isDirty = action.payload;
    },
    setLastSaved: (state, action) => {
      state.lastSaved = action.payload;
    },
    updateSection: (state, action) => {
      const { sectionIndex, newSection } = action.payload;

      // Validate that pageData and body exist
      if (!state.pageData || !state.pageData.body) {
        console.error("❌ Cannot update section: pageData or body is null");
        return;
      }

      // Validate that sectionIndex is within bounds
      if (sectionIndex < 0 || sectionIndex >= state.pageData.body.length) {
        console.error("❌ Section index out of bounds:", sectionIndex, "body length:", state.pageData.body.length);
        return;
      }

      // Create a new array instead of mutating the existing one
      state.pageData.body = [
        ...state.pageData.body.slice(0, sectionIndex),
        newSection,
        ...state.pageData.body.slice(sectionIndex + 1)
      ];
      state.isDirty = true;
    },
    moveComponent: (state, action) => {
      const { fromSectionIndex, toSectionIndex, fromIndex, toIndex } =
        action.payload;

      // Ensure data arrays exist
      if (!state.pageData.body[fromSectionIndex].data) {
        state.pageData.body[fromSectionIndex].data = [];
      }
      if (!state.pageData.body[toSectionIndex].data) {
        state.pageData.body[toSectionIndex].data = [];
      }

      const component = state.pageData.body[fromSectionIndex].data[fromIndex];

      // Remove from source - create new array
      state.pageData.body[fromSectionIndex].data = [
        ...state.pageData.body[fromSectionIndex].data.slice(0, fromIndex),
        ...state.pageData.body[fromSectionIndex].data.slice(fromIndex + 1)
      ];

      // Add to destination - create new array
      state.pageData.body[toSectionIndex].data = [
        ...state.pageData.body[toSectionIndex].data.slice(0, toIndex),
        component,
        ...state.pageData.body[toSectionIndex].data.slice(toIndex)
      ];
      state.isDirty = true;
    },
    duplicateComponent: (state, action) => {
      const { sectionIndex, componentIndex } = action.payload;

      // Ensure data array exists
      if (!state.pageData.body[sectionIndex].data) {
        state.pageData.body[sectionIndex].data = [];
      }

      const component = JSON.parse(
        JSON.stringify(state.pageData.body[sectionIndex].data[componentIndex])
      );
      component._id = Date.now().toString(); // Generate new ID for duplicate

      // Create new array instead of using splice
      state.pageData.body[sectionIndex].data = [
        ...state.pageData.body[sectionIndex].data.slice(0, componentIndex + 1),
        component,
        ...state.pageData.body[sectionIndex].data.slice(componentIndex + 1)
      ];
      state.isDirty = true;
    },
  },
});

// Middleware to update history when page data changes
export const pageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Push to history after any action that modifies page data
  if (
    action.type === "page/updateSection" ||
    action.type === "page/moveComponent" ||
    action.type === "page/duplicateComponent"
  ) {
    const state = store.getState();
    store.dispatch(pushToHistory(state.page.pageData));
  }

  return result;
};

export const {
  setPageData,
  setLoading,
  setError,
  setIsDirty,
  setLastSaved,
  updateSection,
  moveComponent,
  duplicateComponent,
} = pageSlice.actions;

export default pageSlice.reducer;
