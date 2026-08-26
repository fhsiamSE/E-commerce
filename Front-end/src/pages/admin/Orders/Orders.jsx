import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAdminOrders } from "../../../store/admin/adminOrderSlice.js";


const Orders = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux State
    |--------------------------------------------------------------------------
    */

    const {
        orders = [],
        loading,
        error,
    } = useSelector((state) => state.adminOrders);


    /*
    |--------------------------------------------------------------------------
    | Filter State
    |--------------------------------------------------------------------------
    */

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [paymentFilter, setPaymentFilter] =
        useState("All");


    /*
    |--------------------------------------------------------------------------
    | Fetch Orders
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        dispatch(getAdminOrders());

    }, [dispatch]);


    /*
    |--------------------------------------------------------------------------
    | Refresh Orders
    |--------------------------------------------------------------------------
    */

    const handleRefresh = () => {

        dispatch(getAdminOrders());

    };


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const statistics = useMemo(() => {

        const totalOrders = orders.length;


        const pendingOrders = orders.filter(
            (order) =>
                String(order.status || "").toLowerCase() ===
                "pending"
        ).length;


        const processingOrders = orders.filter(
            (order) =>
                String(order.status || "").toLowerCase() ===
                "processing"
        ).length;


        const deliveredOrders = orders.filter(
            (order) =>
                String(order.status || "").toLowerCase() ===
                "delivered"
        ).length;


        const revenue = orders.reduce(
            (sum, order) =>
                sum + Number(order.total || 0),
            0
        );


        return {
            totalOrders,
            pendingOrders,
            processingOrders,
            deliveredOrders,
            revenue,
        };

    }, [orders]);


    /*
    |--------------------------------------------------------------------------
    | Filter Orders
    |--------------------------------------------------------------------------
    */

    const filteredOrders = useMemo(() => {

        return orders.filter((order) => {

            const searchValue =
                search.toLowerCase().trim();


            const orderId =
                String(order.id || "").toLowerCase();


            const customerName =
                String(
                    order.user?.name || ""
                ).toLowerCase();


            const customerEmail =
                String(
                    order.user?.email || ""
                ).toLowerCase();


            const matchesSearch =
                orderId.includes(searchValue) ||
                customerName.includes(searchValue) ||
                customerEmail.includes(searchValue);


            const orderStatus =
                String(
                    order.status || ""
                ).toLowerCase();


            const matchesStatus =
                statusFilter === "All" ||
                orderStatus ===
                    statusFilter.toLowerCase();


            /*
            |--------------------------------------------------------------------------
            | Payment
            |--------------------------------------------------------------------------
            |
            | Your current orders table does not have
            | payment_status yet.
            |
            */

            const matchesPayment =
                paymentFilter === "All" ||
                String(
                    order.payment_status || ""
                ).toLowerCase() ===
                    paymentFilter.toLowerCase();


            /*
            |--------------------------------------------------------------------------
            | If payment_status doesn't exist,
            | don't hide orders when "All" is selected.
            |--------------------------------------------------------------------------
            */

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPayment
            );

        });

    }, [
        orders,
        search,
        statusFilter,
        paymentFilter,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Status Style
    |--------------------------------------------------------------------------
    */

    const getStatusStyle = (status) => {

        switch (
            String(status).toLowerCase()
        ) {

            case "delivered":

                return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";


            case "processing":

                return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";


            case "shipped":

                return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";


            case "pending":

                return "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";


            case "cancelled":

                return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";


            default:

                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Payment Style
    |--------------------------------------------------------------------------
    */

    const getPaymentStyle = (payment) => {

        switch (
            String(payment).toLowerCase()
        ) {

            case "paid":

                return "text-green-600 dark:text-green-400";


            case "pending":

                return "text-yellow-600 dark:text-yellow-400";


            case "failed":

                return "text-red-600 dark:text-red-400";


            default:

                return "text-gray-500";
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }


        const parsedDate =
            new Date(date);


        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }


        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Customer Initials
    |--------------------------------------------------------------------------
    */

    const getInitials = (name) => {

        if (!name) {
            return "CU";
        }


        return name
            .split(" ")
            .filter(Boolean)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };


    /*
    |--------------------------------------------------------------------------
    | Get Item Count
    |--------------------------------------------------------------------------
    */

    const getItemCount = (order) => {

        if (!Array.isArray(order.items)) {
            return 0;
        }


        return order.items.reduce(
            (sum, item) =>
                sum + Number(item.quantity || 0),
            0
        );
    };


    /*
    |--------------------------------------------------------------------------
    | View Order
    |--------------------------------------------------------------------------
    */

    const handleViewOrder = (orderId) => {

        navigate(
            `/admin/orders/${orderId}`
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Loading State
    |--------------------------------------------------------------------------
    */

    if (loading && orders.length === 0) {

        return (

            <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

                <div className="flex min-h-[400px] items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white" />

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Loading orders...
                        </p>

                    </div>

                </div>

            </div>

        );
    }


    /*
    |--------------------------------------------------------------------------
    | Error State
    |--------------------------------------------------------------------------
    */

    if (error && orders.length === 0) {

        return (

            <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

                <div className="flex min-h-[400px] items-center justify-center">

                    <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">

                        <div className="text-4xl">
                            ⚠️
                        </div>


                        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Failed to load orders
                        </h3>


                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={handleRefresh}
                            className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>

        );
    }


    return (

        <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">


            {/* =========================================================
                PAGE HEADER
            ========================================================== */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Orders
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage and monitor all customer orders.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >

                    {loading
                        ? "Refreshing..."
                        : "↻ Refresh"}

                </button>

            </div>



            {/* =========================================================
                STATISTICS
            ========================================================== */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">


                {/* Total Orders */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Total Orders
                        </p>

                        <span className="text-lg">
                            📦
                        </span>

                    </div>


                    <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                        {statistics.totalOrders}
                    </p>


                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        All orders
                    </p>

                </div>



                {/* Pending */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Pending
                        </p>

                        <span className="text-lg">
                            ⏳
                        </span>

                    </div>


                    <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                        {statistics.pendingOrders}
                    </p>


                    <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                        Needs attention
                    </p>

                </div>



                {/* Processing */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Processing
                        </p>

                        <span className="text-lg">
                            ⚙️
                        </span>

                    </div>


                    <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                        {statistics.processingOrders}
                    </p>


                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                        Being prepared
                    </p>

                </div>



                {/* Delivered */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Delivered
                        </p>

                        <span className="text-lg">
                            ✓
                        </span>

                    </div>


                    <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                        {statistics.deliveredOrders}
                    </p>


                    <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                        Completed
                    </p>

                </div>



                {/* Revenue */}

                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

                    <div className="flex items-center justify-between">

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Revenue
                        </p>

                        <span className="text-lg">
                            ৳
                        </span>

                    </div>


                    <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-white">
                        ৳{statistics.revenue.toLocaleString()}
                    </p>


                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Order revenue
                    </p>

                </div>

            </div>



            {/* =========================================================
                ORDERS TABLE
            ========================================================== */}

            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">


                {/* =======================================================
                    FILTER HEADER
                ======================================================== */}

                <div className="border-b border-gray-200 p-4 dark:border-gray-800">

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">


                        {/* Search */}

                        <div className="relative w-full lg:max-w-sm">

                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>


                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search order or customer..."
                                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-black dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:focus:border-white"
                            />

                        </div>



                        {/* Filters */}

                        <div className="flex flex-col gap-2 sm:flex-row">


                            {/* Status */}

                            <select
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value)
                                }
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            >

                                <option value="All">
                                    All Status
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Processing">
                                    Processing
                                </option>

                                <option value="Shipped">
                                    Shipped
                                </option>

                                <option value="Delivered">
                                    Delivered
                                </option>

                                <option value="Cancelled">
                                    Cancelled
                                </option>

                            </select>



                            {/* Payment */}

                            <select
                                value={paymentFilter}
                                onChange={(event) =>
                                    setPaymentFilter(event.target.value)
                                }
                                className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                            >

                                <option value="All">
                                    All Payments
                                </option>

                                <option value="Paid">
                                    Paid
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Failed">
                                    Failed
                                </option>

                            </select>

                        </div>

                    </div>

                </div>



                {/* =======================================================
                    DESKTOP TABLE
                ======================================================== */}

                <div className="hidden overflow-x-auto md:block">

                    <table className="w-full text-left">

                        <thead className="bg-gray-50 dark:bg-gray-950">

                            <tr>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Order
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Customer
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Items
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Total
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Payment
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Action
                                </th>

                            </tr>

                        </thead>



                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">

                            {filteredOrders.map((order) => {

                                const customer =
                                    order.user?.name ||
                                    "Unknown Customer";


                                const email =
                                    order.user?.email ||
                                    "-";


                                const itemCount =
                                    getItemCount(order);


                                const total =
                                    Number(
                                        order.total || 0
                                    );


                                const initials =
                                    getInitials(customer);


                                const payment =
                                    order.payment_status ||
                                    "Not Set";


                                return (

                                    <tr
                                        key={order.id}
                                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >


                                        {/* Order */}

                                        <td className="whitespace-nowrap px-6 py-4">

                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                #{order.id}
                                            </p>

                                        </td>



                                        {/* Customer */}

                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">

                                                    {initials}

                                                </div>


                                                <div>

                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {customer}
                                                    </p>

                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {email}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>



                                        {/* Items */}

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">

                                            {itemCount}{" "}
                                            {itemCount === 1
                                                ? "item"
                                                : "items"}

                                        </td>



                                        {/* Total */}

                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">

                                            ৳{total.toLocaleString()}

                                        </td>



                                        {/* Payment */}

                                        <td className="whitespace-nowrap px-6 py-4">

                                            {order.payment_status ? (

                                                <span
                                                    className={`text-sm font-medium ${getPaymentStyle(
                                                        order.payment_status
                                                    )}`}
                                                >

                                                    {order.payment_status}

                                                </span>

                                            ) : (

                                                <span className="text-sm text-gray-400">
                                                    Not Set
                                                </span>

                                            )}

                                        </td>



                                        {/* Status */}

                                        <td className="whitespace-nowrap px-6 py-4">

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                                    order.status
                                                )}`}
                                            >

                                                {order.status ||
                                                    "Unknown"}

                                            </span>

                                        </td>



                                        {/* Date */}

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">

                                            {formatDate(
                                                order.created_at
                                            )}

                                        </td>



                                        {/* Action */}

                                        <td className="whitespace-nowrap px-6 py-4 text-right">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewOrder(
                                                        order.id
                                                    )
                                                }
                                                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-black hover:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white dark:hover:text-black"
                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                );

                            })}

                        </tbody>

                    </table>

                </div>



                {/* =======================================================
                    MOBILE ORDERS
                ======================================================== */}

                <div className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">

                    {filteredOrders.map((order) => {

                        const customer =
                            order.user?.name ||
                            "Unknown Customer";


                        const email =
                            order.user?.email ||
                            "-";


                        const itemCount =
                            getItemCount(order);


                        const total =
                            Number(
                                order.total || 0
                            );


                        const initials =
                            getInitials(customer);


                        return (

                            <div
                                key={order.id}
                                className="p-4"
                            >


                                <div className="flex items-start justify-between gap-3">

                                    <div>

                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            #{order.id}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(
                                                order.created_at
                                            )}
                                        </p>

                                    </div>


                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                            order.status
                                        )}`}
                                    >

                                        {order.status ||
                                            "Unknown"}

                                    </span>

                                </div>



                                {/* Customer */}

                                <div className="mt-4 flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">

                                        {initials}

                                    </div>


                                    <div>

                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {customer}
                                        </p>

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {email}
                                        </p>

                                    </div>

                                </div>



                                {/* Order Info */}

                                <div className="mt-4 grid grid-cols-2 gap-3">


                                    {/* Items */}

                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Items
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                            {itemCount}
                                        </p>

                                    </div>



                                    {/* Total */}

                                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">

                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Total
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                            ৳{total.toLocaleString()}
                                        </p>

                                    </div>

                                </div>



                                {/* Payment + View */}

                                <div className="mt-4 flex items-center justify-between">

                                    {order.payment_status ? (

                                        <span
                                            className={`text-sm font-medium ${getPaymentStyle(
                                                order.payment_status
                                            )}`}
                                        >

                                            {order.payment_status}

                                        </span>

                                    ) : (

                                        <span className="text-sm text-gray-400">
                                            Payment not set
                                        </span>

                                    )}


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleViewOrder(
                                                order.id
                                            )
                                        }
                                        className="rounded-lg bg-black px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-black"
                                    >

                                        View Order

                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>



                {/* =======================================================
                    EMPTY STATE
                ======================================================== */}

                {filteredOrders.length === 0 && (

                    <div className="px-6 py-16 text-center">

                        <div className="text-4xl">
                            📦
                        </div>


                        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                            No orders found
                        </h3>


                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Try changing your search or filters.
                        </p>

                    </div>

                )}



                {/* =======================================================
                    FOOTER
                ======================================================== */}

                <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">

                    <p className="text-sm text-gray-500 dark:text-gray-400">

                        Showing{" "}

                        <span className="font-medium text-gray-900 dark:text-white">
                            {filteredOrders.length}
                        </span>{" "}

                        of{" "}

                        <span className="font-medium text-gray-900 dark:text-white">
                            {orders.length}
                        </span>{" "}

                        orders

                    </p>

                </div>

            </div>

        </div>
    );
};


export default Orders;