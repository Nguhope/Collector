import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../services/api/authApi";
import { clientApi } from "../services/api/clientApi";
import { equipementsApi } from "../services/api/equipementsApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    [equipementsApi.reducerPath]: equipementsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      clientApi.middleware,
      equipementsApi.middleware
    ),
});

export default store;
