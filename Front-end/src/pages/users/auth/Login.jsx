import { useState } from "react";
import { loginUser } from "../../../store/auth/authApi.js";
import { useNavigate } from "react-router-dom";
import authLogo from "../../../assets/images/authLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser({
        email,
        password,
      });

      // Save token
      localStorage.setItem("token", data.token);

      // Save user
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login success:", data);

      navigate("/");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fff5ef]">
      {/* LEFT LOGIN SECTION */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            bg-white
            px-10
            py-12
            shadow-xl
          "
        >
          {/* Logo */}
          <h1
            className="
              text-2xl
              font-bold
              text-[#ff7357]
            "
          >
            Logo Here
          </h1>

          <p
            className="
              mt-10
              text-sm
              text-gray-400
            "
          >
            Welcome back !!!
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              text-black
            "
          >
            Sign in
          </h2>

          {/* Error */}
          {error && (
            <div
              className="
                mt-6
                rounded-lg
                bg-red-100
                p-3
                text-sm
                text-red-600
              "
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              mt-8
              space-y-5
            "
          >
            {/* Email */}
            <div>
              <label
                className="
                  text-sm
                  text-gray-700
                "
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="
                  mt-2
                  w-full
                  rounded-md
                  bg-[#fff5f2]
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  outline-none
                  focus:ring-2
                  focus:ring-[#ff7357]
                  disabled:opacity-70
                "
              />
            </div>

            {/* Password */}
            <div>
              <div
                className="
                  flex
                  justify-between
                "
              >
                <label
                  className="
                    text-sm
                    text-gray-700
                  "
                >
                  Password
                </label>

                <a
                  href="#"
                  className="
                    text-xs
                    text-gray-400
                    hover:text-[#ff7357]
                  "
                >
                  Forgot Password ?
                </a>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="
                  mt-2
                  w-full
                  rounded-md
                  bg-[#fff5f2]
                  px-4
                  py-3
                  text-sm
                  text-gray-700
                  outline-none
                  focus:ring-2
                  focus:ring-[#ff7357]
                  disabled:opacity-70
                "
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                mx-auto
                mt-6
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                px-10
                py-3
                text-sm
                font-semibold
                text-white
                transition-all
                ${
                  loading
                    ? "cursor-not-allowed bg-[#ff9a85]"
                    : "bg-[#ff7357] hover:bg-[#ff6244]"
                }
              `}
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>

                  Loading...
                </>
              ) : (
                <>
                  SIGN IN
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <p
            className="
              mt-8
              text-center
              text-sm
              text-gray-300
            "
          >
            I don't have an account ?

            <a
              href="/register"
              className="
                ml-1
                text-[#ff7357]
              "
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT IMAGE SECTION */}
      <div
        className="
          hidden
          lg:flex
          w-1/2
          items-center
          justify-center
          bg-[#fff0e8]
        "
      >
        <img
          src={authLogo}
          alt="Login"
          className="
            max-w-lg
            object-contain
          "
        />
      </div>
    </div>
  );
}

export default Login;