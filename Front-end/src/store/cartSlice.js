import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";


/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export const getCart = createAsyncThunk(
    "cart/getCart",

    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/cart");

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch cart",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
|
| Product Details page থেকে:
|
| {
|     product_id: 1,
|     variant_id: 7,
|     quantity: 2
| }
|
|--------------------------------------------------------------------------
*/

export const addToCart = createAsyncThunk(
    "cart/addToCart",

    async (
        {
            product_id,
            variant_id,
            quantity = 1,
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.post("/cart", {
                product_id,
                variant_id,
                quantity,
            });

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to add product to cart",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Update Cart
|--------------------------------------------------------------------------
|
| শুধু quantity update করবে
|
| PUT /cart/{cart_id}
|
| {
|     quantity: 3
| }
|
|--------------------------------------------------------------------------
*/

export const updateCart = createAsyncThunk(
    "cart/updateCart",

    async (
        {
            id,
            quantity,
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(
                `/cart/${id}`,
                {
                    quantity,
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to update cart",
                }
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Remove From Cart
|--------------------------------------------------------------------------
|
| DELETE /cart/{cart_id}
|
|--------------------------------------------------------------------------
*/

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",

    async (
        id,
        { rejectWithValue }
    ) => {
        try {
            const response = await api.delete(
                `/cart/${id}`
            );

            return {
                ...response.data,
                id,
            };

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to remove product from cart",
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
    items: [],

    loading: false,

    error: null,

    message: null,
};


/*
|--------------------------------------------------------------------------
| Cart Slice
|--------------------------------------------------------------------------
*/

const cartSlice = createSlice({
    name: "cart",

    initialState,


    /*
    |--------------------------------------------------------------------------
    | Reducers
    |--------------------------------------------------------------------------
    */

    reducers: {

        /*
        |----------------------------------------------------------------------
        | Clear Cart Error
        |----------------------------------------------------------------------
        */

        clearCartError: (state) => {
            state.error = null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Cart Message
        |----------------------------------------------------------------------
        */

        clearCartMessage: (state) => {
            state.message = null;
        },


        /*
        |----------------------------------------------------------------------
        | Clear Cart
        |----------------------------------------------------------------------
        */

        clearCart: (state) => {
            state.items = [];
            state.message = null;
            state.error = null;
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
        | GET CART
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                getCart.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )


            .addCase(
                getCart.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.items =
                        action.payload?.data || [];

                    state.error = null;
                }
            )


            .addCase(
                getCart.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload || {
                            message:
                                "Failed to fetch cart",
                        };
                }
            );


        /*
        |--------------------------------------------------------------------------
        | ADD TO CART
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                addToCart.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;

                    state.message = null;
                }
            )


            .addCase(
                addToCart.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const newItem =
                        action.payload?.data;


                    /*
                    |--------------------------------------------------------------------------
                    | Safety Check
                    |--------------------------------------------------------------------------
                    */

                    if (!newItem) {
                        return;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Check Existing Cart Item
                    |--------------------------------------------------------------------------
                    |
                    | Backend একই variant হলে একই cart item update
                    | করবে।
                    |
                    */

                    const existingIndex =
                        state.items.findIndex(
                            (item) =>
                                item.id === newItem.id
                        );


                    /*
                    |--------------------------------------------------------------------------
                    | Existing Item
                    |--------------------------------------------------------------------------
                    */

                    if (existingIndex !== -1) {

                        state.items[existingIndex] =
                            newItem;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | New Item
                    |--------------------------------------------------------------------------
                    */

                    else {

                        state.items.push(
                            newItem
                        );
                    }


                    state.message =
                        action.payload?.message ||
                        "Product added to cart";


                    state.error = null;
                }
            )


            .addCase(
                addToCart.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload || {
                            message:
                                "Failed to add product to cart",
                        };
                }
            );


        /*
        |--------------------------------------------------------------------------
        | UPDATE CART
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                updateCart.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )


            .addCase(
                updateCart.fulfilled,
                (state, action) => {

                    state.loading = false;

                    const updatedItem =
                        action.payload?.data;


                    /*
                    |--------------------------------------------------------------------------
                    | Safety Check
                    |--------------------------------------------------------------------------
                    */

                    if (!updatedItem) {
                        return;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Find Cart Item
                    |--------------------------------------------------------------------------
                    */

                    const index =
                        state.items.findIndex(
                            (item) =>
                                item.id ===
                                updatedItem.id
                        );


                    /*
                    |--------------------------------------------------------------------------
                    | Update Item
                    |--------------------------------------------------------------------------
                    */

                    if (index !== -1) {

                        state.items[index] =
                            updatedItem;
                    }


                    state.message =
                        action.payload?.message ||
                        "Cart updated successfully";


                    state.error = null;
                }
            )


            .addCase(
                updateCart.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload || {
                            message:
                                "Failed to update cart",
                        };
                }
            );


        /*
        |--------------------------------------------------------------------------
        | REMOVE FROM CART
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                removeFromCart.pending,
                (state) => {

                    state.loading = true;

                    state.error = null;
                }
            )


            .addCase(
                removeFromCart.fulfilled,
                (state, action) => {

                    state.loading = false;


                    /*
                    |--------------------------------------------------------------------------
                    | Remove Item From Redux
                    |--------------------------------------------------------------------------
                    */

                    state.items =
                        state.items.filter(
                            (item) =>
                                item.id !==
                                action.payload.id
                        );


                    state.message =
                        action.payload?.message ||
                        "Product removed from cart";


                    state.error = null;
                }
            )


            .addCase(
                removeFromCart.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload || {
                            message:
                                "Failed to remove product from cart",
                        };
                }
            );
    },
});


/*
|--------------------------------------------------------------------------
| Export Actions
|--------------------------------------------------------------------------
*/

export const {
    clearCartError,
    clearCartMessage,
    clearCart,
} = cartSlice.actions;


/*
|--------------------------------------------------------------------------
| Export Reducer
|--------------------------------------------------------------------------
*/

export default cartSlice.reducer;