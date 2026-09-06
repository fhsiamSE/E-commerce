import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

/*
|--------------------------------------------------------------------------
| GET ADMIN PRODUCTS
|--------------------------------------------------------------------------
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
          "Failed to fetch products."
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
    from: 0,
    to: 0,
  },

  /*
  |--------------------------------------------------------------------------
  | GLOBAL STATISTICS
  |--------------------------------------------------------------------------
  */

  statistics: {
    total_products: 0,
    in_stock_products: 0,
    out_of_stock_products: 0,
    total_stock: 0,
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

    clearAdminProductError: (state) => {
      state.error = null;
    },

    clearDeleteProductError: (state) => {
      state.deleteError = null;
    },

  },

  extraReducers: (builder) => {

    /*
    |--------------------------------------------------------------------------
    | GET PRODUCTS - PENDING
    |--------------------------------------------------------------------------
    */

    builder.addCase(
      getAdminProducts.pending,
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );


    /*
    |--------------------------------------------------------------------------
    | GET PRODUCTS - FULFILLED
    |--------------------------------------------------------------------------
    */

    builder.addCase(
      getAdminProducts.fulfilled,
      (state, action) => {

        state.loading = false;

        state.products =
          action.payload.data || [];

        state.pagination =
          action.payload.pagination || {
            current_page: 1,
            last_page: 1,
            per_page: 10,
            total: 0,
            from: 0,
            to: 0,
          };

        /*
        |--------------------------------------------------------------------------
        | GLOBAL STATISTICS
        |--------------------------------------------------------------------------
        */

        state.statistics =
          action.payload.statistics || {
            total_products: 0,
            in_stock_products: 0,
            out_of_stock_products: 0,
            total_stock: 0,
          };
      }
    );


    /*
    |--------------------------------------------------------------------------
    | GET PRODUCTS - REJECTED
    |--------------------------------------------------------------------------
    */

    builder.addCase(
      getAdminProducts.rejected,
      (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to fetch products.";
      }
    );


    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT - PENDING
    |--------------------------------------------------------------------------
    */

    builder.addCase(
      deleteAdminProduct.pending,
      (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      }
    );


    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT - FULFILLED
    |--------------------------------------------------------------------------
    */

    builder.addCase(
      deleteAdminProduct.fulfilled,
      (state, action) => {

        state.deleteLoading = false;

        state.products =
          state.products.filter(
            (product) =>
              product.id !== action.payload.id
          );
      }
    );


    /*
    |--------------------------------------------------------------------------
    | DELETE PRODUCT - REJECTED
    |--------------------------------------------------------------------------
    */

    builder.addCase(
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


export const {
  clearAdminProductError,
  clearDeleteProductError,
} = adminProductSlice.actions;


export default adminProductSlice.reducer;