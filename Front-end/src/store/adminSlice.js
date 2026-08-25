import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios";

/*
|--------------------------------------------------------------------------
| GET ADMIN DASHBOARD
|--------------------------------------------------------------------------
*/

export const getAdminDashboard = createAsyncThunk(
  "admin/getAdminDashboard",

  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const initialState = {
  dashboard: {
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalReviews: 0,

    pendingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,

    lowStockProducts: 0,
    outOfStockProducts: 0,

    recentOrders: [],
  },

  loading: false,
  error: null,
};


/*
|--------------------------------------------------------------------------
| ADMIN SLICE
|--------------------------------------------------------------------------
*/

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })


      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload?.data;

        const statistics = data?.statistics || {};

        const recentOrders = data?.recent_orders || [];

        state.dashboard = {
          totalProducts: statistics.total_products ?? 0,

          totalOrders: statistics.total_orders ?? 0,

          totalUsers: statistics.total_users ?? 0,

          totalReviews: statistics.total_reviews ?? 0,

          pendingOrders: statistics.pending_orders ?? 0,

          completedOrders: statistics.completed_orders ?? 0,

          cancelledOrders: statistics.cancelled_orders ?? 0,

          lowStockProducts:
            statistics.low_stock_products ?? 0,

          outOfStockProducts:
            statistics.out_of_stock_products ?? 0,

          recentOrders,
        };
      })


      /*
      |--------------------------------------------------------------------------
      | FAILED
      |--------------------------------------------------------------------------
      */

      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to load admin dashboard.";
      });
  },
});


/*
|--------------------------------------------------------------------------
| EXPORT ACTIONS
|--------------------------------------------------------------------------
*/

export const {
  clearAdminError,
} = adminSlice.actions;


/*
|--------------------------------------------------------------------------
| EXPORT REDUCER
|--------------------------------------------------------------------------
*/

export default adminSlice.reducer;