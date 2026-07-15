import api from "./axios";

/* ===========================================================
   EXAMS
=========================================================== */

export const getExams = async (params = {}) => {
  const res = await api.get("/exams", { params });
  return res.data;
};

export const getExam = async (id) => {
  const res = await api.get(`/exams/${id}`);
  return res.data;
};

export const createExam = async (data) => {
  const res = await api.post("/exams", data);
  return res.data;
};

export const updateExam = async (id, data) => {
  const res = await api.put(`/exams/${id}`, data);
  return res.data;
};

export const publishExam = async (id) => {
  const res = await api.put(`/exams/${id}`, {
    status: "Published",
  });
  return res.data;
};

export const unpublishExam = async (id) => {
  const res = await api.put(`/exams/${id}`, {
    status: "Draft",
  });
  return res.data;
};

export const deleteExam = async (id) => {
  const res = await api.delete(`/exams/${id}`);
  return res.data;
};

/* ===========================================================
   QUESTIONS
=========================================================== */

export const getQuestions = async (examId) => {
  const res = await api.get(`/questions/exam/${examId}`);
  return res.data;
};

export const getQuestion = async (id) => {
  const res = await api.get(`/questions/${id}`);
  return res.data;
};

export const createQuestion = async (data) => {
  const res = await api.post("/questions", data);
  return res.data;
};

export const updateQuestion = async (id, data) => {
  const res = await api.put(`/questions/${id}`, data);
  return res.data;
};

export const deleteQuestion = async (id) => {
  const res = await api.delete(`/questions/${id}`);
  return res.data;
};

/* ===========================================================
   STUDENT EXAMS
=========================================================== */

export const getAvailableExams = async () => {
  const res = await api.get("/student/exams");
  return res.data;
};

export const getExamQuestions = async (examId) => {
  const res = await api.get(`/questions/exam/${examId}`);
  return res.data;
};

/* ===========================================================
   EXAM ATTEMPTS
=========================================================== */

export const startExam = async (data) => {
  const res = await api.post("/exam-attempts/start", data);
  return res.data;
};

export const getAttempt = async (id) => {
  const res = await api.get(`/exam-attempts/${id}`);
  return res.data;
};

export const submitExam = async (attemptId) => {
  const res = await api.put(
    `/exam-attempts/${attemptId}/submit`
  );
  return res.data;
};

export const getStudentHistory = async (studentId) => {
  const res = await api.get(
    `/exam-attempts/student/${studentId}`
  );
  return res.data;
};

/* ===========================================================
   STUDENT ANSWERS
=========================================================== */

export const saveAnswer = async (data) => {
  const res = await api.post("/student-answers", data);
  return res.data;
};

export const updateAnswer = async (id, data) => {
  const res = await api.put(
    `/student-answers/${id}`,
    data
  );
  return res.data;
};

export const deleteAnswer = async (id) => {
  const res = await api.delete(
    `/student-answers/${id}`
  );
  return res.data;
};

export const getAnswers = async (attemptId) => {
  const res = await api.get(
    `/student-answers/attempt/${attemptId}`
  );
  return res.data;
};

/* ===========================================================
   RESULTS
=========================================================== */

export const getExamResults = async (examType = "") => {
  const res = await api.get("/exam-results", {
    params: examType
      ? { examType }
      : {},
  });

  return res.data;
};

export const getStudentResult = async (attemptId) => {
  const res = await api.get(
    `/exam-results/${attemptId}`
  );
  return res.data;
};

/* ===========================================================
   DASHBOARD
=========================================================== */

export const getTeacherExamDashboard =
  async () => {
    const res = await api.get(
      "/exam-dashboard/teacher"
    );
    return res.data;
  };

export const getStudentExamDashboard =
  async () => {
    const res = await api.get(
      "/exam-dashboard/student"
    );
    return res.data;
  };

export const getExamResult = async (attemptId) => {
  const res = await api.get(`/exam-results/${attemptId}`);
  return res.data;
};