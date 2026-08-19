import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios.js";

/*
|--------------------------------------------------------------------------
| GET WISHLIST
|--------------------------------------------------------------------------
*/

export const getWishlist = createAsyncThunk(
    "wishlist/getWishlist",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/wishlist");

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to load wishlist."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| ADD TO WISHLIST
|--------------------------------------------------------------------------
*/

export const addToWishlist = createAsyncThunk(
    "wishlist/addToWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.post("/wishlist", {
                product_id: productId,
            });

            return {
                productId,
                response: response.data,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to add product to wishlist."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| REMOVE FROM WISHLIST
|--------------------------------------------------------------------------
*/

export const removeFromWishlist = createAsyncThunk(
    "wishlist/removeFromWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `/wishlist/${productId}`
            );

            return {
                productId,
                response: response.data,
            };
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to remove product from wishlist."
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
    items: [],
    wishlistIds: [],
    loading: false,
    actionLoading: false,
    error: null,
    success: null,
};


/*
|--------------------------------------------------------------------------
| SLICE
|--------------------------------------------------------------------------
*/

const wishlistSlice = createSlice({
    name: "wishlist",

    initialState,

    reducers: {
        clearWishlistMessages: (state) => {
            state.error = null;
            state.success = null;
        },
    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | GET WISHLIST
        |--------------------------------------------------------------------------
        */

        builder.addCase(
            getWishlist.pending,
            (state) => {
                state.loading = true;
                state.error = null;
            }
        );

        builder.addCase(
            getWishlist.fulfilled,
            (state, action) => {
                state.loading = false;
                state.error = null;

                /*
                 * Laravel response:
                 *
                 * {
                 *   success: true,
                 *   data: [...]
                 * }
                 */

                const items =
                    action.payload?.data || [];

                state.items = items;

                state.wishlistIds = items
                    .map(
                        (item) =>
                            item.product_id ??
                            item.product?.id
                    )
                    .filter(Boolean);
            }
        );

        builder.addCase(
            getWishlist.rejected,
            (state, action) => {
                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to load wishlist.";
            }
        );


        /*
        |--------------------------------------------------------------------------
        | ADD TO WISHLIST
        |--------------------------------------------------------------------------
        */

        builder.addCase(
            addToWishlist.pending,
            (state) => {
                state.actionLoading = true;
                state.error = null;
                state.success = null;
            }
        );

        builder.addCase(
            addToWishlist.fulfilled,
            (state, action) => {
                state.actionLoading = false;
                state.error = null;

                const productId =
                    action.payload.productId;

                if (
                    !state.wishlistIds.includes(
                        productId
                    )
                ) {
                    state.wishlistIds.push(
                        productId
                    );
                }

                state.success =
                    "Product added to wishlist.";
            }
        );

        builder.addCase(
            addToWishlist.rejected,
            (state, action) => {
                state.actionLoading = false;

                state.error =
                    action.payload ||
                    "Failed to add product to wishlist.";

                state.success = null;
            }
        );


        /*
        |--------------------------------------------------------------------------
        | REMOVE FROM WISHLIST
        |--------------------------------------------------------------------------
        */

        builder.addCase(
            removeFromWishlist.pending,
            (state) => {
                state.actionLoading = true;
                state.error = null;
                state.success = null;
            }
        );

        builder.addCase(
            removeFromWishlist.fulfilled,
            (state, action) => {
                state.actionLoading = false;
                state.error = null;

                const productId =
                    action.payload.productId;

                state.wishlistIds =
                    state.wishlistIds.filter(
                        (id) =>
                            Number(id) !==
                            Number(productId)
                    );

                state.items =
                    state.items.filter(
                        (item) =>
                            Number(
                                item.product_id ??
                                item.product?.id
                            ) !==
                            Number(productId)
                    );

                state.success =
                    "Product removed from wishlist.";
            }
        );

        builder.addCase(
            removeFromWishlist.rejected,
            (state, action) => {
                state.actionLoading = false;

                state.error =
                    action.payload ||
                    "Failed to remove product from wishlist.";

                state.success = null;
            }
        );
    },
});


export const {
    clearWishlistMessages,
} = wishlistSlice.actions;


/*
|--------------------------------------------------------------------------
| DEFAULT EXPORT
|--------------------------------------------------------------------------
*/

export default wishlistSlice.reducer;