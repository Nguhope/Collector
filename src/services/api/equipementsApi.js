import { apiSlice } from "./apiSlice";
import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query";



const baseUrl = import.meta.env.VITE_API_BASE_URL 

export const equipementsApi = createApi({
  reducerPath: "equipementsApi",
 baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, {getState})  =>  {
        const token = getState().auth.token;
        if(token) headers.set("Authorization", `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    }
    }),
  endpoints: (builder) => ({
        listEquipements: builder.query({
            query: () => "/equipements/all",
            providesTags: ["Equipment"],
        }),
        // equipements d'un site particulier
        getSiteEquipements: builder.query({
            query: (siteId) => `/client_site/${siteId}/all_equipements`,
            providesTags: ["Equipment"],
        }),
       
        registerEquipement: builder.mutation({ 
            query: (equipement) => ({
                    url: "/equipements/register",
                    method: "POST",
                    body: equipement,
            }),
            invalidatesTags: ["Equipment"],
        }),
        // lid de lequipent obligatoire equipement_id
        updateEquipement: builder.mutation({
            query: (equipement) => ({
                url: "/equipements/update",
                method: "PUT",
                body: equipement,
            }),
            invalidatesTags: ["Equipment"]
        }),
        deleteEquipement: builder.mutation ({
            query: (equipementId) => ({
                url: `/equipements/${equipementId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Equipment"],
        }),
    }),
});

export const { 
    useListEquipementsQuery,
    useGetSiteEquipementsQuery,
    useRegisterEquipementMutation,
    useUpdateEquipementMutation,
    useDeleteEquipementMutation,

}= equipementsApi