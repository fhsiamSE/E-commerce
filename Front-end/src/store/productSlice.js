import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";

/*
|--------------------------------------------------------------------------
| Get Products
|--------------------------------------------------------------------------
| Supports:
| - Pagination
| - Category filter
| - Search
| - Sorting
|
| Example:
| getProducts()
| getProducts(2)
| getProducts({ page: 2, category: "Men" })
| getProducts({ page: 1, search: "shirt", sort: "price_low" })
|
*/

export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (params = {}, { rejectWithValue }) => {
        try {
            /*
            |--------------------------------------------------------------------------
            | Support both:
            | getProducts(2)
            | getProducts({ page: 2 })
            |--------------------------------------------------------------------------
            */

            let page = 1;
            let category = "";
            let search = "";
            let sort = "";
            let perPage = 20;

            if (typeof params === "number") {
                page = params;
            } else {
                page = params.page || 1;
                category = params.category || "";
                search = params.search || "";
                sort = params.sort || "";
                perPage = params.perPage || 20;
            }

            /*
            |--------------------------------------------------------------------------
            | Build Query Parameters
            |--------------------------------------------------------------------------
            */

            const queryParams = new URLSearchParams();

            queryParams.append("page", page);
            queryParams.append("per_page", perPage);

            if (category) {
                queryParams.append("category", category);
            }

            if (search) {
                queryParams.append("search", search);
            }

            if (sort) {
                queryParams.append("sort", sort);
            }

            /*
            |--------------------------------------------------------------------------
            | API Request
            |--------------------------------------------------------------------------
            */

            const response = await api.get(
                `/products?${queryParams.toString()}`
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch products",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Get Single Product
|--------------------------------------------------------------------------
*/

export const getProduct = createAsyncThunk(
    "product/getProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/${id}`);

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch product",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/products",
                productData
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to create product",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export const updateProduct = createAsyncThunk(
    "product/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `/products/${id}`,
                productData
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to update product",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
*/

export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `/products/${id}`
            );

            return {
                id,
                ...response.data,
            };

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to delete product",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
    /*
    |--------------------------------------------------------------------------
    | Products
    |--------------------------------------------------------------------------
    */

    products: [],

    /*
    |--------------------------------------------------------------------------
    | Single Product
    |--------------------------------------------------------------------------
    */

    product: null,

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    currentPage: 1,

    lastPage: 1,

    perPage: 20,

    total: 0,

    /*
    |--------------------------------------------------------------------------
    | Loading / Error / Message
    |--------------------------------------------------------------------------
    */

    loading: false,

    error: null,

    message: null,
};


/*
|--------------------------------------------------------------------------
| Product Slice
|--------------------------------------------------------------------------
*/

const productSlice = createSlice({
    name: "product",

    initialState,

    reducers: {

        /*
        |--------------------------------------------------------------------------
        | Clear Product Error
        |--------------------------------------------------------------------------
        */

        clearProductError: (state) => {
            state.error = null;
        },


        /*
        |--------------------------------------------------------------------------
        | Clear Product Message
        |--------------------------------------------------------------------------
        */

        clearProductMessage: (state) => {
            state.message = null;
        },


        /*
        |--------------------------------------------------------------------------
        | Clear Single Product
        |--------------------------------------------------------------------------
        */

        clearProduct: (state) => {
            state.product = null;
        },


        /*
        |--------------------------------------------------------------------------
        | Clear All Products
        |--------------------------------------------------------------------------
        */

        clearProducts: (state) => {
            state.products = [];

            state.currentPage = 1;

            state.lastPage = 1;

            state.total = 0;
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
        | GET PRODUCTS
        |--------------------------------------------------------------------------
        */

        builder

            /*
            |--------------------------------------------------------------------------
            | Pending
            |--------------------------------------------------------------------------
            */

            .addCase(getProducts.pending, (state) => {

                state.loading = true;

                state.error = null;
            })


            /*
            |--------------------------------------------------------------------------
            | Fulfilled
            |--------------------------------------------------------------------------
            */

            .addCase(getProducts.fulfilled, (state, action) => {

                state.loading = false;

                /*
                |--------------------------------------------------------------------------
                | Laravel Pagination Data
                |--------------------------------------------------------------------------
                |
                | action.payload.data
                |
                | {
                |   current_page,
                |   data,
                |   last_page,
                |   per_page,
                |   total,
                |   ...
                | }
                |
                */

                const pagination =
                    action.payload?.data;


                /*
                |--------------------------------------------------------------------------
                | Products
                |--------------------------------------------------------------------------
                */

                state.products =
                    pagination?.data || [];


                /*
                |--------------------------------------------------------------------------
                | Pagination Information
                |--------------------------------------------------------------------------
                */

                state.currentPage =
                    pagination?.current_page || 1;


                state.lastPage =
                    pagination?.last_page || 1;


                state.perPage =
                    pagination?.per_page || 20;


                state.total =
                    pagination?.total || 0;


                /*
                |--------------------------------------------------------------------------
                | Message
                |--------------------------------------------------------------------------
                */

                state.message =
                    action.payload?.message || null;


                state.error = null;
            })


            /*
            |--------------------------------------------------------------------------
            | Rejected
            |--------------------------------------------------------------------------
            */

            .addCase(getProducts.rejected, (state, action) => {

                state.loading = false;

                state.products = [];

                state.currentPage = 1;

                state.lastPage = 1;

                state.total = 0;

                state.error =
                    action.payload || {
                        message: "Failed to fetch products",
                    };
            });


        /*
        |--------------------------------------------------------------------------
        | GET SINGLE PRODUCT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getProduct.pending, (state) => {

                state.loading = true;

                state.error = null;
            })


            .addCase(getProduct.fulfilled, (state, action) => {

                state.loading = false;

                state.product =
                    action.payload?.data || null;


                state.message =
                    action.payload?.message || null;


                state.error = null;
            })


            .addCase(getProduct.rejected, (state, action) => {

                state.loading = false;

                state.product = null;

                state.error =
                    action.payload || {
                        message: "Failed to fetch product",
                    };
            });


        /*
        |--------------------------------------------------------------------------
        | CREATE PRODUCT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(createProduct.pending, (state) => {

                state.loading = true;

                state.error = null;
            })


            .addCase(createProduct.fulfilled, (state, action) => {

                state.loading = false;

                const newProduct =
                    action.payload?.data;


                if (newProduct) {

                    state.products.unshift(
                        newProduct
                    );

                    /*
                    |--------------------------------------------------------------------------
                    | Update total
                    |--------------------------------------------------------------------------
                    */

                    state.total += 1;
                }


                state.message =
                    action.payload?.message ||
                    "Product created successfully";


                state.error = null;
            })


            .addCase(createProduct.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload || {
                        message: "Failed to create product",
                    };
            });


        /*
        |--------------------------------------------------------------------------
        | UPDATE PRODUCT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(updateProduct.pending, (state) => {

                state.loading = true;

                state.error = null;
            })


            .addCase(updateProduct.fulfilled, (state, action) => {

                state.loading = false;

                const updatedProduct =
                    action.payload?.data;


                if (updatedProduct) {

                    /*
                    |--------------------------------------------------------------------------
                    | Update Product In List
                    |--------------------------------------------------------------------------
                    */

                    const index =
                        state.products.findIndex(
                            (product) =>
                                product.id ===
                                updatedProduct.id
                        );


                    if (index !== -1) {

                        state.products[index] =
                            updatedProduct;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Update Single Product
                    |--------------------------------------------------------------------------
                    */

                    if (
                        state.product?.id ===
                        updatedProduct.id
                    ) {

                        state.product =
                            updatedProduct;
                    }
                }


                state.message =
                    action.payload?.message ||
                    "Product updated successfully";


                state.error = null;
            })


            .addCase(updateProduct.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload || {
                        message: "Failed to update product",
                    };
            });


        /*
        |--------------------------------------------------------------------------
        | DELETE PRODUCT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(deleteProduct.pending, (state) => {

                state.loading = true;

                state.error = null;
            })


            .addCase(deleteProduct.fulfilled, (state, action) => {

                state.loading = false;

                const deletedId =
                    action.payload?.id;


                /*
                |--------------------------------------------------------------------------
                | Remove Product
                |--------------------------------------------------------------------------
                */

                state.products =
                    state.products.filter(
                        (product) =>
                            product.id !== deletedId
                    );


                /*
                |--------------------------------------------------------------------------
                | Update Total
                |--------------------------------------------------------------------------
                */

                if (state.total > 0) {
                    state.total -= 1;
                }


                /*
                |--------------------------------------------------------------------------
                | Clear Single Product
                |--------------------------------------------------------------------------
                */

                if (
                    state.product?.id ===
                    deletedId
                ) {

                    state.product = null;
                }


                state.message =
                    action.payload?.message ||
                    "Product deleted successfully";


                state.error = null;
            })


            .addCase(deleteProduct.rejected, (state, action) => {

                state.loading = false;

                state.error =
                    action.payload || {
                        message: "Failed to delete product",
                    };
            });
    },
});


/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
    clearProductError,
    clearProductMessage,
    clearProduct,
    clearProducts,
} = productSlice.actions;


/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default productSlice.reducer;