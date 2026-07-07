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


/* ===========================
   DASHBOARD
=========================== */

export const getTeacherDashboard = () =>
  api.get("/teacher/dashboard");

/* ===========================
   COURSE
=========================== */

export const getMyCourse = () =>
  api.get("/teacher/my-course");

/* ===========================
   STUDENTS
=========================== */

export const getMyStudents = () =>
  api.get("/teacher/my-students");

export const getStudentProfile = (id) =>
  api.get(`/teacher/student/${id}`);

/* ===========================
   ATTENDANCE
=========================== */

export const getAttendanceStudents = () =>
  api.get("/attendance/students");

export const saveAttendance = (data) =>
  api.post("/attendance/save", data);

export const getAttendanceHistory = () =>
  api.get("/attendance/history");

export const getTodayAttendance = () =>
  api.get("/attendance/today");

/* ===========================
   GRADES
=========================== */

export const getGradeStudents = () =>
  api.get("/grades/students");

export const saveGrades = (data) =>
  api.post("/grades/save", data);

export const getGradeReport = () =>
  api.get("/grades/report");

export const getCourseGrades = () =>
  api.get("/grades/course");

export const getGradeSummary = () =>
  api.get("/grades/summary");