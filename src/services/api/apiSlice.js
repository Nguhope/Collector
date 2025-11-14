import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { baseQueryWithReauth } from "./customBaseQuery";


const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const apiSlice = createApi({
      reducerPath: "api",
      baseQuery: baseQueryWithReauth,
      tagTypes: ["User", "Role", "ClientSite","Equipment","Permissions", "Client"],
      endpoints: () => ({}),
});