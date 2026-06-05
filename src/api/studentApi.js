import api from "./axios";

// 📄 Get all students
export const getStudents = () =>
  api.get("/students");

// ➕ Create student (optional if backend auto-creates after approval)
export const createStudent = (data) =>
  api.post("/students", data);

// ✏️ Update student
export const updateStudent = (id, data) =>
  api.put(`/students/${id}`, data);

// 🗑 Delete student
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`);