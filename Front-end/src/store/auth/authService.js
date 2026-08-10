import api from "../../api/axios";

export const login = async (userData) => {
  const response = await api.post("/login", userData);

  // Store token upon successful login
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/register", userData);

  // Store token if your registration endpoint logs the user in automatically
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const logout = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } finally {
    // Always remove token, even if server-side logout fails
    localStorage.removeItem("token");
  }
};

export const getUser = async () => {
  // Axios interceptor handles attaching the Bearer token automatically
  const response = await api.get("/user");
  return response.data;
};