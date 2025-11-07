import { apiSlice } from "./apiSlice";


export const permissionsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPermissions: builder.query({
            query: () =>  "permissions/all",
            providesTags: ['Permissions']
        })
    })
});

export const {
    useGetPermissionsQuery,
    
}= permissionsApi