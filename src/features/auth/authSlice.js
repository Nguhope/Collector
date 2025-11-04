import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Simulated login API call (replace with real backend API)
const fakeLoginAPI = async ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'password123') {
        resolve({ email, name: 'Collector User' });
      } else {
        reject('Invalid email or password');
      }
    }, 1000);
  });
};

// Async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, thunkAPI) => {
  try {
    const user = await fakeLoginAPI(credentials);
    return user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
