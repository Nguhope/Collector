import { apiSlice } from "./apiSlice";

export const clientSitesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        
        // GET ALL SITES
        getSitesAll: builder.query({
            query: () => "/client_site/all",
            providesTags: ["ClientSite"],
        }),

        // REGISTER NEW SITE
        registerSite: builder.mutation({
            query: (site) => ({
                url: "/client_site/register",
                method: "POST",
                body: site,
            }),
            invalidatesTags: ["ClientSite"],
        }),

        // GET ALL EQUIPMENTS OF ONE SITE
        getSitesEquipment: builder.query({
            query: (site_id) => `/client_site/${site_id}/all_equipements`,
            providesTags: ["ClientSite"],
        }),

        // UPDATE SITE
        updateSite: builder.mutation({
            query: (site) => ({
                url: "/client_site/update",
                method: "PUT",
                body: site,
            }),
            invalidatesTags: ["ClientSite"],
        }),

        // DELETE SITE
        deleteSite: builder.mutation({
            query: (siteId) => ({
                url: `/client_site/${siteId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ClientSite"],
        }),
    }),
});

export const {
    useGetSitesAllQuery,
    useGetSitesEquipmentQuery,
    useRegisterSiteMutation,
    useUpdateSiteMutation,
    useDeleteSiteMutation,
} = clientSitesApi;
