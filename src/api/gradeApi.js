import api from "./axios";

// 📄 Get students in class for grading
export const getClassStudents = (classId) =>
  api.get(`/classes/${classId}/students`);

// 💾 Save grades
export const saveGrades = (data) =>
  api.post("/grades", data);

// 📄 Get student grades
export const getStudentGrades = (studentId) =>
  api.get(`/grades/student/${studentId}`);