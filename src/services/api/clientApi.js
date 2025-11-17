
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Client"],
  endpoints: (builder) => ({
    // GET ALL CLIENTS
    listClients: builder.query({
      query: () => "/clients/all",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ client_id }) => ({
                type: "Client",
                id: client_id,
              })),
              { type: "Client", id: "LIST" },
            ]
          : [{ type: "Client", id: "LIST" }],
    }),

    // GET ONE CLIENT DETAILS
    getClient: builder.query({
      query: (clientId) => `/clients/${clientId}/infos`,
      providesTags: (result, error, clientId) => [{ type: "Client", id: clientId }],
    }),

    // CREATE NEW CLIENT
    createClient: builder.mutation({
      query: (client) => ({
        url: "/clients/register",
        method: "POST",
        body: client,
      }),
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),

    // UPDATE CLIENT
    updateClient: builder.mutation({
      query: (client) => ({
        url: "/clients/update",
        method: "PUT",
        body: client,
      }),
      invalidatesTags: (result, error, { client_id }) => [
        { type: "Client", id: client_id },
      ],
    }),

    // DELETE CLIENT
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `/clients/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Client", id: "LIST" }],
    }),
  }),
});

export const {
  useListClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
