import { authApi} from "../services/api/authApi"
import { configureStore } from "@reduxjs/toolkit";
import authReducer from  '../features/auth/authSlice';
import { apiSlice } from "../services/api/apiSlice";

const store = configureStore({
       reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        
        [apiSlice.reducerPath]: apiSlice.reducer,
    

       },
       middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware()
                .concat(authApi.middleware)
                .concat(apiSlice.middleware)
               

})

export default store