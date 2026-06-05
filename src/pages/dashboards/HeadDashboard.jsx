import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import {
  Users,
  School,
  UserCheck,
  Plus,
  Eye,
  Settings,
} from "lucide-react";

export default function HeadDashboard() {
  const [departmentHeads, setDepartmentHeads] = useState([
    { id: 1, name: "Dr. Abebe", department: "Computer Science" },
    { id: 2, name: "Dr. Tigist", department: "Law" },
  ]);

  const [registrars, setRegistrars] = useState([
    { id: 1, name: "Mr. Samuel", office: "Main Registrar" },
  ]);

  const stats = {
    totalStudents: 324,
    totalDepartments: 6,
    attendanceRate: 92,
  };

  const removeDeptHead = (id) => {
    setDepartmentHeads(departmentHeads.filter((d) => d.id !== id));
  };

  const removeRegistrar = (id) => {
    setRegistrars(registrars.filter((r) => r.id !== id));
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="College Head Dashboard" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">

            {/* HEADER */}
            <div className="dashboard-header">
              <h1>College Overview</h1>
              <p>Control departments, registrar, and system performance</p>
            </div>

            {/* STATS */}
            <div className="stats-grid">
              <div className="stat-card">
                <Users size={24} />
                <h2>{stats.totalStudents}</h2>
                <p>Students</p>
              </div>

              <div className="stat-card">
                <School size={24} />
                <h2>{stats.totalDepartments}</h2>
                <p>Departments</p>
              </div>

              <div className="stat-card">
                <UserCheck size={24} />
                <h2>{stats.attendanceRate}%</h2>
                <p>Attendance</p>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="card">
              <h3>Quick Actions</h3>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button className="register-btn">
                  <Plus size={16} /> Add Department Head
                </button>

                <button className="filter-btn">
                  <Plus size={16} /> Add Registrar
                </button>

                <button className="filter-btn">
                  <Settings size={16} /> System Settings
                </button>
              </div>
            </div>

            {/* DEPARTMENT HEAD MANAGEMENT */}
            <div className="card">
              <h3>Department Heads</h3>

              <table className="student-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {departmentHeads.map((head) => (
                    <tr key={head.id}>
                      <td>{head.name}</td>
                      <td>{head.department}</td>
                      <td>
                        <button className="action-btn">
                          <Eye size={16} />
                        </button>

                        <button
                          className="action-btn danger"
                          onClick={() => removeDeptHead(head.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* REGISTRAR MANAGEMENT */}
            <div className="card">
              <h3>Registrar Office</h3>

              <table className="student-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Office</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {registrars.map((reg) => (
                    <tr key={reg.id}>
                      <td>{reg.name}</td>
                      <td>{reg.office}</td>
                      <td>
                        <button className="action-btn">
                          <Eye size={16} />
                        </button>

                        <button
                          className="action-btn danger"
                          onClick={() => removeRegistrar(reg.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* FOOTER */}
            <footer className="dashboard-footer">
              <p>© 2026 College Management System — Head Control Panel</p>
            </footer>

          </div>
        </div>
      </div>

      <style>{`
        .action-btn {
          margin-right: 8px;
          padding: 6px 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          background: #eee;
        }

        .action-btn.danger {
          background: #fee2e2;
          color: #ef4444;
        }
      `}</style>
    </div>
  );
}