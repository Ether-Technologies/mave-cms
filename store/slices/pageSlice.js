import { createSlice } from "@reduxjs/toolkit";

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
      state.pageData.body[sectionIndex] = newSection;
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

      // Remove from source
      state.pageData.body[fromSectionIndex].data.splice(fromIndex, 1);

      // Add to destination
      state.pageData.body[toSectionIndex].data.splice(toIndex, 0, component);
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
      state.pageData.body[sectionIndex].data.splice(
        componentIndex + 1,
        0,
        component
      );
      state.isDirty = true;
    },
  },
});

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
