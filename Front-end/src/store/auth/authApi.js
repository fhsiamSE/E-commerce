import api from "../../api/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);

  // Store Bearer token in localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/register", userData);

  // Store token if registration returns one
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/logout");
    return response.data;
  } finally {
    // Always clear token, even if server logout fails or token expired
    localStorage.removeItem("token");
  }
};

export const getUser = async () => {
  // Axios interceptor automatically attaches the Bearer token header
  const response = await api.get("/user");
  return response.data;
};