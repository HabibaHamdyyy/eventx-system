import axiosInstance from "./axiosInstance";

export const getUsers = () => axiosInstance.get("/users");
export const getUserProfile = (id) => axiosInstance.get(`/users/${id}`);
export const updateUser = (id, data) => axiosInstance.put(`/users/${id}`, data);

// Favorites API
export const addToFavorites = (eventId) => axiosInstance.post(`/users/favorites`, { eventId });
export const removeFromFavorites = (eventId) => axiosInstance.delete(`/users/favorites/${eventId}`);
export const getFavorites = () => axiosInstance.get(`/users/favorites`);


