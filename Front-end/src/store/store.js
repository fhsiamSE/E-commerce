import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice.js";
import productReducer from "./productSlice.js";
import homeReducer from "./homeSlice.js";
import cartReducer from "./cartSlice.js";
import wishlistReducer from "./wishlistSlice.js";
import reviewReducer from "./reviewSlice.js";


export const store = configureStore({

    reducer: {
        auth: authReducer,
        product: productReducer,
        home: homeReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        review: reviewReducer,

    },

});