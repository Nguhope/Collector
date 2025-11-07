import { apiSlice } from "./apiSlice";


export const equipementsApi = apiSlice.injectEndpoints({
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
                methode: "PUT",
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