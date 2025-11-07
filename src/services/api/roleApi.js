import { apiSlice } from "./apiSlice"


export const rolesApi = apiSlice.injectEndpoints({
    endpoints: (builder)  => ({
        listRoles: builder.query({
            query: ()  => "/roles/list",
            provideTags: ["Role"],
        }),
        // body : {name, description , permissions[]}
        createRole: builder.mutation({
            query: (role)  => ({
                url: "/role/create",
                method: "POST",
                body: role,
            }),
            invalidatesTags: ["Role"],
        }),

        updateRole: builder.mutation({
            query: (role)  => ({
                url: "roles/update",
                method: "PUT",
                body: role,
            }),
            invalidatesTags: ['Role'],

        }),
        // permissions[] doit contenir la liste des permissions
        addPermissions: builder.mutation({
            query: ({role_id, permissions })  => ({
                url: "/roles/add_permissions",
                method: "POST",
                body: { role_id, permissions},
            }),
            invalidatesTags: ['Role'],
        }),
        deleteRole: builder.mutation({
            query: (roleId)   =>  ({
                url: `/role/${roleId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Role"],
        })
    })
});

export const {
    useListrolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation
} = rolesApi