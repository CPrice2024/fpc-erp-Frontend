import api from "./axios";

export const getDepartments =
  () =>
    api.get("/departments");

export const createDepartment =
  (data) =>
    api.post(
      "/departments",
      data
    );

export const updateDepartment =
  (id, data) =>
    api.put(
      `/departments/${id}`,
      data
    );

export const deleteDepartment =
  (id) =>
    api.delete(
      `/departments/${id}`
    );

export const assignHead =
  (data) =>
    api.post(
      "/departments/assign-head",
      data
    );

    

/* ===========================
   Teacher Management
=========================== */

export const getTeacherStats = () =>
  api.get("/teachers/stats");

export const getTeachers = () =>
  api.get("/teachers");

export const getTeacher = (id) =>
  api.get(`/teachers/${id}`);

export const createTeacher = (data) =>
  api.post("/teachers", data);

export const updateTeacher = (id, data) =>
  api.put(`/teachers/${id}`, data);

export const deleteTeacher = (id) =>
  api.delete(`/teachers/${id}`);

export const resetTeacherPassword = (id) =>
  api.put(`/teachers/${id}/reset-password`);


/* ===========================
   Course Management
=========================== */

export const getCourses = () =>
  api.get("/courses");

export const getCourse = (id) =>
  api.get(`/courses/${id}`);

export const createCourse = (data) =>
  api.post("/courses", data);

export const updateCourse = (id, data) =>
  api.put(`/courses/${id}`, data);

export const deleteCourse = (id) =>
  api.delete(`/courses/${id}`);

export const getCourseStats = () =>
  api.get("/courses/stats");


/* ===========================
   students 
=========================== */


export const getStudents = () =>
  api.get("/students");

export const getStudent = (id) =>
  api.get(`/students/${id}`);

export const getStudentStats = () =>
  api.get("/students/stats");


/* ===========================
   Attendance Management 
=========================== */


export const getTeacherAttendance = () =>
  api.get("/teacher-attendance");

export const saveTeacherAttendance = (data) =>
  api.post("/teacher-attendance", data);

export const getTeacherAttendanceStats = () =>
  api.get("/teacher-attendance/stats");

export const getTeacherAttendanceHistory = () =>
  api.get("/teacher-attendance/history");


/* ==========================
   Department Dashboard
========================== */

export const getDepartmentDashboard = () =>
  api.get("/department-dashboard");