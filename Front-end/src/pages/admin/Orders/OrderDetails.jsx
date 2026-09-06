import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../../api/axios.js";

const OrderDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    /*
    |--------------------------------------------------------------------------
    | State
    |--------------------------------------------------------------------------
    */

    const [order, setOrder] = useState(null);
    const [assignees, setAssignees] = useState([]);

    const [loading, setLoading] = useState(true);
    const [assigneesLoading, setAssigneesLoading] = useState(true);

    const [statusUpdating, setStatusUpdating] = useState(false);
    const [assigneeUpdating, setAssigneeUpdating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Image URL
    |--------------------------------------------------------------------------
    */

    const getImageUrl = (image) => {
        if (!image) {
            return null;
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        return `http://127.0.0.1:8000/storage/${image.replace(
            /^\/+/,
            ""
        )}`;
    };

    /*
    |--------------------------------------------------------------------------
    | Fetch Order
    |--------------------------------------------------------------------------
    */

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/admin/orders/${id}`
            );

            const orderData =
                response.data?.data ||
                response.data?.order ||
                response.data;

            setOrder(orderData);
        } catch (err) {
            console.error(
                "Failed to load order:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load order details."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Fetch Admin + Employee
    |--------------------------------------------------------------------------
    */

    const fetchAssignees = async () => {
        try {
            setAssigneesLoading(true);

            const response = await api.get(
                "/admin/assignees"
            );

            const users =
                response.data?.data ||
                response.data?.users ||
                [];

            const filteredUsers = users.filter(
                (user) => {
                    const role = String(
                        user.role || ""
                    ).toLowerCase();

                    return (
                        role === "admin" ||
                        role === "employee"
                    );
                }
            );

            setAssignees(filteredUsers);
        } catch (err) {
            console.error(
                "Failed to load assignees:",
                err
            );
        } finally {
            setAssigneesLoading(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Initial Load
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        if (!id) {
            return;
        }

        fetchOrder();
        fetchAssignees();
    }, [id]);

    /*
    |--------------------------------------------------------------------------
    | Update Status
    |--------------------------------------------------------------------------
    */

    const handleStatusChange = async (event) => {
        const newStatus = event.target.value;

        if (!newStatus || !order) {
            return;
        }

        try {
            setStatusUpdating(true);
            setError("");
            setSuccess("");

            const response = await api.patch(
                `/admin/orders/${id}/status`,
                {
                    status: newStatus,
                }
            );

            const updatedOrder =
                response.data?.data;

            if (updatedOrder) {
                setOrder(updatedOrder);
            } else {
                setOrder((previous) => ({
                    ...previous,
                    status: newStatus,
                }));
            }

            setSuccess(
                "Order status updated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update status:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update order status."
            );
        } finally {
            setStatusUpdating(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Update Assignee
    |--------------------------------------------------------------------------
    */

    const handleAssigneeChange = async (event) => {
        const assigneeId =
            event.target.value;

        if (!order) {
            return;
        }

        try {
            setAssigneeUpdating(true);
            setError("");
            setSuccess("");

            const response = await api.patch(
                `/admin/orders/${id}/assignee`,
                {
                    assigned_to:
                        assigneeId || null,
                }
            );

            const updatedOrder =
                response.data?.data;

            if (updatedOrder) {
                setOrder(updatedOrder);
            } else {
                const selectedAssignee =
                    assignees.find(
                        (user) =>
                            String(user.id) ===
                            String(assigneeId)
                    );

                setOrder((previous) => ({
                    ...previous,
                    assigned_to:
                        assigneeId || null,
                    assignee:
                        selectedAssignee || null,
                }));
            }

            setSuccess(
                assigneeId
                    ? "Order assigned successfully."
                    : "Order unassigned successfully."
            );
        } catch (err) {
            console.error(
                "Failed to assign order:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to assign order."
            );
        } finally {
            setAssigneeUpdating(false);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Customer Information
    |--------------------------------------------------------------------------
    */

    const getCustomerName = () => {
        return (
            order?.user?.name ||
            "Unknown Customer"
        );
    };

    const getCustomerEmail = () => {
        return (
            order?.user?.email ||
            "-"
        );
    };

    const getCustomerPhone = () => {
        return (
            order?.user?.phone_number ||
            "-"
        );
    };

    const getCustomerAddress = () => {
        return (
            order?.user?.address ||
            "-"
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Initials
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
    | Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
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

    const formatDateTime = (date) => {
        if (!date) {
            return "-";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "-";
        }

        return parsedDate.toLocaleString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Product Information
    |--------------------------------------------------------------------------
    */

    const getItemProductName = (item) => {
        return (
            item?.product?.product_name ||
            item?.product?.name ||
            item?.product_name ||
            item?.name ||
            "Product"
        );
    };

    const getItemImage = (item) => {
        return (
            item?.product?.images?.find(
                (image) => image.is_primary
            )?.image ||
            item?.product?.images?.[0]?.image ||
            item?.image ||
            item?.product_image ||
            null
        );
    };

    const getItemPrice = (item) => {
        return Number(
            item?.price ||
            item?.unit_price ||
            item?.product?.price ||
            0
        );
    };

    const getItemQuantity = (item) => {
        return Number(
            item?.quantity || 0
        );
    };

    const getItemSize = (item) => {
        return (
            item?.size ||
            item?.variant?.size ||
            item?.product_variant?.size ||
            "-"
        );
    };

    const getItemColor = (item) => {
        return (
            item?.color ||
            item?.variant?.color ||
            item?.product_variant?.color ||
            "-"
        );
    };

    const getItemSku = (item) => {
        return (
            item?.sku ||
            item?.variant?.sku ||
            item?.product_variant?.sku ||
            "-"
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Order Items
    |--------------------------------------------------------------------------
    */

    const orderItems = useMemo(() => {
        if (
            Array.isArray(order?.items)
        ) {
            return order.items;
        }

        if (
            Array.isArray(order?.order_items)
        ) {
            return order.order_items;
        }

        return [];
    }, [order]);

    /*
    |--------------------------------------------------------------------------
    | Order Summary
    |--------------------------------------------------------------------------
    */

    const subtotal = useMemo(() => {
        if (
            order?.subtotal !== undefined &&
            order?.subtotal !== null
        ) {
            return Number(order.subtotal);
        }

        return orderItems.reduce(
            (sum, item) =>
                sum +
                getItemPrice(item) *
                    getItemQuantity(item),
            0
        );
    }, [order, orderItems]);

    /*
    |--------------------------------------------------------------------------
    | Shipping Removed
    |--------------------------------------------------------------------------
    |
    | Shipping is intentionally not used here.
    |
    */

    const discount = Number(
        order?.discount || 0
    );

    /*
    |--------------------------------------------------------------------------
    | Total
    |--------------------------------------------------------------------------
    |
    | Total = Subtotal - Discount
    |
    */

    const total = Number(
        order?.total ??
        subtotal - discount
    );

    /*
    |--------------------------------------------------------------------------
    | Current Assignee
    |--------------------------------------------------------------------------
    */

    const currentAssigneeId =
        order?.assigned_to ??
        order?.assignee_id ??
        order?.assignee?.id ??
        order?.assigned_user?.id ??
        "";

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
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
                <div className="flex min-h-[500px] items-center justify-center">
                    <div className="text-center">

                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white" />

                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Loading order details...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error && !order) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
                <div className="flex min-h-[500px] items-center justify-center">

                    <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center dark:border-red-900 dark:bg-gray-900">

                        <div className="text-4xl">
                            ⚠️
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                            Failed to load order
                        </h3>

                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={fetchOrder}
                            className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        >
                            Try Again
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Main UI
    |--------------------------------------------------------------------------
    */

    return (
        <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

            {/* =========================================================
                HEADER
            ========================================================== */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                        className="mb-3 text-sm font-medium text-gray-500 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        ← Back to Orders
                    </button>

                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Order #{order?.id}
                        </h1>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                order?.status
                            )}`}
                        >
                            {order?.status ||
                                "Unknown"}
                        </span>

                    </div>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Placed on{" "}
                        {formatDateTime(
                            order?.created_at
                        )}
                    </p>

                </div>

            </div>

            {/* =========================================================
                SUCCESS MESSAGE
            ========================================================== */}

            {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-500/10 dark:text-green-400">
                    {success}
                </div>
            )}

            {/* =========================================================
                ERROR MESSAGE
            ========================================================== */}

            {error && order && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-500/10 dark:text-red-400">
                    {error}
                </div>
            )}

            {/* =========================================================
                MAIN GRID
            ========================================================== */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* =====================================================
                    LEFT SIDE
                ====================================================== */}

                <div className="space-y-6 xl:col-span-2">

                    {/* =================================================
                        ORDER ITEMS
                    ================================================== */}

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">

                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Order Items
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                {orderItems.length}{" "}
                                {orderItems.length === 1
                                    ? "product"
                                    : "products"}
                            </p>

                        </div>

                        <div className="divide-y divide-gray-100 dark:divide-gray-800">

                            {orderItems.length > 0 ? (
                                orderItems.map(
                                    (item, index) => {

                                        const image =
                                            getItemImage(
                                                item
                                            );

                                        const imageUrl =
                                            getImageUrl(
                                                image
                                            );

                                        const price =
                                            getItemPrice(
                                                item
                                            );

                                        const quantity =
                                            getItemQuantity(
                                                item
                                            );

                                        const itemTotal =
                                            price *
                                            quantity;

                                        return (
                                            <div
                                                key={
                                                    item.id ||
                                                    index
                                                }
                                                className="p-5"
                                            >

                                                <div className="flex gap-4">

                                                    {/* Product Image */}

                                                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">

                                                        {imageUrl ? (
                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={getItemProductName(
                                                                    item
                                                                )}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                                                No Image
                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* Product Info */}

                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                                            <div>

                                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                    {getItemProductName(
                                                                        item
                                                                    )}
                                                                </h3>

                                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                                    SKU:{" "}
                                                                    {getItemSku(
                                                                        item
                                                                    )}
                                                                </p>

                                                            </div>

                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                ৳
                                                                {itemTotal.toLocaleString()}
                                                            </p>

                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-2">

                                                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                                Qty:{" "}
                                                                {quantity}
                                                            </span>

                                                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                                Size:{" "}
                                                                {getItemSize(
                                                                    item
                                                                )}
                                                            </span>

                                                            <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                                Color:{" "}
                                                                {getItemColor(
                                                                    item
                                                                )}
                                                            </span>

                                                        </div>

                                                        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">

                                                            Unit price:{" "}

                                                            <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                ৳
                                                                {price.toLocaleString()}
                                                            </span>

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>
                                        );
                                    }
                                )
                            ) : (
                                <div className="px-5 py-12 text-center">

                                    <div className="text-4xl">
                                        📦
                                    </div>

                                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                        No order items found.
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        CUSTOMER INFORMATION
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">

                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Customer Information
                            </h2>

                        </div>

                        <div className="p-5">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                    {getInitials(
                                        getCustomerName()
                                    )}
                                </div>

                                <div>

                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {getCustomerName()}
                                    </p>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Customer
                                    </p>

                                </div>

                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

                                {/* Email */}

                                <div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Email
                                    </p>

                                    <p className="mt-1 break-all text-sm text-gray-900 dark:text-white">
                                        {getCustomerEmail()}
                                    </p>

                                </div>

                                {/* Phone */}

                                <div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {getCustomerPhone()}
                                    </p>

                                </div>

                                {/* Address */}

                                <div className="sm:col-span-2">

                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Address
                                    </p>

                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {getCustomerAddress()}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    RIGHT SIDE
                ====================================================== */}

                <div className="space-y-6">

                    {/* =================================================
                        ORDER MANAGEMENT
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">

                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Order Management
                            </h2>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Update order status and assignee.
                            </p>

                        </div>

                        <div className="space-y-5 p-5">

                            {/* Status */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Order Status
                                </label>

                                <select
                                    value={
                                        order?.status ||
                                        "pending"
                                    }
                                    onChange={
                                        handleStatusChange
                                    }
                                    disabled={
                                        statusUpdating
                                    }
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus:border-white"
                                >

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="processing">
                                        Processing
                                    </option>

                                    <option value="delivered">
                                        Delivered
                                    </option>

                                    <option value="cancelled">
                                        Cancelled
                                    </option>

                                </select>

                                {statusUpdating && (
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Updating status...
                                    </p>
                                )}

                            </div>

                            {/* Assignee */}

                            <div>

                                <label className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300">
                                    Assign Order
                                </label>

                                <select
                                    value={
                                        currentAssigneeId
                                    }
                                    onChange={
                                        handleAssigneeChange
                                    }
                                    disabled={
                                        assigneesLoading ||
                                        assigneeUpdating
                                    }
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-black disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus:border-white"
                                >

                                    <option value="">
                                        Unassigned
                                    </option>

                                    {assignees.map(
                                        (user) => (
                                            <option
                                                key={
                                                    user.id
                                                }
                                                value={
                                                    user.id
                                                }
                                            >
                                                {user.name} (
                                                {
                                                    user.role
                                                }
                                                )
                                            </option>
                                        )
                                    )}

                                </select>

                                {assigneesLoading && (
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Loading assignees...
                                    </p>
                                )}

                                {assigneeUpdating && (
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Assigning order...
                                    </p>
                                )}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        ORDER SUMMARY
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">

                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Order Summary
                            </h2>

                        </div>

                        <div className="space-y-3 p-5">

                            {/* Subtotal */}

                            <div className="flex items-center justify-between text-sm">

                                <span className="text-gray-500 dark:text-gray-400">
                                    Subtotal
                                </span>

                                <span className="font-medium text-gray-900 dark:text-white">
                                    ৳
                                    {subtotal.toLocaleString()}
                                </span>

                            </div>

                            {/* Discount */}

                            <div className="flex items-center justify-between text-sm">

                                <span className="text-gray-500 dark:text-gray-400">
                                    Discount
                                </span>

                                <span className="font-medium text-gray-900 dark:text-white">
                                    - ৳
                                    {discount.toLocaleString()}
                                </span>

                            </div>

                            {/* Total */}

                            <div className="border-t border-gray-200 pt-3 dark:border-gray-800">

                                <div className="flex items-center justify-between">

                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Total
                                    </span>

                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                        ৳
                                        {total.toLocaleString()}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        ORDER INFORMATION
                    ================================================== */}

                    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-800">

                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Order Information
                            </h2>

                        </div>

                        <div className="space-y-4 p-5">

                            <div className="flex items-center justify-between">

                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Order ID
                                </span>

                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    #{order?.id}
                                </span>

                            </div>

                            <div className="flex items-center justify-between">

                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Status
                                </span>

                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
                                        order?.status
                                    )}`}
                                >
                                    {order?.status ||
                                        "Unknown"}
                                </span>

                            </div>

                            <div className="flex items-center justify-between">

                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Created
                                </span>

                                <span className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(
                                        order?.created_at
                                    )}
                                </span>

                            </div>

                            {order?.updated_at && (
                                <div className="flex items-center justify-between">

                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        Last Updated
                                    </span>

                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {formatDate(
                                            order.updated_at
                                        )}
                                    </span>

                                </div>
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default OrderDetails;

