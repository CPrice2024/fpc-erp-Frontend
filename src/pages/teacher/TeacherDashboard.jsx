import { useEffect, useState } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  BookOpen,
} from "lucide-react";

import api from "../../api/axios";
import "./TeacherDashboard.css";

export default function TeacherDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
  try {
    const { data } = await api.get("/teacher/dashboard");

    setDashboard(data);

  } 
  
  catch (err) {

    console.error(err);

    setError(
      err.response?.data?.message ||
      "Failed to load dashboard"
    );

  } finally {

    setLoading(false);

  }
};
if (loading) {
  return (
    <div className="teacher-course-page">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    </div>
  );
}

   if (error) {
  return (
    <div className="teacher-course-page">
      <h2>{error}</h2>
    </div>
  );
}

  return (
    <div className="teacher-dashboard">

      <div className="dashboard-header">

        <div>

          <h1>
            Welcome,
            {" "}
            {dashboard?.teacher?.name}
          </h1>

          <p>
            Manage your class and students 
          </p>

        </div>

      </div>

      <div className="stats-grid">

        <div className="stat-card">

          <Users size={28} />

          <h2>
            {dashboard?.stats?.totalStudents}
          </h2>

          <p>Total Students</p>

        </div>

        <div className="stat-card">

          <CheckCircle size={28} />

          <h2>
            {dashboard?.stats?.presentToday}
          </h2>

          <p>Present Today</p>

        </div>

        <div className="stat-card">

          <XCircle size={28} />

          <h2>
            {dashboard?.stats?.absentToday}
          </h2>

          <p>Absent Today</p>

        </div>

        <div className="stat-card">

          <BookOpen size={28} />

          <h2>
            {dashboard?.stats?.averageMark}
          </h2>

          <p>Average Mark</p>

        </div>

      </div>

      <div className="course-card">

        <h1>Assigned Course</h1>

        <div className="course-grid">

          <div>
            <strong>Course</strong>

            <p>
              {dashboard?.course?.courseName || "Not Assigned"}
            </p>
          </div>

          <div>
            <strong>Code</strong>

            <p>
              {dashboard?.course?.courseCode}
            </p>
          </div>

          <div>
            <strong>Level</strong>

            <p>
              {dashboard?.course?.level}
            </p>
          </div>

          <div>
            <strong>Semester</strong>

            <p>
              {dashboard?.course?.semester}
            </p>
          </div>

          <div>
            <strong>Section</strong>

            <p>
              {dashboard?.course?.section}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}