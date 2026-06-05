import api from "./axios";

// 📄 Get logged-in student's results
export const getMyResults = () =>
  api.get("/students/me/results");