import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../../../store/auth/authSlice.js";
import api from "../../../api/axios.js";

function Profile() {
  const dispatch = useDispatch();

  const { user: authUser, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const [user, setUser] = useState(null);

  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);

      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        phone_number: authUser.phone_number || "",
        address: authUser.address || "",
      });
    }
  }, [authUser]);

  const getInitials = (name) => {
    if (!name) {
      return "U";
    }

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getMemberSince = (createdAt) => {
    if (!createdAt) {
      return "Recently";
    }

    return new Date(createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = () => {
    setError(null);
    setSuccess(null);

    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      address: user?.address || "",
    });

    setShowEdit(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.put("/user", formData);

      const updatedUser = response.data?.user;

      if (updatedUser) {
        setUser(updatedUser);

        setFormData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          phone_number: updatedUser.phone_number || "",
          address: updatedUser.address || "",
        });
      }

      await dispatch(getCurrentUser());

      setSuccess(
        response.data?.message || "Profile updated successfully."
      );

      setTimeout(() => {
        setShowEdit(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
            <p className="text-sm text-stone-500">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold text-stone-900">
              Unable to load profile
            </h2>

            <p className="mt-2 text-sm text-stone-500">
              Please login again and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-stone-50 pt-28 pb-16">
        <div className="container mx-auto px-4">

          {/* Profile Header */}
          <div className="mb-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-3xl font-bold text-white shadow-lg shadow-rose-200/50">
                  {getInitials(user.name)}
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-stone-500">
                    Profile
                  </p>

                  <h1 className="mt-2 text-3xl font-semibold text-stone-900">
                    {user.name}
                  </h1>

                  <p className="mt-2 text-sm text-stone-600">
                    Member since {getMemberSince(user.created_at)}
                  </p>
                </div>

              </div>

              <button
                onClick={handleEdit}
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
              >
                Edit profile
              </button>

            </div>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

            <div className="space-y-6">

              {/* Account Details */}
              <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                      Account details
                    </h2>

                    <p className="mt-2 text-sm text-stone-500">
                      Manage your personal information and account preferences.
                    </p>
                  </div>

                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                    Active
                  </span>

                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  {/* Email */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                      Email
                    </p>

                    <p className="mt-3 break-all text-sm text-stone-900">
                      {user.email}
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                      Phone
                    </p>

                    <p className="mt-3 text-sm text-stone-900">
                      {user.phone_number || "Not provided"}
                    </p>
                  </div>

                  {/* Address */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                      Address
                    </p>

                    <p className="mt-3 text-sm text-stone-900">
                      {user.address || "Not provided"}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                      Member since
                    </p>

                    <p className="mt-3 text-sm text-stone-900">
                      {getMemberSince(user.created_at)}
                    </p>
                  </div>

                </div>
              </section>

              {/* Recent Activity */}
              <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-stone-200">

                <div>
                  <h2 className="text-xl font-semibold text-stone-900">
                    Recent activity
                  </h2>

                  <p className="mt-2 text-sm text-stone-500">
                    Your recent account activity will appear here.
                  </p>
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">

                  <p className="text-sm font-semibold text-stone-900">
                    Account created
                  </p>

                  <p className="mt-1 text-sm text-stone-500">
                    {getMemberSince(user.created_at)}
                  </p>

                  <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 ring-1 ring-stone-200">
                    Account
                  </span>

                </div>

              </section>

            </div>

            {/* Sidebar */}
            <aside className="space-y-6">

              {/* Account Summary */}
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">

                <h3 className="text-lg font-semibold text-stone-900">
                  Account summary
                </h3>

                <div className="mt-6 grid gap-4">

                  {/* Orders */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-semibold text-stone-900">
                      Orders
                    </p>

                    <p className="mt-3 text-3xl font-bold text-stone-900">
                      —
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      Order history coming soon
                    </p>
                  </div>

                  {/* Wishlist */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-semibold text-stone-900">
                      Wishlist
                    </p>

                    <p className="mt-3 text-3xl font-bold text-stone-900">
                      —
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      Wishlist coming soon
                    </p>
                  </div>

                  {/* Saved Cards */}
                  <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5">
                    <p className="text-sm font-semibold text-stone-900">
                      Saved cards
                    </p>

                    <p className="mt-3 text-3xl font-bold text-stone-900">
                      —
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      Payment system coming soon
                    </p>
                  </div>

                </div>
              </div>

              {/* Saved Address */}
              <div className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-stone-200">

                <h3 className="text-lg font-semibold text-stone-900">
                  Saved address
                </h3>

                <p className="mt-4 text-sm text-stone-600">
                  {user.address || "No address has been added yet."}
                </p>

                <button
                  onClick={handleEdit}
                  className="mt-6 w-full rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-900"
                >
                  Manage address
                </button>

              </div>

            </aside>

          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-white p-8 shadow-2xl">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                  Profile
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                  Edit profile
                </h2>
              </div>

              <button
                onClick={() => setShowEdit(false)}
                disabled={saving}
                className="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-600 hover:bg-stone-200"
              >
                ✕
              </button>

            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleUpdateProfile}
              className="mt-6 space-y-5"
            >

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-stone-700">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-stone-700">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-semibold text-stone-700">
                  Phone number
                </label>

                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-semibold text-stone-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter your address"
                  className="mt-2 w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  disabled={saving}
                  className="w-full rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-black hover:text-black disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}
    </>
  );
}

export default Profile;