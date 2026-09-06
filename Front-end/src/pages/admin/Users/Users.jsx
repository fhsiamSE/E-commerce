import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios.js";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =========================
  // Fetch Users
  // =========================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/users");

        if (response.data.success) {
          setUsers(response.data.data);
        } else {
          setError("Failed to load users.");
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // =========================
  // Search + Role Filter
  // =========================
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase().trim();

      const userName = user.name?.toLowerCase() || "";
      const userEmail = user.email?.toLowerCase() || "";

      const matchesSearch =
        userName.includes(searchValue) ||
        userEmail.includes(searchValue);

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // =========================
  // Statistics
  // =========================
  const totalUsers = users.length;

  const employeeUsers = users.filter(
    (user) => user.role === "employee"
  ).length;

  const adminUsers = users.filter(
    (user) => user.role === "admin"
  ).length;

  // =========================
  // Delete User
  // =========================
  const deleteUser = () => {
    if (!selectedUser) return;

    // Currently local state only
    setUsers((currentUsers) =>
      currentUsers.filter(
        (user) => user.id !== selectedUser.id
      )
    );

    setSelectedUser(null);
    setShowDeleteModal(false);
  };

  // =========================
  // Role Label
  // =========================
  const getRoleLabel = (role) => {
    if (role === "admin") {
      return "Admin";
    }

    if (role === "employee") {
      return "Employee";
    }

    return "Customer";
  };

  // =========================
  // Initials
  // =========================
  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================
  // Date Format
  // =========================
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // Money Format
  // =========================
  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white"></div>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Loading users...
            </p>

          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">

          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
            Failed to load users
          </h2>

          <p className="mt-2 text-sm text-red-600 dark:text-red-300">
            {error}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-950">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Users
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage customers, employees and administrators.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total Users */}
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

        {/* Employees */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Employees
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
                {employeeUsers}
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-xl dark:bg-blue-950">
              👨‍💼
            </div>

          </div>

        </div>

        {/* Administrators */}
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

      {/* =====================================================
          USERS TABLE
      ====================================================== */}

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">

        {/* Search + Filter */}

        <div className="border-b border-gray-200 p-5 dark:border-gray-800">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Search */}

            <div className="relative w-full sm:max-w-md">

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

            {/* Role Filter */}

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

              <option value="user">
                Customer
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="employee">
                Employee
              </option>

            </select>

          </div>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px]">

            <thead>

              <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-800/50">

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  User
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Role
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
                    colSpan="3"
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

                    {/* User */}

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

                    {/* Role */}

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                            : user.role === "employee"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }`}
                      >
                        {getRoleLabel(user.role)}
                      </span>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        {/* View */}

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
                            transition
                            hover:bg-gray-100
                            dark:border-gray-700
                            dark:text-gray-300
                            dark:hover:bg-gray-800
                          "
                        >
                          View
                        </button>

                        {/* Delete */}

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
                            transition
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

        {/* Footer */}

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

      {/* =====================================================
          USER DETAILS MODAL
      ====================================================== */}

      {selectedUser && !showDeleteModal && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedUser(null)}
        >

          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-gray-900"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between">

              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                User Details
              </h2>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="text-lg text-gray-400 transition hover:text-gray-900 dark:hover:text-white"
              >
                ✕
              </button>

            </div>

            {/* User Profile */}

            <div className="mt-4 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white dark:bg-white dark:text-black">
                {getInitials(selectedUser.name)}
              </div>

              <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                {selectedUser.name}
              </h3>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {selectedUser.email}
              </p>

            </div>

            {/* Details */}

            <div className="mt-5 space-y-3">

              {/* User ID */}

              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  User ID
                </span>

                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  #{selectedUser.id}
                </span>

              </div>

              {/* Email */}

              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  Email
                </span>

                <span className="max-w-[200px] break-all text-right text-xs font-medium text-gray-900 dark:text-white">
                  {selectedUser.email || "N/A"}
                </span>

              </div>

              {/* Phone */}

              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Phone
                </span>

                <span className="text-right text-xs font-medium text-gray-900 dark:text-white">
                  {selectedUser.phone_number || "N/A"}
                </span>

              </div>

              {/* Address */}

              <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  Address
                </span>

                <span className="max-w-[200px] text-right text-xs font-medium text-gray-900 dark:text-white">
                  {selectedUser.address || "N/A"}
                </span>

              </div>

              {/* Role */}

              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Role
                </span>

                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {getRoleLabel(selectedUser.role)}
                </span>

              </div>

              {/* Orders */}

              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Orders
                </span>

                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {selectedUser.orders_count ?? 0}
                </span>

              </div>

              {/* Total Spent */}

              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-2.5 dark:border-gray-800">

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Total Spent
                </span>

                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  ৳
                  {formatMoney(
                    selectedUser.orders_sum_total
                  )}
                </span>

              </div>

              {/* Joined */}

              <div className="flex items-center justify-between gap-4">

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Joined
                </span>

                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {formatDate(
                    selectedUser.created_at
                  )}
                </span>

              </div>

            </div>

            {/* Close Button */}

            <button
              type="button"
              onClick={() =>
                setSelectedUser(null)
              }
              className="
                mt-5
                h-10
                w-full
                rounded-lg
                bg-black
                text-xs
                font-medium
                text-white
                transition
                hover:bg-gray-800
                dark:bg-white
                dark:text-black
                dark:hover:bg-gray-200
              "
            >
              Close
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MODAL
      ====================================================== */}

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

            {/* Delete Icon */}

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

                ?

                <br />

                This action cannot be undone.

              </p>

            </div>

            {/* Buttons */}

            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="
                  h-11
                  rounded-lg
                  border
                  border-gray-200
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
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteUser}
                className="
                  h-11
                  rounded-lg
                  bg-red-600
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-red-700
                "
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

