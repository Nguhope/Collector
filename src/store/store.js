import { collectorApi } from "../services/api/collectorApi";
import { authApi} from "../services/api/authApi"
import { configureStore } from "@reduxjs/toolkit";
import authReducer from  '../features/auth/authSlice';
import { apiSlice } from "../services/api/apiSlice";
import { usersApi } from "../services/api/usersApi";
import { rolesApi } from "../services/api/roleApi";
import { clientSitesApi } from "../services/api/clientSitesApi";
import { equipementsApi } from "../services/api/equipementsApi";

const store = configureStore({
       reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [collectorApi.reducerPath]: collectorApi.reducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
       [usersApi.reducerPath]: usersApi.reducer,
      [rolesApi.reducerPath]: rolesApi.reducer,
       [clientSitesApi.reducerPath]: clientSitesApi.reducer,
      [equipementsApi.reducerPath]: equipementsApi.reducer,


       },
       middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
                .concat(authApi.middleware)
                .concat(apiSlice.middleware)
                .concat(usersApi.middleware)
                .concat(rolesApi.middleware)
                .concat(clientSitesApi.middleware)
                .concat(equipementsApi.middleware),

})

export default store