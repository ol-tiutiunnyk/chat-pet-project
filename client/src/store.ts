
import { configureStore } from "@reduxjs/toolkit";

import { messagesApi } from "./slices/messages.api";
import { authApi } from "@/slices/auth.api";
import { conversationsApi } from "@/slices/conversations.api";
import { usersApi } from "@/slices/users.api";

const store = configureStore({
  reducer: {
    [messagesApi.reducerPath]: messagesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [conversationsApi.reducerPath]: conversationsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      messagesApi.middleware,
      authApi.middleware,
      conversationsApi.middleware,
      usersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
