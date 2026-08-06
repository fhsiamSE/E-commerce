import api from "../../axios";

export const getCsrfCookie = async () => {
    await api.get("/sanctum/csrf-cookie");
};

export const login = async (userData) => {

    await getCsrfCookie();

    const response = await api.post("/login", userData);

    return response.data;
};

export const logout = async () => {
    await api.post("/logout");
};

export const getUser = async () => {
    const response = await api.get("/api/user");

    return response.data;
};