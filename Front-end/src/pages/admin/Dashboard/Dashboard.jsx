import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAdminDashboard } from "../../../store/adminSlice";


const Dashboard = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();


  /*
  |--------------------------------------------------------------------------
  | REDUX
  |--------------------------------------------------------------------------
  */

  const {
    dashboard,
    loading,
    error,
  } = useSelector((state) => state.admin);


  /*
  |--------------------------------------------------------------------------
  | LOAD DASHBOARD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    dispatch(getAdminDashboard());
  }, [dispatch]);


  /*
  |--------------------------------------------------------------------------
  | DASHBOARD DATA
  |--------------------------------------------------------------------------
  */

  const totalProducts =
    dashboard?.totalProducts ?? 0;

  const totalOrders =
    dashboard?.totalOrders ?? 0;

  const totalUsers =
    dashboard?.totalUsers ?? 0;

  const totalReviews =
    dashboard?.totalReviews ?? 0;

  const pendingOrders =
    dashboard?.pendingOrders ?? 0;

  const completedOrders =
    dashboard?.completedOrders ?? 0;

  const cancelledOrders =
    dashboard?.cancelledOrders ?? 0;

  const lowStockProducts =
    dashboard?.lowStockProducts ?? 0;

  const outOfStockProducts =
    dashboard?.outOfStockProducts ?? 0;

  const recentOrders =
    dashboard?.recentOrders || [];


  /*
  |--------------------------------------------------------------------------
  | STAT CARDS
  |--------------------------------------------------------------------------
  */

  const cards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: "🛍️",
    },

    {
      title: "Total Orders",
      value: totalOrders,
      icon: "📦",
    },

    {
      title: "Total Users",
      value: totalUsers,
      icon: "👥",
    },

    {
      title: "Total Reviews",
      value: totalReviews,
      icon: "⭐",
    },
  ];


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">

        <div className="text-center">

          <div
            className="
              mx-auto
              h-10
              w-10
              animate-spin
              rounded-full
              border-4
              border-gray-200
              border-t-black
              dark:border-gray-700
              dark:border-t-white
            "
          />

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Loading dashboard...
          </p>

        </div>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">

        <h2 className="font-semibold text-red-600 dark:text-red-400">
          Failed to load dashboard
        </h2>

        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
          {error}
        </p>

        <button
          onClick={() => dispatch(getAdminDashboard())}
          className="
            mt-4
            rounded-lg
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            dark:bg-white
            dark:text-black
          "
        >
          Try Again
        </button>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | STATUS BADGE
  |--------------------------------------------------------------------------
  */

  const getStatusStyle = (status) => {

    switch (status?.toLowerCase()) {

      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";

      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";

      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div>

      {/* =====================================================
          TITLE
      ====================================================== */}

      <div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back. Here's what's happening with your store.
        </p>

      </div>


      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (

          <div
            key={card.title}
            className="
              rounded-xl
              border
              border-gray-200
              bg-white
              p-5
              shadow-sm
              transition
              hover:shadow-md
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.title}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {Number(card.value).toLocaleString()}
                </h2>

              </div>


              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-lg
                  bg-gray-100
                  text-xl
                  dark:bg-gray-800
                "
              >
                {card.icon}
              </div>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================================
          ORDER STATUS
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Pending */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pending Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {pendingOrders}
          </p>

        </div>


        {/* Completed */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Completed Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {completedOrders}
          </p>

        </div>


        {/* Cancelled */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Cancelled Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {cancelledOrders}
          </p>

        </div>

      </div>


      {/* =====================================================
          LOWER SECTION
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* ===================================================
            RECENT ORDERS
        ==================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <div className="flex items-center justify-between">

            <h2 className="font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>

            <button
              onClick={() => navigate("/admin/orders")}
              className="
                text-sm
                text-gray-500
                transition
                hover:text-black
                dark:text-gray-400
                dark:hover:text-white
              "
            >
              View all
            </button>

          </div>


          <div className="mt-5">

            {recentOrders.length === 0 ? (

              <div className="py-10 text-center">

                <div className="text-3xl">
                  📦
                </div>

                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                  No recent orders
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {recentOrders.map((order) => (

                  <div
                    key={order.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-4
                      border-b
                      border-gray-100
                      pb-4
                      last:border-0
                      dark:border-gray-800
                    "
                  >

                    {/* Customer */}

                    <div className="min-w-0">

                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Order #{order.id}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                        {order.user?.name || "Unknown customer"}
                      </p>

                    </div>


                    {/* Amount */}

                    <div className="text-right">

                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ৳{Number(order.total || 0).toLocaleString()}
                      </p>

                      <span
                        className={`
                          mt-1
                          inline-block
                          rounded-full
                          px-2
                          py-1
                          text-[11px]
                          font-medium
                          ${getStatusStyle(order.status)}
                        `}
                      >
                        {order.status || "Unknown"}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* ===================================================
            STORE OVERVIEW
        ==================================================== */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-gray-800
            dark:bg-gray-900
          "
        >

          <h2 className="font-semibold text-gray-900 dark:text-white">
            Store Overview
          </h2>


          <div className="mt-6 space-y-6">


            {/* Products */}

            <div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Products
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  {Number(totalProducts).toLocaleString()}
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">

                <div
                  className="h-full rounded-full bg-black dark:bg-white"
                  style={{
                    width:
                      totalProducts > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* Orders */}

            <div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Orders
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  {Number(totalOrders).toLocaleString()}
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">

                <div
                  className="h-full rounded-full bg-black dark:bg-white"
                  style={{
                    width:
                      totalOrders > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* Users */}

            <div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Users
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  {Number(totalUsers).toLocaleString()}
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">

                <div
                  className="h-full rounded-full bg-black dark:bg-white"
                  style={{
                    width:
                      totalUsers > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>


            {/* Reviews */}

            <div>

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Reviews
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  {Number(totalReviews).toLocaleString()}
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">

                <div
                  className="h-full rounded-full bg-black dark:bg-white"
                  style={{
                    width:
                      totalReviews > 0
                        ? "100%"
                        : "0%",
                  }}
                />

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};


export default Dashboard;