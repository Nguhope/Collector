

import { apiSlice } from "./apiSlice";

export const clientSitesApi = apiSlice.injectEndpoints({
    endpoints: (builder) =>  ({
        getSitesAll: builder.query({
            query: () => "/client_site/all",
            providesTags:  ["ClientSite"]
        }),
        registerSite: builder.mutation({
            query: (site) =>  ({
                url: "/client_site/register",
                method: "POST",
                body: site,
            }),
            invalidatesTags: ["ClientSite"],
        }),
        getSitesEquipment: builder.query({
            query: (site_id) => `/client_site/${site_id}/all_equipements`,
            ptovideTags: ["ClientSite"]

        }),
        updateSite: builder.mutation({
            query: (site) =>  ({
                url: "/client_site/update",
                method: "PUT",
                body: site,
            }),
            invalidatesTags: ["ClientSite"],
        }),
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
    useGetSiteEquipmentQuery,
    useRegisterSiteMutation,
    useUpdateSiteMutation,
    useDeleteSiteMutation,
}= clientSitesApi;