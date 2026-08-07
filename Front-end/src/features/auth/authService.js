import api from "../../axios";


export const login = async (userData) => {
    const response = await api.post("/login", userData);

    return response.data;
};


export const register = async (userData) => {
    const response = await api.post("/register", userData);

    return response.data;
};


export const logout = async () => {
    const response = await api.post("/logout");

    return response.data;
};


export const getUser = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get("/user", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};