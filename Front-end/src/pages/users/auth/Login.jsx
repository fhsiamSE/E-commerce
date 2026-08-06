import { useState } from "react";
import { loginUser } from "../../../features/auth/authAPI";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const data = await loginUser({
        email,
        password,
      });

      // Save Sanctum token
      localStorage.setItem("token", data.token);

      // Optional: save user data
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Login success:", data);

      // Redirect to home page
      navigate("/");

    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          alt="Company"
          className="mx-auto h-10 w-auto"
        />

        <h2 className="mt-10 text-center text-2xl font-bold text-white">
          Sign in to your account
        </h2>
      </div>


      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

        {error && (
          <div className="mb-4 rounded-md bg-red-500/20 p-3 text-sm text-red-300">
            {error}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Email address
            </label>

            <input
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-100">
              Password
            </label>

            <input
              className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-white"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>


          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 font-semibold text-white hover:bg-indigo-400"
          >
            Sign in
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;