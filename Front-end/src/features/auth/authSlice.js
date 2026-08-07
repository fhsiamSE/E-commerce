import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login as loginAPI, register as registerAPI, logout as logoutAPI, getUser } from "./authService";


// Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      return await loginAPI(credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Login failed"
      );
    }
  }
);


// Register thunk
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await registerAPI(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Registration failed"
      );
    }
  }
);


// Logout thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logoutAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Logout failed"
      );
    }
  }
);


// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};


// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },


  extraReducers: (builder) => {

    builder

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      // LOGOUT
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });

  },
});


export const { clearError } = authSlice.actions;

export default authSlice.reducer;