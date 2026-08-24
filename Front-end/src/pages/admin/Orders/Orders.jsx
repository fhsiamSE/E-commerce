import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  /*
  |--------------------------------------------------------------------------
  | DEMO ORDERS
  |--------------------------------------------------------------------------
  | Replace this with API data later.
  */

  const [orders] = useState([
    {
      id: "ORD-1001",
      customer: "Faisal Hossain",
      email: "faisal@example.com",
      items: 3,
      total: 4200,
      payment: "Paid",
      status: "Delivered",
      date: "2026-08-22",
    },
    {
      id: "ORD-1002",
      customer: "Rahim Ahmed",
      email: "rahim@example.com",
      items: 2,
      total: 2800,
      payment: "Paid",
      status: "Processing",
      date: "2026-08-21",
    },
    {
      id: "ORD-1003",
      customer: "Nusrat Jahan",
      email: "nusrat@example.com",
      items: 1,
      total: 1500,
      payment: "Pending",
      status: "Pending",
      date: "2026-08-21",
    },
    {
      id: "ORD-1004",
      customer: "Sakib Khan",
      email: "sakib@example.com",
      items: 4,
      total: 6200,
      payment: "Paid",
      status: "Shipped",
      date: "2026-08-20",
    },
    {
      id: "ORD-1005",
      customer: "Sumaiya Akter",
      email: "sumaiya@example.com",
      items: 2,
      total: 3100,
      payment: "Failed",
      status: "Cancelled",
      date: "2026-08-19",
    },
    {
      id: "ORD-1006",
      customer: "Tanvir Hasan",
      email: "tanvir@example.com",
      items: 5,
      total: 8500,
      payment: "Paid",
      status: "Delivered",
      date: "2026-08-18",
    },
    {
      id: "ORD-1007",
      customer: "Mim Rahman",
      email: "mim@example.com",
      items: 2,
      total: 2400,
      payment: "Paid",
      status: "Processing",
      date: "2026-08-17",
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | FILTER STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics = useMemo(() => {
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (order) => order.status === "Pending"
    ).length;

    const processingOrders = orders.filter(
      (order) => order.status === "Processing"
    ).length;

    const deliveredOrders = orders.filter(
      (order) => order.status === "Delivered"
    ).length;

    const revenue = orders
      .filter((order) => order.payment === "Paid")
      .reduce((sum, order) => sum + Number(order.total), 0);

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
  | FILTER ORDERS
  |--------------------------------------------------------------------------
  */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        order.id.toLowerCase().includes(searchValue) ||
        order.customer.toLowerCase().includes(searchValue) ||
        order.email.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        order.payment === paymentFilter;

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
  | STATUS STYLE
  |--------------------------------------------------------------------------
  */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400";

      case "Processing":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";

      case "Shipped":
        return "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";

      case "Pending":
        return "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";

      case "Cancelled":
        return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAYMENT STYLE
  |--------------------------------------------------------------------------
  */

  const getPaymentStyle = (payment) => {
    switch (payment) {
      case "Paid":
        return "text-green-600 dark:text-green-400";

      case "Pending":
        return "text-yellow-600 dark:text-yellow-400";

      case "Failed":
        return "text-red-600 dark:text-red-400";

      default:
        return "text-gray-500";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | VIEW ORDER
  |--------------------------------------------------------------------------
  */

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

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
          onClick={() => window.location.reload()}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          ↻ Refresh
        </button>

      </div>


      {/* =========================================================
          STATISTICS
      ========================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {/* Total */}

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

          <p className="mt-1 text-xs text-gray-500">
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

          <p className="mt-1 text-xs text-yellow-600">
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

          <p className="mt-1 text-xs text-blue-600">
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

          <p className="mt-1 text-xs text-green-600">
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

          <p className="mt-1 text-xs text-gray-500">
            From paid orders
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

              {filteredOrders.map((order) => (

                <tr
                  key={order.id}
                  className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >

                  {/* Order */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {order.id}
                    </p>

                  </td>


                  {/* Customer */}

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {order.customer
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>

                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.customer}
                        </p>

                        <p className="text-xs text-gray-500">
                          {order.email}
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* Items */}

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {order.items} items
                  </td>


                  {/* Total */}

                  <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    ৳{order.total.toLocaleString()}
                  </td>


                  {/* Payment */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <span
                      className={`text-sm font-medium ${getPaymentStyle(
                        order.payment
                      )}`}
                    >
                      {order.payment}
                    </span>

                  </td>


                  {/* Status */}

                  <td className="whitespace-nowrap px-6 py-4">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </td>


                  {/* Date */}

                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {order.date}
                  </td>


                  {/* Action */}

                  <td className="whitespace-nowrap px-6 py-4 text-right">

                    <button
                      type="button"
                      onClick={() =>
                        handleViewOrder(order.id)
                      }
                      className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-black hover:text-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white dark:hover:text-black"
                    >
                      View
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>


        {/* =======================================================
            MOBILE ORDERS
        ======================================================== */}

        <div className="divide-y divide-gray-100 md:hidden dark:divide-gray-800">

          {filteredOrders.map((order) => (

            <div
              key={order.id}
              className="p-4"
            >

              <div className="flex items-start justify-between gap-3">

                <div>

                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {order.date}
                  </p>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>


              <div className="mt-4 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold dark:bg-gray-800 dark:text-gray-300">
                  {order.customer
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {order.customer}
                  </p>

                  <p className="text-xs text-gray-500">
                    {order.email}
                  </p>

                </div>

              </div>


              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">

                  <p className="text-xs text-gray-500">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {order.items}
                  </p>

                </div>


                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">

                  <p className="text-xs text-gray-500">
                    Total
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    ৳{order.total.toLocaleString()}
                  </p>

                </div>

              </div>


              <div className="mt-4 flex items-center justify-between">

                <span
                  className={`text-sm font-medium ${getPaymentStyle(
                    order.payment
                  )}`}
                >
                  {order.payment}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    handleViewOrder(order.id)
                  }
                  className="rounded-lg bg-black px-4 py-2 text-xs font-medium text-white dark:bg-white dark:text-black"
                >
                  View Order
                </button>

              </div>

            </div>

          ))}

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

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

          </div>

        )}

        {/* =======================================================
            FOOTER
        ======================================================== */}

        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">

          <p className="text-sm text-gray-500">
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

