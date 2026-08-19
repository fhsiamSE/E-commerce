import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice.js";
import productReducer from "./productSlice.js";
import homeReducer from "./homeSlice.js";
import cartReducer from "./cartSlice.js";
import wishlistReducer from "./wishlistSlice.js";


export const store = configureStore({

    reducer: {
        auth: authReducer,
        product: productReducer,
        home: homeReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,

    },

});