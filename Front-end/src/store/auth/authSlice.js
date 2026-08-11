
// src/features/auth/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", userData);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Registration failed",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);

      const data = response.data;

      // Save token to localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Login failed",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Failed to get user",
        }
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| Logout User
|--------------------------------------------------------------------------
*/
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/logout");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Logout failed",
        }
      );
    } finally {
      // Always remove token from localStorage
      localStorage.removeItem("token");
    }
  }
);


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/
const token = localStorage.getItem("token");

const initialState = {
  user: null,
  token: token,
  isAuthenticated: !!token,

  loading: false,

  error: null,
  message: null,
};


/*
|--------------------------------------------------------------------------
| Auth Slice
|--------------------------------------------------------------------------
*/
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    /*
    |--------------------------------------------------------------------------
    | Clear Auth Error
    |--------------------------------------------------------------------------
    */
    clearAuthError: (state) => {
      state.error = null;
    },

    /*
    |--------------------------------------------------------------------------
    | Clear Auth Message
    |--------------------------------------------------------------------------
    */
    clearAuthMessage: (state) => {
      state.message = null;
    },

    /*
    |--------------------------------------------------------------------------
    | Clear Auth State
    |--------------------------------------------------------------------------
    */
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = null;

      localStorage.removeItem("token");
    },
  },


  /*
  |--------------------------------------------------------------------------
  | Extra Reducers
  |--------------------------------------------------------------------------
  */
  extraReducers: (builder) => {

    /*
    |--------------------------------------------------------------------------
    | REGISTER
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        state.message =
          action.payload?.message || "Registration successful";

        state.error = null;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || {
            message: "Registration failed",
          };
      });


    /*
    |--------------------------------------------------------------------------
    | LOGIN
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // Token
        state.token = action.payload?.token || null;

        // User
        state.user = action.payload?.user || null;

        // Authentication
        state.isAuthenticated = !!action.payload?.token;

        // Message
        state.message =
          action.payload?.message || "Login successful";

        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        state.error =
          action.payload || {
            message: "Login failed",
          };
      });


    /*
    |--------------------------------------------------------------------------
    | GET CURRENT USER
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;

        /*
        Laravel response:

        {
          status: true,
          user: {...}
        }
        */

        state.user = action.payload?.user || null;

        state.isAuthenticated = true;

        state.error = null;
      })

      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        state.error =
          action.payload || {
            message: "Failed to get user",
          };

        // Invalid/expired token
        localStorage.removeItem("token");
      });


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        state.message =
          action.payload?.message || "Logout successful";

        state.error = null;
      })

      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;

        /*
        Logout API fail করলেও
        frontend থেকে user logout করে দেব।
        */

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        state.error =
          action.payload || {
            message: "Logout failed",
          };
      });
  },
});


/*
|--------------------------------------------------------------------------
| Export Actions
|--------------------------------------------------------------------------
*/

export const {
  clearAuthError,
  clearAuthMessage,
  clearAuthState,
} = authSlice.actions;


/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default authSlice.reducer;

