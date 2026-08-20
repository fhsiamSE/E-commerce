import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios.js";

/*
|--------------------------------------------------------------------------
| Get Home Data
|--------------------------------------------------------------------------
*/

export const getHomeData = createAsyncThunk(
    "home/getHomeData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/home");

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch home data",
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
    newProducts: [],

    popularProducts: [],

    topSellingProducts: [],

    loading: false,

    error: null,
};


/*
|--------------------------------------------------------------------------
| Home Slice
|--------------------------------------------------------------------------
*/

const homeSlice = createSlice({
    name: "home",

    initialState,

    reducers: {

        clearHomeError: (state) => {
            state.error = null;
        },

    },


    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | GET HOME DATA - PENDING
        |--------------------------------------------------------------------------
        */

        builder.addCase(
            getHomeData.pending,
            (state) => {

                state.loading = true;

                state.error = null;
            }
        );


        /*
        |--------------------------------------------------------------------------
        | GET HOME DATA - SUCCESS
        |--------------------------------------------------------------------------
        */

        builder.addCase(
            getHomeData.fulfilled,
            (state, action) => {

                state.loading = false;


                const data =
                    action.payload?.data;


                state.newProducts =
                    data?.new_products || [];


                state.popularProducts =
                    data?.popular_products || [];


                state.topSellingProducts =
                    data?.top_selling_products || [];


                state.error = null;
            }
        );


        /*
        |--------------------------------------------------------------------------
        | GET HOME DATA - FAILED
        |--------------------------------------------------------------------------
        */

        builder.addCase(
            getHomeData.rejected,
            (state, action) => {

                state.loading = false;


                state.newProducts = [];

                state.popularProducts = [];

                state.topSellingProducts = [];


                state.error =
                    action.payload || {
                        message:
                            "Failed to fetch home data",
                    };
            }
        );
    },
});


export const {
    clearHomeError,
} = homeSlice.actions;


export default homeSlice.reducer;