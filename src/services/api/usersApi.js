import { apiSlice } from "./apiSlice";



export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        listUsers: builder.query({
            query: () =>"/users/list",
            async onQueryStarted(arg, { queryFulfilled}) {
                try {
                    const { data } = await queryFulfilled;
                    console.log("users", data)
                } catch (error) {
                    console.error('Failed to fecth users:', error)
                }
            },
            providesTags:  ["User"],
        }),
        getUser: builder.query({
            query: (userId) => `/users/${userId}`,
            providesTags: ["User"],
        }),
        createUser: builder.mutation ({
            query: (user) => ({
                url: "/users/create",
                method: "POST",
                body: user,
            }),
        }),
        updateUser: builder.mutation ({
            query: (user) => ({
                  url: "/users/update",
                  method: "PUT",
                  body: user,
            }),
            invalidatesTags: ["user"],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/delete/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        })
    })
});

export const {
    useListUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
}= usersApi
