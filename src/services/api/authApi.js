import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { clearCredentials, setCredentials} from  "../../features/auth/authSlice";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const authApi = createApi ({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
              const token = localStorage.getItem('auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    console.log('Login successful:', data);
                    dispatch(setCredentials(data));
                } catch (error) {
                    console.error('Login failed:', error);
                }
            }
        }),
        logout: builder.mutation({
            query: ( ) => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(arg, {dispatch}) {
                dispatch(logout());
            }
        }),
        getCurrentUser: builder.query({
            query: (id) => ({
                url: `/users/${id}`,
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    console.log('Fetched current user:', data);
                } catch (error) {
                    console.error('Failed to fetch current user:', error);
                }
            }
        }), 
    refreshToken: builder.mutation ({

        query: () => ({
             url: '/auth/refresh-token',
             method: 'POST',
        }),
        async onQueryStarted(arg, {dispatch, queryFulfilled}) {
            try {
                const { data } = await queryFulfilled;
                dispatch(setCredentials(data));
            } catch {
                dispatch(clearCredentials());
            }
        }
    }),



    forgetPassword: builder.mutation({
      query:(credentials) => ({
        url: '/auth/password/reset-request',
        method: 'post',
        body: credentials,

      }),
      async onQueryStarted(arg,{ queryFulfilled }  ) {
        try {
          const {data} =  await queryFulfilled;
          console.log(data, " requete email envoyé");
          
        } catch {}
      }

    }),

    resetPassword: builder.mutation({
        query:(credentials) => ({
        url: '/auth/password/reset',
        method: 'post',
        body: credentials,

      }),
      async onQueryStarted(arg,{ queryFulfilled }  ) {
        try {
          const {data} =  await queryFulfilled;
          console.log(data, " requete  reset email envoyé");
          
        } catch {}
      }

    }),

    
    
    }),
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Tentative de refresh token
    try {
      await api.dispatch(useRefreshTokenMutation().initiate());
      // Replay requête initiale avec nouveau token
      result = await baseQuery(args, api, extraOptions);
    } catch {
      // logout automatique si refresh échoue
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

const {useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useForgetPasswordMutation, useResetPasswordMutation } = authApi;      

export {useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useForgetPasswordMutation, useResetPasswordMutation};