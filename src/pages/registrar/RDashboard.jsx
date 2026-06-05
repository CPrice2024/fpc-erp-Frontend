// src/pages/registrar/RegistrarDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  GraduationCap,
  Building2,
  Users,
  UserPlus,
  RefreshCcw,
  BookOpen,
  ClipboardList,
} from "lucide-react";

import "./RegistrarDashboard.css";

export default function RegistrarDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalStudents: 0,
      totalDepartments: 0,
      totalTeachers: 0,
    });

  const fetchDashboard =
    async () => {
      try {
        setLoading(true);

        const res =
          await api.get(
            "/registrars/dashboard"
          );

        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (

        <div className="registrar-dashboard">

          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1>
                Registrar Dashboard
              </h1>

              <p>
                Manage student
                enrollment, academic
                records and
                departments.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={
                fetchDashboard
              }
            >
              <RefreshCcw
                size={16}
              />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="icon students">
                <GraduationCap
                  size={28}
                />
              </div>

              <div>
                <h2>
                  {loading
                    ? "..."
                    : stats.totalStudents}
                </h2>

                <p>
                  Total Students
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="icon departments">
                <Building2
                  size={28}
                />
              </div>

              <div>
                <h2>
                  {loading
                    ? "..."
                    : stats.totalDepartments}
                </h2>

                <p>
                  Departments
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="icon teachers">
                <Users size={28} />
              </div>

              <div>
                <h2>
                  {loading
                    ? "..."
                    : stats.totalTeachers}
                </h2>

                <p>
                  Teachers
                </p>
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2>
              Quick Actions
            </h2>

            <div className="actions-grid">

              <button
                className="action-card"
                onClick={() =>
                  navigate(
                    "/registrar/enrollment"
                  )
                }
              >
                <UserPlus
                  size={35}
                />

                <h3>
                  Student Enrollment
                </h3>

                <p>
                  Register a new
                  student
                </p>
              </button>

              <button
                className="action-card"
                onClick={() =>
                  navigate(
                    "/registrar/students"
                  )
                }
              >
                <ClipboardList
                  size={35}
                />

                <h3>
                  Student List
                </h3>

                <p>
                  View all students
                </p>
              </button>

              <button
                className="action-card"
                onClick={() =>
                  navigate(
                    "/departments"
                  )
                }
              >
                <Building2
                  size={35}
                />

                <h3>
                  Departments
                </h3>

                <p>
                  View departments
                </p>
              </button>

              <button
                className="action-card"
              >
                <BookOpen
                  size={35}
                />

                <h3>
                  Reports
                </h3>

                <p>
                  Academic reports
                </p>
              </button>

            </div>
          </div>

          {/* Overview */}
          <div className="card">
            <h2>
              Academic Summary
            </h2>

            <div className="summary-grid">

              <div className="summary-item">
                <span>
                  Registered Students
                </span>

                <strong>
                  {
                    stats.totalStudents
                  }
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Departments
                </span>

                <strong>
                  {
                    stats.totalDepartments
                  }
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  Teachers
                </span>

                <strong>
                  {
                    stats.totalTeachers
                  }
                </strong>
              </div>

            </div>
          </div>

        </div>
  );
}