import api from "./axios";

// 📄 Get students for a class
export const getClassStudents = (classId) =>
  api.get(`/classes/${classId}/students`);

// ➕ Create attendance session
export const createAttendance = (data) =>
  api.post("/attendance", data);

// 📄 Get attendance history
export const getAttendance = (classId) =>
  api.get(`/attendance/${classId}`);