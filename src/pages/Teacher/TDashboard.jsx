import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";

import "./Teacher.css";

export default function TDashboard() {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    attendance: 0,
    gradesPending: 0,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Later replace with backend API
      setStats({
        students: 125,
        courses: 4,
        attendance: 3,
        gradesPending: 18,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="teacher-dashboard-page">

      <div className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <p>
          Manage classes, attendance and grades
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="icon students">
            <Users size={28} />
          </div>

          <div>
            <h2>{stats.students}</h2>
            <p>Students</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon courses">
            <BookOpen size={28} />
          </div>

          <div>
            <h2>{stats.courses}</h2>
            <p>Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon attendance">
            <ClipboardCheck size={28} />
          </div>

          <div>
            <h2>{stats.attendance}</h2>
            <p>Attendance Submitted</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon grades">
            <GraduationCap size={28} />
          </div>

          <div>
            <h2>{stats.gradesPending}</h2>
            <p>Pending Grades</p>
          </div>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="card">
          <h3>My Courses</h3>

          <ul>
            <li>Programming I</li>
            <li>Database Systems</li>
            <li>Computer Networks</li>
            <li>Web Development</li>
          </ul>
        </div>

        <div className="card">
          <h3>Recent Students</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>ST001</td>
                <td>Abebe Kebede</td>
              </tr>

              <tr>
                <td>ST002</td>
                <td>Tigist Tadesse</td>
              </tr>

              <tr>
                <td>ST003</td>
                <td>Meron Alemu</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <div className="quick-actions">

        <div className="action-card">
          <ClipboardCheck size={30} />
          <h4>Take Attendance</h4>
        </div>

        <div className="action-card">
          <GraduationCap size={30} />
          <h4>Enter Grades</h4>
        </div>

        <div className="action-card">
          <BookOpen size={30} />
          <h4>View Courses</h4>
        </div>

      </div>

    </div>
  );
}