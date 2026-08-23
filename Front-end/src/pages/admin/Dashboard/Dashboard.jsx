import React from "react";

const Dashboard = () => {
  const cards = [
    {
      title: "Total Products",
      value: "128",
      icon: "🛍️",
      change: "+12%",
    },
    {
      title: "Total Orders",
      value: "356",
      icon: "📦",
      change: "+8%",
    },
    {
      title: "Total Users",
      value: "1,248",
      icon: "👥",
      change: "+18%",
    },
    {
      title: "Total Reviews",
      value: "842",
      icon: "⭐",
      change: "+6%",
    },
  ];

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
              transition-colors
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
                  {card.value}
                </h2>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
                {card.icon}
              </div>

            </div>


            <p className="mt-4 text-xs text-green-600">
              {card.change} from last month
            </p>

          </div>

        ))}

      </div>


      {/* =====================================================
          LOWER SECTION
      ====================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* RECENT ORDERS */}

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

            <button className="text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              View all
            </button>

          </div>


          <div className="mt-5 space-y-4">

            {[1, 2, 3, 4].map((order) => (

              <div
                key={order}
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                  pb-4
                  last:border-0
                  dark:border-gray-800
                "
              >

                <div>

                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order #100{order}
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Customer {order}
                  </p>

                </div>


                <div className="text-right">

                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    ৳{(1200 * order).toLocaleString()}
                  </p>

                  <span className="text-xs text-green-600">
                    Completed
                  </span>

                </div>

              </div>

            ))}

          </div>

        </div>


        {/* QUICK OVERVIEW */}

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


          <div className="mt-6 space-y-5">

            <div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Products
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  128
                </span>

              </div>

              <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800">

                <div className="h-2 w-[70%] rounded-full bg-black dark:bg-white" />

              </div>

            </div>


            <div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Orders
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  356
                </span>

              </div>

              <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800">

                <div className="h-2 w-[55%] rounded-full bg-black dark:bg-white" />

              </div>

            </div>


            <div>

              <div className="flex justify-between text-sm">

                <span className="text-gray-600 dark:text-gray-400">
                  Users
                </span>

                <span className="font-medium text-gray-900 dark:text-white">
                  1,248
                </span>

              </div>

              <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-800">

                <div className="h-2 w-[85%] rounded-full bg-black dark:bg-white" />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;