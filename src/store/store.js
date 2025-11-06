import { collectorApi } from "../services/api/collectorApi";
import { authApi} from "../services/api/authApi"
import { configureStore } from "@reduxjs/toolkit";
import authReducer from  '../features/auth/authSlice';

const store = configureStore({
       reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [collectorApi.reducerPath]: collectorApi.reducer,

       },
       middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(authApi.middleware, collectorApi.middleware)

})

export default store