import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice.js";
import productReducer from "./productSlice.js";
import homeReducer from "./homeSlice.js";


export const store = configureStore({

    reducer: {
        auth: authReducer,
        product: productReducer,
        home: homeReducer,

    },

});