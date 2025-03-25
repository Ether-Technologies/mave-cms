import { createSlice } from "@reduxjs/toolkit";
import { setPageData } from "./pageSlice";

const MAX_HISTORY_LENGTH = 50;

const initialState = {
  past: [],
  future: [],
  canUndo: false,
  canRedo: false,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    pushToHistory: (state, action) => {
      state.past.push(action.payload);
      state.future = [];

      // Limit history length
      if (state.past.length > MAX_HISTORY_LENGTH) {
        state.past.shift();
      }

      state.canUndo = state.past.length > 0;
      state.canRedo = state.future.length > 0;
    },
    undo: (state) => {
      if (state.past.length === 0) return;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, -1);

      state.future.unshift(previous);
      state.past = newPast;

      state.canUndo = newPast.length > 0;
      state.canRedo = true;
    },
    redo: (state) => {
      if (state.future.length === 0) return;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      state.past.push(next);
      state.future = newFuture;

      state.canUndo = true;
      state.canRedo = newFuture.length > 0;
    },
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
    },
  },
});

// Middleware to update page data when undo/redo occurs
export const historyMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === "history/undo") {
    const state = store.getState();
    if (state.history.past.length > 0) {
      const previous = state.history.past[state.history.past.length - 1];
      store.dispatch(setPageData(previous));
    }
  }

  if (action.type === "history/redo") {
    const state = store.getState();
    if (state.history.future.length > 0) {
      const next = state.history.future[0];
      store.dispatch(setPageData(next));
    }
  }

  return result;
};

export const { pushToHistory, undo, redo, clearHistory } = historySlice.actions;

// Selectors
export const selectCanUndo = (state) => state.history.past.length > 0;
export const selectCanRedo = (state) => state.history.future.length > 0;
export const selectPresent = (state) => state.history.present;

export default historySlice.reducer;
