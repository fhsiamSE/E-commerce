import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../../store/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import authLogo from "../../../assets/images/authLogo.png";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setPasswordConfirmation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await dispatch(
        registerUser({
          name,
          email,
          password,
          confirm_password,
        })
      ).unwrap();

      console.log("Registration successful:", result);

      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fff5ef]">

      {/* LEFT REGISTER SECTION */}

      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">

        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            bg-white
            px-10
            py-10
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
              mt-8
              text-sm
              text-gray-400
            "
          >
            Create your account
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-bold
              text-black
            "
          >
            Sign up
          </h2>

          {/* Error */}

          {error && (
            <div
              className="
                mt-5
                rounded-lg
                bg-red-100
                p-3
                text-sm
                text-red-600
              "
            >
              {error.message || "Registration failed"}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="
              mt-7
              space-y-4
            "
          >

            {/* Name */}

            <div>

              <label
                className="
                  text-sm
                  text-gray-700
                "
              >
                Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
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
                "
              />

            </div>

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
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
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
                "
              />

            </div>

            {/* Password */}

            <div>

              <label
                className="
                  text-sm
                  text-gray-700
                "
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
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
                "
              />

            </div>

            {/* Confirm Password */}

            <div>

              <label
                className="
                  text-sm
                  text-gray-700
                "
              >
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirm_password}
                onChange={(e) =>
                  setPasswordConfirmation(
                    e.target.value
                  )
                }
                required
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
                "
              />

            </div>

            {/* Button */}

            <button
              disabled={loading}
              type="submit"
              className="
                mx-auto
                mt-5
                flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#ff7357]
                px-10
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#ff6244]
                disabled:opacity-50
              "
            >

              {loading
                ? "Creating..."
                : "SIGN UP"
              }

              <span>
                →
              </span>

            </button>

          </form>

          <p
            className="
              mt-7
              text-center
              text-sm
              text-gray-300
            "
          >

            Already have an account ?

            <a
              href="/login"
              className="
                ml-1
                text-[#ff7357]
              "
            >
              Sign in
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
          alt="Register"
          className="
            max-w-lg
            object-contain
          "
        />

      </div>

    </div>
  );
}

export default Register;