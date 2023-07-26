import { configureStore } from "@reduxjs/toolkit";
// Article Api
import { articleApi } from "./article";

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articleApi.middleware)
});
