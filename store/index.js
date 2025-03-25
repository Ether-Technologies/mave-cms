import { configureStore } from "@reduxjs/toolkit";
import pageReducer from "./slices/pageSlice";
import historyReducer from "./slices/historySlice";

const store = configureStore({
  reducer: {
    page: pageReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for Date objects
    }),
});

export default store;
