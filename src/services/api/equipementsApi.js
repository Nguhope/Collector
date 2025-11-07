import { apiSlice } from "./apiSlice";


export const equipementsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listEquipements: builder.query({
            query: () => "/equipements/all",
            providesTags: ["Equipement"],
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
            invalidatesTags: ["Equipement"],
        }),
        updateEquipement: builder.mutation
    })
})