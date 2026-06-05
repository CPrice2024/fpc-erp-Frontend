import api from "./axios";

// 📄 Get all applications
export const getApplications = () =>
  api.get("/admissions");

// ➕ Create application (if frontend form exists)
export const createApplication = (data) =>
  api.post("/admissions", data);

// ✅ Approve student
export const approveApplication = (id) =>
  api.put(`/admissions/approve/${id}`);

// ❌ Reject student
export const rejectApplication = (id) =>
  api.put(`/admissions/reject/${id}`);