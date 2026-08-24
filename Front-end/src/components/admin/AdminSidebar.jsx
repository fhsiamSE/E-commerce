import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
}) => {

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: "🛍️",
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: "📦",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: "⭐",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ];


  const handleNavigation = () => {

    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }

  };


  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            lg:hidden
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-64
          flex-col
          border-r
          border-gray-200
          bg-white
          transition-transform
          duration-300
          dark:border-gray-800
          dark:bg-gray-900

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* ===================================================
            LOGO
        ==================================================== */}

        <div
          className="
            flex
            h-16
            items-center
            justify-between
            border-b
            border-gray-200
            px-5
            dark:border-gray-800
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-black
                text-sm
                font-bold
                text-white
                dark:bg-white
                dark:text-black
              "
            >
              E
            </div>

            <div>

              <h2
                className="
                  text-sm
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                E-Commerce
              </h2>

              <p
                className="
                  text-[10px]
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Admin Panel
              </p>

            </div>

          </div>


          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-lg
              hover:bg-gray-100
              dark:hover:bg-gray-800
              lg:hidden
            "
          >
            ✕
          </button>

        </div>


        {/* ===================================================
            NAVIGATION
        ==================================================== */}

        <nav
          className="
            flex-1
            overflow-y-auto
            p-4
          "
        >

          <p
            className="
              mb-3
              px-3
              text-[11px]
              font-semibold
              uppercase
              tracking-wider
              text-gray-400
              dark:text-gray-500
            "
          >
            Main Menu
          </p>


          <div className="space-y-1">

            {navigation.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={handleNavigation}
                className={({ isActive }) =>
                  `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      isActive
                        ? `
                          bg-black
                          text-white
                          dark:bg-white
                          dark:text-black
                        `
                        : `
                          text-gray-600
                          hover:bg-gray-100
                          hover:text-gray-900
                          dark:text-gray-300
                          dark:hover:bg-gray-800
                          dark:hover:text-white
                        `
                    }
                  `
                }
              >

                <span
                  className="
                    w-5
                    text-center
                    text-base
                  "
                >
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </NavLink>

            ))}

          </div>


          {/* =================================================
              PRODUCT ACTION
          ================================================== */}

          <div className="mt-8">

            <p
              className="
                mb-3
                px-3
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
                dark:text-gray-500
              "
            >
              Product Actions
            </p>


            <NavLink
              to="/admin/products/add"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition

                  ${
                    isActive
                      ? `
                        bg-black
                        text-white
                        dark:bg-white
                        dark:text-black
                      `
                      : `
                        text-gray-600
                        hover:bg-gray-100
                        hover:text-gray-900
                        dark:text-gray-300
                        dark:hover:bg-gray-800
                        dark:hover:text-white
                      `
                  }
                `
              }
            >

              <span className="w-5 text-center">
                ➕
              </span>

              <span>
                Add Product
              </span>

            </NavLink>

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <div className="mt-8">

            <p
              className="
                mb-3
                px-3
                text-[11px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
                dark:text-gray-500
              "
            >
              Quick Links
            </p>


            <NavLink
              to="/"
              onClick={handleNavigation}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                border
                border-gray-200
                px-3
                py-3
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-100
                dark:border-gray-700
                dark:text-gray-300
                dark:hover:bg-gray-800
              "
            >

              <span className="w-5 text-center">
                🏪
              </span>

              <span>
                View Store
              </span>

            </NavLink>

          </div>

        </nav>


        {/* ===================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            border-t
            border-gray-200
            p-4
            dark:border-gray-800
          "
        >

          <div
            className="
              rounded-lg
              bg-gray-50
              p-3
              dark:bg-gray-800
            "
          >

            <p
              className="
                text-xs
                font-medium
                text-gray-900
                dark:text-white
              "
            >
              Admin Panel
            </p>

            <p
              className="
                mt-1
                text-[11px]
                text-gray-500
                dark:text-gray-400
              "
            >
              Manage your online store
            </p>

          </div>

        </div>

      </aside>
    </>
  );
};

export default AdminSidebar;

