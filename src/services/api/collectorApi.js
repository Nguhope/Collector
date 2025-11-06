import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const collectorApi = createApi({
       reducerPath: 'collectorApi',
       baseQuery: fetchBaseQuery({
          baseUrl,
          preparheaders: (headers, {getState}) => {

            const token = getState().auth.token;
            if(token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers;
          }
         }),
        tagTypes: ['Equipment', 'Site',],
        endpoints: (builder) => ({
            getEquipmentData: builder.query({
                query: () => '/equipments',

                 async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    console.log('Fetched equipment:', data);
                } catch (error) {
                    console.error('Failed to fetch equipment:', error);
                }
            },
                providesTags: ['Equipment']
            }),

            //sites
            getSitesData: builder.query({
                query: () => '/sites',
                 async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    console.log('Fetched current user:', data);
                } catch (error) {
                    console.error('Failed to fetch current user:', error);
                }
            },
                providesTags: ['Sites'],
            })
        }),



});

export const {
    useGetEquipmentDataQuery,
    useGetSitesDataQuery
} = collectorApi

