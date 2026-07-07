import api from "../api/axios";

export const teacherAPI = {

  dashboard: () =>
    api.get("/teacher/dashboard"),

  myCourse: () =>
    api.get("/teacher/my-course"),

  myStudents: () =>
    api.get("/teacher/my-students"),

  studentProfile: (id) =>
    api.get(`/teacher/student/${id}`),
  

};