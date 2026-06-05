
import {
  Users,
  GraduationCap,
  Award,
  ClipboardCheck,
  UserPlus,
  BookOpen,
  TrendingUp,
  Activity,
} from "lucide-react";


import "./DHDashboard.css";

export default function DHDashboard() {
  const dashboardData = {
    department: "Computer Science",
    totalStudents: 425,
    totalTeachers: 18,
    averageGPA: 3.34,
    attendanceRate: 89,
  };

  const teachers = [
    {
      name: "Dr. Abebe",
      courses: 4,
      students: 132,
      score: 96,
    },
    {
      name: "Tigist Alemu",
      courses: 3,
      students: 94,
      score: 91,
    },
    {
      name: "Kebede Tadesse",
      courses: 5,
      students: 168,
      score: 89,
    },
    {
      name: "Meron Bekele",
      courses: 2,
      students: 72,
      score: 87,
    },
  ];

  const recentStudents = [
    {
      id: "ST0054",
      name: "Abebe Kebede",
      level: "Level I",
    },
    {
      id: "ST0055",
      name: "Tigist Alemu",
      level: "Level II",
    },
    {
      id: "ST0056",
      name: "Samuel Tadesse",
      level: "Level I",
    },
  ];

  const activities = [
    "5 new students registered today",
    "2 teachers submitted grades",
    "Level III attendance updated",
    "Semester report generated",
  ];

  return (

        <div className="dh-dashboard">

          {/* Header */}

          <div className="dashboard-header">
            <div>
              <h1>
                {dashboardData.department}
              </h1>

              <p>
                Department Performance Overview
              </p>
            </div>
          </div>

          {/* Stats Cards */}

          <div className="stats-grid">

            <div className="stat-card">
              <Users size={34} />

              <div>
                <h2>
                  {dashboardData.totalStudents}
                </h2>

                <p>Total Students</p>
              </div>
            </div>

            <div className="stat-card">
              <GraduationCap size={34} />

              <div>
                <h2>
                  {dashboardData.totalTeachers}
                </h2>

                <p>Total Teachers</p>
              </div>
            </div>

            <div className="stat-card">
              <Award size={34} />

              <div>
                <h2>
                  {dashboardData.averageGPA}
                </h2>

                <p>Average GPA</p>
              </div>
            </div>

            <div className="stat-card">
              <ClipboardCheck size={34} />

              <div>
                <h2>
                  {dashboardData.attendanceRate}%
                </h2>

                <p>Attendance Rate</p>
              </div>
            </div>

          </div>

          {/* Middle Section */}

          <div className="dashboard-row">

            {/* Teacher Performance */}

            <div className="card teacher-card">
              <div className="card-header">
                <TrendingUp size={20} />
                <h3>Teacher Performance</h3>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Courses</th>
                    <th>Students</th>
                    <th>Score</th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher, index) => (
                    <tr key={index}>
                      <td>{teacher.name}</td>
                      <td>{teacher.courses}</td>
                      <td>{teacher.students}</td>
                      <td>
                        <span className="score">
                          {teacher.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Students */}

            <div className="card">
              <div className="card-header">
                <UserPlus size={20} />
                <h3>Recent Students</h3>
              </div>

              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="student-item"
                >
                  <div>
                    <strong>
                      {student.name}
                    </strong>

                    <p>{student.id}</p>
                  </div>

                  <span className="level-badge">
                    {student.level}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Bottom Section */}

          <div className="dashboard-row">

            {/* Activities */}

            <div className="card">
              <div className="card-header">
                <Activity size={20} />
                <h3>Recent Activities</h3>
              </div>

              <ul className="activity-list">
                {activities.map(
                  (activity, index) => (
                    <li key={index}>
                      {activity}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Quick Actions */}

            <div className="card">
              <div className="card-header">
                <BookOpen size={20} />
                <h3>Quick Actions</h3>
              </div>

              <div className="action-buttons">

                <button>
                  Add Teacher
                </button>

                <button>
                  Manage Courses
                </button>

                <button>
                  View Students
                </button>

                <button>
                  Generate Report
                </button>

              </div>
            </div>

          </div>

        </div>
  );
}