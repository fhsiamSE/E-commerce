import React, { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const [settings, setSettings] = useState({
    storeName: "E-Commerce",
    storeEmail: "admin@example.com",
    phone: "+880 1XXXXXXXXX",
    address: "Dhaka, Bangladesh",

    currency: "BDT",
    timezone: "Asia/Dhaka",

    orderEmail: true,
    reviewEmail: true,
    lowStockEmail: true,

    maintenanceMode: false,
  });

  const handleChange = (field, value) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("Settings:", settings);

    alert("Settings saved successfully.");
  };

  const tabs = [
    {
      id: "general",
      name: "General",
      icon: "⚙️",
    },
    {
      id: "store",
      name: "Store",
      icon: "🏪",
    },
    {
      id: "notifications",
      name: "Notifications",
      icon: "🔔",
    },
    {
      id: "security",
      name: "Security",
      icon: "🔒",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">

      {/* =========================================================
          HEADER
      ========================================================== */}

      <div className="mb-8">

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your store settings and preferences.
        </p>

      </div>


      {/* =========================================================
          SETTINGS CONTAINER
      ========================================================== */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">


        {/* =======================================================
            SIDEBAR
        ======================================================== */}

        <div className="h-fit rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">

          {tabs.map((tab) => (

            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                text-left
                text-sm
                font-medium
                transition

                ${
                  activeTab === tab.id
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }
              `}
            >

              <span className="text-base">
                {tab.icon}
              </span>

              <span>
                {tab.name}
              </span>

            </button>

          ))}

        </div>


        {/* =======================================================
            CONTENT
        ======================================================== */}

        <div className="space-y-6">


          {/* =====================================================
              GENERAL
          ====================================================== */}

          {activeTab === "general" && (

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 p-6 dark:border-gray-800">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  General Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Basic information about your store.
                </p>

              </div>


              <div className="space-y-6 p-6">


                {/* Store Name */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Store Name
                  </label>

                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) =>
                      handleChange(
                        "storeName",
                        e.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                      dark:focus:border-white
                    "
                  />

                </div>


                {/* Email */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Store Email
                  </label>

                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) =>
                      handleChange(
                        "storeEmail",
                        e.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      text-sm
                      text-gray-900
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                      dark:focus:border-white
                    "
                  />

                </div>


                {/* Phone */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) =>
                      handleChange(
                        "phone",
                        e.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      text-sm
                      text-gray-900
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                      dark:focus:border-white
                    "
                  />

                </div>


                {/* Address */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Store Address
                  </label>

                  <textarea
                    rows={4}
                    value={settings.address}
                    onChange={(e) =>
                      handleChange(
                        "address",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      p-4
                      text-sm
                      text-gray-900
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                      dark:focus:border-white
                    "
                  />

                </div>

              </div>

            </div>

          )}


          {/* =====================================================
              STORE SETTINGS
          ====================================================== */}

          {activeTab === "store" && (

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 p-6 dark:border-gray-800">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Store Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Configure currency and regional settings.
                </p>

              </div>


              <div className="space-y-6 p-6">


                {/* Currency */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency
                  </label>

                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      handleChange(
                        "currency",
                        e.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      text-sm
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                      dark:focus:border-white
                    "
                  >

                    <option value="BDT">
                      BDT - Bangladeshi Taka
                    </option>

                    <option value="USD">
                      USD - US Dollar
                    </option>

                    <option value="EUR">
                      EUR - Euro
                    </option>

                    <option value="JPY">
                      JPY - Japanese Yen
                    </option>

                  </select>

                </div>


                {/* Timezone */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Timezone
                  </label>

                  <select
                    value={settings.timezone}
                    onChange={(e) =>
                      handleChange(
                        "timezone",
                        e.target.value
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      text-sm
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                      dark:focus:border-white
                    "
                  >

                    <option value="Asia/Dhaka">
                      Asia/Dhaka
                    </option>

                    <option value="Asia/Tokyo">
                      Asia/Tokyo
                    </option>

                    <option value="Asia/Singapore">
                      Asia/Singapore
                    </option>

                    <option value="UTC">
                      UTC
                    </option>

                  </select>

                </div>


                {/* Maintenance */}

                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">

                  <div>

                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Maintenance Mode
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Temporarily disable your store for customers.
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      handleChange(
                        "maintenanceMode",
                        !settings.maintenanceMode
                      )
                    }
                    className={`
                      relative
                      h-6
                      w-11
                      rounded-full
                      transition

                      ${
                        settings.maintenanceMode
                          ? "bg-black dark:bg-white"
                          : "bg-gray-300 dark:bg-gray-700"
                      }
                    `}
                  >

                    <span
                      className={`
                        absolute
                        top-1
                        h-4
                        w-4
                        rounded-full
                        bg-white
                        transition
                        dark:bg-black

                        ${
                          settings.maintenanceMode
                            ? "left-6"
                            : "left-1"
                        }
                      `}
                    />

                  </button>

                </div>

              </div>

            </div>

          )}


          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}

          {activeTab === "notifications" && (

            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

              <div className="border-b border-gray-200 p-6 dark:border-gray-800">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose which email notifications you want to receive.
                </p>

              </div>


              <div className="divide-y divide-gray-200 dark:divide-gray-800">


                {/* New Order */}

                <NotificationItem
                  title="New Order"
                  description="Receive an email whenever a new order is placed."
                  enabled={settings.orderEmail}
                  onChange={(value) =>
                    handleChange(
                      "orderEmail",
                      value
                    )
                  }
                />


                {/* Review */}

                <NotificationItem
                  title="New Review"
                  description="Receive an email when a customer submits a review."
                  enabled={settings.reviewEmail}
                  onChange={(value) =>
                    handleChange(
                      "reviewEmail",
                      value
                    )
                  }
                />


                {/* Low Stock */}

                <NotificationItem
                  title="Low Stock Alert"
                  description="Receive an email when a product stock is running low."
                  enabled={settings.lowStockEmail}
                  onChange={(value) =>
                    handleChange(
                      "lowStockEmail",
                      value
                    )
                  }
                />

              </div>

            </div>

          )}


          {/* =====================================================
              SECURITY
          ====================================================== */}

          {activeTab === "security" && (

            <div className="space-y-6">


              {/* Change Password */}

              <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                <div className="border-b border-gray-200 p-6 dark:border-gray-800">

                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Change Password
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Update your admin account password.
                  </p>

                </div>


                <div className="space-y-5 p-6">

                  <input
                    type="password"
                    placeholder="Current password"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      text-sm
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                    "
                  />

                  <input
                    type="password"
                    placeholder="New password"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      text-sm
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                    "
                  />

                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      text-sm
                      outline-none
                      focus:border-black
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-white
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        "Password update will be connected to the backend later."
                      )
                    }
                    className="
                      h-11
                      rounded-lg
                      bg-black
                      px-6
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:bg-gray-800
                      dark:bg-white
                      dark:text-black
                      dark:hover:bg-gray-200
                    "
                  >
                    Update Password
                  </button>

                </div>

              </div>


              {/* Login Security */}

              <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

                <div className="p-6">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      🔐
                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Admin Account Security
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Keep your administrator account protected with a strong password.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =========================================================
          SAVE BUTTON
      ========================================================== */}

      <div className="mt-6 flex justify-end">

        <button
          type="button"
          onClick={handleSave}
          className="
            h-11
            rounded-lg
            bg-black
            px-6
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
            dark:bg-white
            dark:text-black
            dark:hover:bg-gray-200
          "
        >
          Save Changes
        </button>

      </div>

    </div>
  );
};


/*
|--------------------------------------------------------------------------
| Notification Item
|--------------------------------------------------------------------------
*/

const NotificationItem = ({
  title,
  description,
  enabled,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 p-6">

      <div>

        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>

      </div>


      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`
          relative
          h-6
          w-11
          flex-shrink-0
          rounded-full
          transition

          ${
            enabled
              ? "bg-black dark:bg-white"
              : "bg-gray-300 dark:bg-gray-700"
          }
        `}
      >

        <span
          className={`
            absolute
            top-1
            h-4
            w-4
            rounded-full
            bg-white
            transition
            dark:bg-black

            ${
              enabled
                ? "left-6"
                : "left-1"
            }
          `}
        />

      </button>

    </div>
  );
};

export default Settings;