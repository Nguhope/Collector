import { fetchBaseQuery } from "@reduxjs/toolkit/query";

import { setCredentials , clearCredentials} from "../../features/auth/authSlice"

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState})  =>  {
        const token = getState().auth.token;
        if(token) headers.set("Authorization", `Bearer ${token}`);
        headers.set('Content-Type', 'application/json');
        headers.set('Accept', 'application/json');
        return headers;
    }
})


export const baseQueryWithReauth =  async (args, api, extraOptions)  => {
    let result =  await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401 ) {
        const refreshToken = api.getState().auth.refresh_token;
        if(!refreshToken) {
            api.dispatch(clearCredentials());
            return result;
        }
      // Recuperation dun nouveau token d'acces avec le refresh token
        const refreshResult = await baseQuery(
            {
               url: "/auth/refresh-token",
               method: "POST",
               body: {refresh_token  : refreshToken },

            },
            api,
            extraOptions
        );

        if (refreshResult.data) {

            //Mise à jour des credentials dans le store redux
            api.dispatch(setCredentials(refreshResult.data));
            // Rejoue la requete
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(clearCredentials())
        }
    }
}