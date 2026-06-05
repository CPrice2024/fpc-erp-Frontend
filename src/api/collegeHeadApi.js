import api from "./axios";

// Dashboard
export const getDashboard = () =>
  api.get("/college-head/dashboard");

// Departments
export const getDepartments = () =>
  api.get("/college-head/departments");

export const createDepartment = (data) =>
  api.post("/college-head/departments", data);

export const updateDepartment = (id, data) =>
  api.put(`/college-head/departments/${id}`, data);

export const deleteDepartment = (id) =>
  api.delete(`/college-head/departments/${id}`);

// Reports
export const getReports = () =>
  api.get("/college-head/reports");