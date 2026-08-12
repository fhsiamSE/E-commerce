import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";

// Get all products
export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/products");

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

// Get single product
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

// Create product
export const createProduct = createAsyncThunk(
    "product/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await api.post("/products", productData);

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

// Update product
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

// Delete product
export const deleteProduct = createAsyncThunk(
    "product/deleteProduct",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/products/${id}`);

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

const initialState = {
    products: [],
    product: null,

    loading: false,
    error: null,
    message: null,
};

const productSlice = createSlice({
    name: "product",

    initialState,

    reducers: {
        clearProductError: (state) => {
            state.error = null;
        },

        clearProductMessage: (state) => {
            state.message = null;
        },

        clearProduct: (state) => {
            state.product = null;
        },

        clearProducts: (state) => {
            state.products = [];
        },
    },

    extraReducers: (builder) => {

        // GET PRODUCTS
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;

                state.products = action.payload?.data || [];

                state.message =
                    action.payload?.message || null;

                state.error = null;
            })

            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;

                state.products = [];

                state.error =
                    action.payload || {
                        message: "Failed to fetch products",
                    };
            });


        // GET SINGLE PRODUCT
        builder
            .addCase(getProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;

                state.product = action.payload?.data || null;

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


        // CREATE PRODUCT
        builder
            .addCase(createProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;

                const newProduct = action.payload?.data;

                if (newProduct) {
                    state.products.unshift(newProduct);
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


        // UPDATE PRODUCT
        builder
            .addCase(updateProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;

                const updatedProduct = action.payload?.data;

                if (updatedProduct) {
                    const index = state.products.findIndex(
                        (product) =>
                            product.id === updatedProduct.id
                    );

                    if (index !== -1) {
                        state.products[index] = updatedProduct;
                    }

                    if (
                        state.product?.id === updatedProduct.id
                    ) {
                        state.product = updatedProduct;
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


        // DELETE PRODUCT
        builder
            .addCase(deleteProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;

                const deletedId = action.payload?.id;

                state.products = state.products.filter(
                    (product) => product.id !== deletedId
                );

                if (state.product?.id === deletedId) {
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

export const {
    clearProductError,
    clearProductMessage,
    clearProduct,
    clearProducts,
} = productSlice.actions;

export default productSlice.reducer;