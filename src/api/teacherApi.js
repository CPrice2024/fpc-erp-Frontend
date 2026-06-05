import api from "./axios";

// 📄 Get all teachers (department-based if backend supports)
export const getTeachers = () => api.get("/teachers");

// ➕ Create teacher
export const createTeacher = (data) =>
  api.post("/teachers", data);

// 🗑 Delete teacher
export const deleteTeacher = (id) =>
  api.delete(`/teachers/${id}`);

// ✏️ Update teacher
export const updateTeacher = (id, data) =>
  api.put(`/teachers/${id}`, data);