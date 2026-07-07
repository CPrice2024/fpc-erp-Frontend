import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDepartmentDashboard } from "../../api/departmentAPI";

import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  UserPlus,
  Activity,
} from "lucide-react";

import "./DHDashboard.css";

export default function DHDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } =
        await getDepartmentDashboard();

      setDashboard(data);

    } catch (error) {

      console.error(error);

      alert("Failed to load dashboard.");

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dh-dashboard">

      {/* Header */}

      <div className="dashboard-header">

        <div>

          <h1>
            Department Dashboard
          </h1>

          <p>
            Overview of your department
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <Users size={34} />

          <div>

            <h2>
              {dashboard.stats.totalStudents}
            </h2>

            <p>Total Students</p>

          </div>

        </div>

        <div className="stat-card">

          <GraduationCap size={34} />

          <div>

            <h2>
              {dashboard.stats.totalTeachers}
            </h2>

            <p>Total Teachers</p>

          </div>

        </div>

        <div className="stat-card">

          <BookOpen size={34} />

          <div>

            <h2>
              {dashboard.stats.totalCourses}
            </h2>

            <p>Total Courses</p>

          </div>

        </div>

        <div className="stat-card">

          <ClipboardCheck size={34} />

          <div>

            <h2>
              {dashboard.stats.attendanceRate}%
            </h2>

            <p>Today's Attendance</p>

          </div>

        </div>

      </div>

      {/* Teacher Workload */}

      <div className="dashboard-row">

        <div className="card teacher-card">

          <div className="card-header">

            <TrendingUp size={20} />

            <h3>Teacher Workload</h3>

          </div>

          <table>

            <thead>

              <tr>

                <th>Teacher</th>

                <th>Course</th>

                <th>Students</th>

              </tr>

            </thead>

            <tbody>

              {dashboard.teacherWorkload.length > 0 ? (

                dashboard.teacherWorkload.map((teacher) => (

                  <tr key={teacher._id}>

                    <td>{teacher.name}</td>

                    <td>

                      {teacher.course
                        ? teacher.course.courseCode
                        : "Not Assigned"}

                    </td>

                    <td>

                      {teacher.students}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="empty-row"
                  >

                    No teachers found

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* Recent Students */}

        <div className="card">

          <div className="card-header">

            <UserPlus size={20} />

            <h3>

              Recently Registered

            </h3>

          </div>

          {dashboard.recentStudents.length > 0 ? (

            dashboard.recentStudents.map((student) => (

              <div
                key={student._id}
                className="student-item"
              >

                <div>

                  <strong>

                    {student.firstName}{" "}
                    {student.fatherName}

                  </strong>

                  <p>

                    {student.studentId}

                  </p>

                </div>

                <span className="level-badge">

                  {student.level}

                </span>

              </div>

            ))

          ) : (

            <p>No students found.</p>

          )}

        </div>

      </div>

      {/* Bottom Section */}

      <div className="dashboard-row">

        {/* Attendance */}

        <div className="card">

          <div className="card-header">

            <Activity size={20} />

            <h3>

              Today's Attendance

            </h3>

          </div>

          <div className="attendance-summary">

            <div>

              <h2>

                {dashboard.attendance.present}

              </h2>

              <p>Present</p>

            </div>

            <div>

              <h2>

                {dashboard.attendance.late}

              </h2>

              <p>Late</p>

            </div>

            <div>

              <h2>

                {dashboard.attendance.absent}

              </h2>

              <p>Absent</p>

            </div>

          </div>

        </div>

        {/* Course Summary */}

        <div className="card">

          <div className="card-header">

            <BookOpen size={20} />

            <h3>

              Course Summary

            </h3>

          </div>

          <div className="summary-list">

            <div>

              Assigned

              <strong>

                {dashboard.courseSummary.assignedCourses}

              </strong>

            </div>

            <div>

              Unassigned

              <strong>

                {dashboard.courseSummary.unassignedCourses}

              </strong>

            </div>

            <div>

              Active

              <strong>

                {dashboard.courseSummary.activeCourses}

              </strong>

            </div>

            <div>

              Inactive

              <strong>

                {dashboard.courseSummary.inactiveCourses}

              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="card">

        <div className="card-header">

          <BookOpen size={20} />

          <h3>

            Quick Actions

          </h3>

        </div>

        <div className="action-buttons">

          <button
            onClick={() =>
              navigate("/department-head/teachers/create")
            }
          >
            Add Teacher
          </button>

          <button
            onClick={() =>
              navigate("/department-head/courses/create")
            }
          >
            Add Course
          </button>

          <button
            onClick={() =>
              navigate("/department-head/students")
            }
          >
            View Students
          </button>

          <button
            onClick={() =>
              navigate("/department-head/reports")
            }
          >
            Reports
          </button>

        </div>

      </div>

    </div>
  );
}