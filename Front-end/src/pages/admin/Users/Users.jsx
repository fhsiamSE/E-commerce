import React, { useMemo, useState } from "react";

const Users = () => {
  /*
  |--------------------------------------------------------------------------
  | TEMPORARY USER DATA
  |--------------------------------------------------------------------------
  | We will replace this with Laravel API data later.
  */

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+880 1712-345678",
      role: "Customer",
      status: "Active",
      orders: 12,
      spent: 24500,
      joined: "Aug 20, 2026",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+880 1812-456789",
      role: "Customer",
      status: "Active",
      orders: 8,
      spent: 18200,
      joined: "Aug 18, 2026",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "+880 1912-567890",
      role: "Customer",
      status: "Blocked",
      orders: 4,
      spent: 7200,
      joined: "Aug 15, 2026",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily@example.com",
      phone: "+880 1612-678901",
      role: "Customer",
      status: "Active",
      orders: 21,
      spent: 45800,
      joined: "Aug 12, 2026",
    },
    {
      id: 5,
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+880 1512-789012",
      role: "Customer",
      status: "Inactive",
      orders: 2,
      spent: 3500,
      joined: "Aug 10, 2026",
    },
    {
      id: 6,
      name: "Admin User",
      email: "admin@example.com",
      phone: "+880 1312-890123",
      role: "Admin",
      status: "Active",
      orders: 0,
      spent: 0,
      joined: "Aug 01, 2026",
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FILTER USERS
  |--------------------------------------------------------------------------
  */

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue) ||
        user.phone.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    statusFilter,
    roleFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | USER STATS
  |--------------------------------------------------------------------------
  */

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "Admin"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | TOGGLE USER STATUS
  |--------------------------------------------------------------------------
  */

  const toggleStatus = (id) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => {
        if (user.id !== id) {
          return user;
        }

        return {
          ...user,
          status:
            user.status === "Active"
              ? "Blocked"
              : "Active",
        };
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE USER
  |--------------------------------------------------------------------------
  */

  const deleteUser = () => {
    if (!selectedUser) return;

    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) => user.id !== selectedUser.id
      )
    );

    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  /*
  |--------------------------------------------------------------------------
  | AVATAR
  |--------------------------------------------------------------------------
  */

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

      {/* =========================================================
          PAGE HEADER
      ========================================================== */}

      <div className="mb-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage customers and administrators.
            </p>
          </div>

        </div>

      </div>


      {/* =========================================================
          STAT CARDS
      ========================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL USERS */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Users
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {totalUsers}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100 text-xl dark:bg-gray-800">
              👥
            </div>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Active Users
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {activeUsers}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-xl dark:bg-green-950">
              ✓
            </div>

          </div>

        </div>


        {/* BLOCKED */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Blocked Users
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {blockedUsers}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-xl dark:bg-red-950">
              🚫
            </div>

          </div>

        </div>


        {/* ADMINS */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Administrators
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {adminUsers}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-xl dark:bg-purple-950">
              🛡️
            </div>

          </div>

        </div>

      </div>


      {/* =========================================================
          USER TABLE
      ========================================================== */}

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

        {/* =======================================================
            TABLE HEADER
        ======================================================== */}

        <div className="border-b border-gray-200 p-5 dark:border-gray-800">

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative w-full xl:max-w-md">

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search users..."
                className="
                  h-11
                  w-full
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  pl-10
                  pr-4
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


            {/* FILTERS */}

            <div className="flex flex-col gap-3 sm:flex-row">

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="
                  h-11
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-sm
                  outline-none
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                "
              >

                <option value="All">
                  All Roles
                </option>

                <option value="Customer">
                  Customer
                </option>

                <option value="Admin">
                  Admin
                </option>

              </select>


              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="
                  h-11
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  px-4
                  text-sm
                  outline-none
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-white
                "
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Blocked">
                  Blocked
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>


        {/* =======================================================
            TABLE
        ======================================================== */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>

              <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-800/50">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  User
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Phone
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Role
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Orders
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Total Spent
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Joined
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredUsers.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>

                </tr>

              ) : (

                filteredUsers.map((user) => (

                  <tr
                    key={user.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/40"
                  >

                    {/* USER */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white dark:bg-white dark:text-black">
                          {getInitials(user.name)}
                        </div>

                        <div>

                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* PHONE */}

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {user.phone}
                    </td>


                    {/* ROLE */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {user.role}
                      </span>

                    </td>


                    {/* ORDERS */}

                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {user.orders}
                    </td>


                    {/* SPENT */}

                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      ৳{user.spent.toLocaleString()}
                    </td>


                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : user.status === "Blocked"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                        }`}
                      >
                        {user.status}
                      </span>

                    </td>


                    {/* JOINED */}

                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {user.joined}
                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        {/* VIEW */}

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUser(user)
                          }
                          className="
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-gray-700
                            hover:bg-gray-100
                            dark:border-gray-700
                            dark:text-gray-300
                            dark:hover:bg-gray-800
                          "
                        >
                          View
                        </button>


                        {/* STATUS */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleStatus(user.id)
                          }
                          className="
                            rounded-lg
                            border
                            border-gray-200
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-gray-700
                            hover:bg-gray-100
                            dark:border-gray-700
                            dark:text-gray-300
                            dark:hover:bg-gray-800
                          "
                        >
                          {user.status === "Active"
                            ? "Block"
                            : "Activate"}
                        </button>


                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="
                            rounded-lg
                            border
                            border-red-200
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-red-600
                            hover:bg-red-50
                            dark:border-red-900
                            dark:hover:bg-red-950
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {/* =======================================================
            TABLE FOOTER
        ======================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">

          <p className="text-sm text-gray-500 dark:text-gray-400">

            Showing{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-900 dark:text-white">
              {users.length}
            </span>{" "}
            users

          </p>

        </div>

      </div>


      {/* =========================================================
          VIEW USER MODAL
      ========================================================== */}

      {selectedUser && !showDeleteModal && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="flex items-center justify-between">

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Details
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="text-xl text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>

            </div>


            <div className="mt-6 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white dark:bg-white dark:text-black">
                {getInitials(selectedUser.name)}
              </div>

              <h3 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                {selectedUser.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUser.email}
              </p>

            </div>


            <div className="mt-6 space-y-4">

              <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">

                <span className="text-sm text-gray-500">
                  Phone
                </span>

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUser.phone}
                </span>

              </div>


              <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">

                <span className="text-sm text-gray-500">
                  Role
                </span>

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUser.role}
                </span>

              </div>


              <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">

                <span className="text-sm text-gray-500">
                  Orders
                </span>

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUser.orders}
                </span>

              </div>


              <div className="flex justify-between border-b border-gray-100 pb-3 dark:border-gray-800">

                <span className="text-sm text-gray-500">
                  Total Spent
                </span>

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ৳{selectedUser.spent.toLocaleString()}
                </span>

              </div>


              <div className="flex justify-between">

                <span className="text-sm text-gray-500">
                  Joined
                </span>

                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {selectedUser.joined}
                </span>

              </div>

            </div>


            <button
              type="button"
              onClick={() =>
                setSelectedUser(null)
              }
              className="mt-6 h-11 w-full rounded-lg bg-black text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Close
            </button>

          </div>

        </div>

      )}


      {/* =========================================================
          DELETE MODAL
      ========================================================== */}

      {showDeleteModal && selectedUser && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
        >

          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl dark:bg-red-950">
                🗑️
              </div>

              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Delete User?
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedUser.name}
                </span>
                ? This action cannot be undone.
              </p>

            </div>


            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="h-11 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteUser}
                className="h-11 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Users;

