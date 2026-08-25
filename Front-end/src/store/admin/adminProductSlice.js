import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

/*
|--------------------------------------------------------------------------
| GET ADMIN PRODUCTS
|--------------------------------------------------------------------------
|
| Supports:
|   search
|   category
|   stock
|   sort
|   page
|   per_page
|
*/

export const getAdminProducts = createAsyncThunk(
  "adminProducts/getAdminProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/products", {
        params,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load admin products."
      );
    }
  }
);


/*
|--------------------------------------------------------------------------
| DELETE ADMIN PRODUCT
|--------------------------------------------------------------------------
*/

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/deleteAdminProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/admin/products/${id}`
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete product."
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
  products: [],

  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: null,
    to: null,
  },

  loading: false,
  deleteLoading: false,

  error: null,
  deleteError: null,
};


/*
|--------------------------------------------------------------------------
| SLICE
|--------------------------------------------------------------------------
*/

const adminProductSlice = createSlice({
  name: "adminProducts",

  initialState,

  reducers: {

    /*
    |--------------------------------------------------------------------------
    | CLEAR ERROR
    |--------------------------------------------------------------------------
    */

    clearAdminProductError: (state) => {
      state.error = null;
    },

    /*
    |--------------------------------------------------------------------------
    | CLEAR DELETE ERROR
    |--------------------------------------------------------------------------
    */

    clearDeleteProductError: (state) => {
      state.deleteError = null;
    },

    /*
    |--------------------------------------------------------------------------
    | RESET PRODUCTS
    |--------------------------------------------------------------------------
    */

    resetAdminProducts: (state) => {
      state.products = [];

      state.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: null,
        to: null,
      };

      state.error = null;
    },
  },


  /*
  |--------------------------------------------------------------------------
  | ASYNC ACTIONS
  |--------------------------------------------------------------------------
  */

  extraReducers: (builder) => {

    /*
    |--------------------------------------------------------------------------
    | GET PRODUCTS
    |--------------------------------------------------------------------------
    */

    builder

      .addCase(
        getAdminProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getAdminProducts.fulfilled,
        (state, action) => {

          state.loading = false;
          state.error = null;

          /*
          |--------------------------------------------------------------------------
          | Laravel response:
          |
          | {
          |   success: true,
          |   data: {
          |     current_page: 1,
          |     data: [...]
          |   }
          | }
          |--------------------------------------------------------------------------
          */

          const data = action.payload?.data;

          state.products = data?.data || [];

          state.pagination = {
            current_page: data?.current_page || 1,
            last_page: data?.last_page || 1,
            per_page: data?.per_page || 10,
            total: data?.total || 0,
            from: data?.from || null,
            to: data?.to || null,
          };
        }
      )

      .addCase(
        getAdminProducts.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load admin products.";
        }
      );


    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT
    |--------------------------------------------------------------------------
    */

    builder

      .addCase(
        deleteAdminProduct.pending,
        (state) => {

          state.deleteLoading = true;
          state.deleteError = null;
        }
      )

      .addCase(
        deleteAdminProduct.fulfilled,
        (state, action) => {

          state.deleteLoading = false;
          state.deleteError = null;

          /*
          |--------------------------------------------------------------------------
          | Remove deleted product from Redux immediately
          |--------------------------------------------------------------------------
          */

          state.products = state.products.filter(
            (product) =>
              product.id !== action.payload.id
          );

          /*
          |--------------------------------------------------------------------------
          | Update total
          |--------------------------------------------------------------------------
          */

          if (state.pagination.total > 0) {
            state.pagination.total -= 1;
          }

          /*
          |--------------------------------------------------------------------------
          | Update displayed range
          |--------------------------------------------------------------------------
          */

          if (
            state.pagination.to !== null &&
            state.pagination.to > 0
          ) {
            state.pagination.to -= 1;
          }
        }
      )

      .addCase(
        deleteAdminProduct.rejected,
        (state, action) => {

          state.deleteLoading = false;

          state.deleteError =
            action.payload ||
            "Failed to delete product.";
        }
      );
  },
});


/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

export const {
  clearAdminProductError,
  clearDeleteProductError,
  resetAdminProducts,
} = adminProductSlice.actions;


/*
|--------------------------------------------------------------------------
| REDUCER
|--------------------------------------------------------------------------
*/

export default adminProductSlice.reducer;