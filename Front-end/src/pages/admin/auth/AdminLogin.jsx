import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Handle Input Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    console.log("Admin login:", formData);

    // Temporary navigation for testing
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10 dark:bg-gray-950">

      <div className="w-full max-w-md">

        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-9">

          <div className="mb-8">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl text-white dark:bg-white dark:text-black">
              🔐
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Admin Login
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Sign in to access your administration dashboard.
            </p>

          </div>


          {/* =====================================================
              ERROR
          ====================================================== */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </div>
          )}


          {/* =====================================================
              FORM
          ====================================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================== */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>

              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    py-3
                    pl-10
                    pr-4
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-black
                    focus:ring-2
                    focus:ring-black/10

                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                    dark:placeholder-gray-500
                    dark:focus:border-white
                  "
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================== */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-gray-500 transition hover:text-black dark:text-gray-400 dark:hover:text-white"
                >
                  Forgot Password?
                </button>

              </div>


              <div className="relative">

                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    py-3
                    pl-10
                    pr-12
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-black
                    focus:ring-2
                    focus:ring-black/10

                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                    dark:placeholder-gray-500
                    dark:focus:border-white
                  "
                />


                {/* Show / Hide Password */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    transition
                    hover:text-gray-700
                    dark:hover:text-white
                  "
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* =================================================
                REMEMBER ME
            ================================================== */}

            <div className="flex items-center">

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 accent-black"
                />

                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>

              </label>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="
                w-full
                rounded-lg
                bg-black
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-gray-800
                active:scale-[0.99]

                dark:bg-white
                dark:text-black
                dark:hover:bg-gray-200
              "
            >
              Sign In to Admin Panel
            </button>

          </form>


          {/* =====================================================
              BACK TO STORE
          ====================================================== */}

          <div className="mt-7 border-t border-gray-200 pt-6 text-center dark:border-gray-800">

            <Link
              to="/"
              className="
                text-sm
                font-medium
                text-gray-500
                transition
                hover:text-black
                dark:text-gray-400
                dark:hover:text-white
              "
            >
              ← Back to Store
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminLogin;

