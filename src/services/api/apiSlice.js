import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";



const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiSlice = createApi({
      reducerPath: "api",
      baseQuery: fetchBaseQuery({
         baseUrl,
         prepareHeaders: (headers, {getState}) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);

            } 
            return headers;
         },
      }),
      tagTypes: ["User", "Role", "ClientSite","Equipment","Permissions", "Client"],
      endpoints: () => ({}),
});