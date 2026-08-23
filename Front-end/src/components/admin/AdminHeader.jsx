import React, { useEffect, useState } from "react";

const AdminHeader = ({ setSidebarOpen }) => {
  const [darkMode, setDarkMode] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load saved theme
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");

    const isDark = savedTheme === "dark";

    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Toggle Theme
  |--------------------------------------------------------------------------
  */

  const toggleDarkMode = () => {
    setDarkMode((current) => {
      const newMode = !current;

      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("admin-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("admin-theme", "light");
      }

      return newMode;
    });
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-16
        items-center
        justify-between
        border-b
        border-gray-200
        bg-white
        px-4
        dark:border-gray-800
        dark:bg-gray-900
        sm:px-6
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            text-xl
            hover:bg-gray-100
            dark:hover:bg-gray-800
            lg:hidden
          "
        >
          ☰
        </button>

        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>

          <p className="hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
            Manage your store
          </p>
        </div>

      </div>


      {/* RIGHT */}

      <div className="flex items-center gap-3">

        {/* DARK MODE */}

        <button
          type="button"
          onClick={toggleDarkMode}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            border
            border-gray-300
            bg-white
            text-lg
            hover:bg-gray-100
            dark:border-gray-700
            dark:bg-gray-800
            dark:hover:bg-gray-700
          "
        >
          {darkMode ? "☀️" : "🌙"}
        </button>


        {/* NOTIFICATION */}

        <button
          type="button"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-lg
            hover:bg-gray-100
            dark:hover:bg-gray-800
          "
        >
          🔔
        </button>


        {/* ADMIN */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-black
              text-sm
              font-semibold
              text-white
              dark:bg-white
              dark:text-black
            "
          >
            A
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Admin
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminHeader;