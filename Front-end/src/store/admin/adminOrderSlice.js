import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

/*
|--------------------------------------------------------------------------
| Get All Admin Orders
|--------------------------------------------------------------------------
*/

export const getAdminOrders = createAsyncThunk(
    "adminOrders/getAdminOrders",

    async (_, { rejectWithValue }) => {

        try {

            const response = await api.get("/admin/orders");

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch orders."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Get Single Admin Order
|--------------------------------------------------------------------------
*/

export const getAdminOrder = createAsyncThunk(
    "adminOrders/getAdminOrder",

    async (id, { rejectWithValue }) => {

        try {

            const response = await api.get(`/admin/orders/${id}`);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch order."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
*/

export const updateAdminOrderStatus = createAsyncThunk(
    "adminOrders/updateStatus",

    async ({ id, status }, { rejectWithValue }) => {

        try {

            const response = await api.patch(
                `/admin/orders/${id}/status`,
                {
                    status: status,
                }
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update order status."
            );
        }
    }
);


/*
|--------------------------------------------------------------------------
| Delete Order
|--------------------------------------------------------------------------
*/

export const deleteAdminOrder = createAsyncThunk(
    "adminOrders/deleteOrder",

    async (id, { rejectWithValue }) => {

        try {

            const response = await api.delete(
                `/admin/orders/${id}`
            );

            return {
                id,
                ...response.data,
            };

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete order."
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

    orders: [],

    selectedOrder: null,

    loading: false,

    detailsLoading: false,

    statusUpdating: false,

    deleting: false,

    error: null,

    detailsError: null,

    statusError: null,

    deleteError: null,
};


/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const adminOrderSlice = createSlice({

    name: "adminOrders",

    initialState,

    reducers: {

        clearSelectedOrder: (state) => {

            state.selectedOrder = null;
            state.detailsError = null;
        },

        clearOrderError: (state) => {

            state.error = null;
            state.detailsError = null;
            state.statusError = null;
            state.deleteError = null;
        },
    },


    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | Get All Orders
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                getAdminOrders.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getAdminOrders.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.orders =
                        action.payload?.data || [];
                }
            )

            .addCase(
                getAdminOrders.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch orders.";
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Get Single Order
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                getAdminOrder.pending,
                (state) => {

                    state.detailsLoading = true;
                    state.detailsError = null;
                }
            )

            .addCase(
                getAdminOrder.fulfilled,
                (state, action) => {

                    state.detailsLoading = false;

                    state.selectedOrder =
                        action.payload?.data || null;
                }
            )

            .addCase(
                getAdminOrder.rejected,
                (state, action) => {

                    state.detailsLoading = false;

                    state.detailsError =
                        action.payload ||
                        "Failed to fetch order.";
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Update Status
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                updateAdminOrderStatus.pending,
                (state) => {

                    state.statusUpdating = true;
                    state.statusError = null;
                }
            )

            .addCase(
                updateAdminOrderStatus.fulfilled,
                (state, action) => {

                    state.statusUpdating = false;

                    const updatedOrder =
                        action.payload?.data;

                    if (!updatedOrder) {
                        return;
                    }


                    /*
                    |--------------------------------------------------------------------------
                    | Update Selected Order
                    |--------------------------------------------------------------------------
                    */

                    state.selectedOrder =
                        updatedOrder;


                    /*
                    |--------------------------------------------------------------------------
                    | Update Order In List
                    |--------------------------------------------------------------------------
                    */

                    const index =
                        state.orders.findIndex(
                            (order) =>
                                order.id === updatedOrder.id
                        );


                    if (index !== -1) {

                        state.orders[index] =
                            updatedOrder;
                    }
                }
            )

            .addCase(
                updateAdminOrderStatus.rejected,
                (state, action) => {

                    state.statusUpdating = false;

                    state.statusError =
                        action.payload ||
                        "Failed to update order status.";
                }
            );


        /*
        |--------------------------------------------------------------------------
        | Delete Order
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(
                deleteAdminOrder.pending,
                (state) => {

                    state.deleting = true;
                    state.deleteError = null;
                }
            )

            .addCase(
                deleteAdminOrder.fulfilled,
                (state, action) => {

                    state.deleting = false;

                    state.orders =
                        state.orders.filter(
                            (order) =>
                                order.id !== action.payload.id
                        );


                    if (
                        state.selectedOrder?.id ===
                        action.payload.id
                    ) {

                        state.selectedOrder = null;
                    }
                }
            )

            .addCase(
                deleteAdminOrder.rejected,
                (state, action) => {

                    state.deleting = false;

                    state.deleteError =
                        action.payload ||
                        "Failed to delete order.";
                }
            );
    },
});


export const {
    clearSelectedOrder,
    clearOrderError,
} = adminOrderSlice.actions;


export default adminOrderSlice.reducer;