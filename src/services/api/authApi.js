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

    getToken : builder.query({
     
      query: (token) => `/auth/password/reset/validate-token/${token}`
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



const {useGetTokenQuery,useLoginMutation, useLogoutMutation, useForgetPasswordMutation, useResetPasswordMutation } = authApi;      

export {useGetTokenQuery,useLoginMutation, useLogoutMutation, useForgetPasswordMutation, useResetPasswordMutation};