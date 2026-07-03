import api from "./axios";

export const getProfile = () =>
  api.get("/auth/profile");

export const updateProfile = (formData) =>
  api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const changePassword = (data) =>
  api.put("/auth/change-password", data);