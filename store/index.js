import { configureStore } from "@reduxjs/toolkit";
import pageReducer, { pageMiddleware } from "./slices/pageSlice";
import historyReducer, { historyMiddleware } from "./slices/historySlice";

const store = configureStore({
  reducer: {
    page: pageReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Date objects
    }).concat(pageMiddleware, historyMiddleware),
});

export default store;
