import { createSlice } from "@reduxjs/toolkit";
import { pushToHistory } from "./historySlice";

const getSectionsArray = (bodyData) => Object.values(bodyData || {});

const buildSectionsObject = (arr) =>
  arr.reduce((acc, s, i) => { acc[`section_${i + 1}`] = s; return acc; }, {});

const getComponentsArray = (components) => Object.values(components || {});

const buildComponentsObject = (arr) =>
  arr.reduce((acc, c, i) => {
    acc[`${c.type || "component"}_${i + 1}`] = c; return acc;
  }, {});

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
      // console.log("🔧 setPageData called with:", action.payload);
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
      if (!state.pageData?.body?.data) return;

      const sections = getSectionsArray(state.pageData.body.data);
      if (sectionIndex < 0 || sectionIndex >= sections.length) return;

      sections[sectionIndex] = newSection;
      state.pageData.body.data = buildSectionsObject(sections);
      state.isDirty = true;
    },
    moveComponent: (state, action) => {
      const { fromSectionIndex, toSectionIndex, fromIndex, toIndex } = action.payload;
      const sections = getSectionsArray(state.pageData.body.data);

      const fromComps = getComponentsArray(sections[fromSectionIndex]?.components);
      const toComps = fromSectionIndex === toSectionIndex
        ? fromComps
        : getComponentsArray(sections[toSectionIndex]?.components);

      const [component] = fromComps.splice(fromIndex, 1);
      toComps.splice(toIndex, 0, component);

      sections[fromSectionIndex] = {
        ...sections[fromSectionIndex],
        components: buildComponentsObject(fromComps),
      };
      if (fromSectionIndex !== toSectionIndex) {
        sections[toSectionIndex] = {
          ...sections[toSectionIndex],
          components: buildComponentsObject(toComps),
        };
      }

      state.pageData.body.data = buildSectionsObject(sections);
      state.isDirty = true;
    },
    duplicateComponent: (state, action) => {
      const { sectionIndex, componentIndex } = action.payload;
      const sections = getSectionsArray(state.pageData.body.data);
      const comps = getComponentsArray(sections[sectionIndex]?.components);

      const dup = { ...JSON.parse(JSON.stringify(comps[componentIndex])), _id: Date.now().toString() };
      comps.splice(componentIndex + 1, 0, dup);

      sections[sectionIndex] = {
        ...sections[sectionIndex],
        components: buildComponentsObject(comps),
      };
      state.pageData.body.data = buildSectionsObject(sections);
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
