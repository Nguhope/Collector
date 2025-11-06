import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
               state.currentUser = action.payload.user;
               state.token = action.payload.token;
               state.isAuthenticated = true;
               state.error = null;
        },
        clearCredentials: (state) => {
            state.currentUser = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setCredentials, clearCredentials, setError, setLoading} = authSlice.actions;

export default authSlice.reducer;