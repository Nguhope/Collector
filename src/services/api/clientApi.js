import { apiSlice } from "./apiSlice";



export const clientApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listClient: builder.query({
            query: () =>"/clients/all",
            async onQueryStarted(arg, { queryFulfilled}) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("Client", data)
                } catch (error) {
                    console.error('Failed to fecth clients:', error)
                }
            },
            providesTags:  ["Client"],
        }),
        getClient: builder.query({
            query: (clientId) => `/clients/${clientId}/infos`,
            providesTags: ["Client"],
        }),
        createUser: builder.mutation ({
            query: (client) => ({
                url: "/clients/register",
                method: "POST",
                body: client,
            }),
        }),
        updateUser: builder.mutation ({
            query: (client) => ({
                  url: "/clients/update",
                  method: "PUT",
                  body: client,
            }),
            invalidatesTags: ["client"],
        }),
        deleteUser: builder.mutation({
            query: (clientId) => ({
                url: `/client/${clientId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Client"],
        })
    })
});

export const {
    useListClientsQuery,
    useGetClientQuery,
    useCreateClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
}= clientApi
