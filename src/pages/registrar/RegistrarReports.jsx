
import { useState } from "react";

import {
  FileText,
  Download,
  Printer,
  Users,
  GraduationCap,
  Building2,
  BarChart3,
} from "lucide-react";

import "./Reports.css";

export default function Reports() {
  const [filters, setFilters] =
    useState({
      department: "",
      level: "",
      gender: "",
      year: "",
    });

  const stats = {
    students: 524,
    active: 487,
    departments: 8,
    admissions: 142,
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]:
        e.target.value,
    });
  };

  const generateReport = () => {
    alert(
      "Report Generated Successfully"
    );
  };

  const exportPDF = () => {
    alert("PDF Export");
  };

  const exportExcel = () => {
    alert("Excel Export");
  };

  const printReport = () => {
    window.print();
  };

  return (
        <div className="reports-page">

          {/* Header */}

          <div className="page-header">
            <div>
              <h1>
                Registrar Reports
              </h1>

              <p>
                Generate academic,
                admission and
                student reports.
              </p>
            </div>
          </div>

          {/* Cards */}

          <div className="stats-grid">

            <div className="stat-card">
              <Users size={32} />
              <h2>
                {stats.students}
              </h2>
              <p>
                Total Students
              </p>
            </div>

            <div className="stat-card">
              <GraduationCap
                size={32}
              />
              <h2>
                {stats.active}
              </h2>
              <p>
                Active Students
              </p>
            </div>

            <div className="stat-card">
              <Building2
                size={32}
              />
              <h2>
                {
                  stats.departments
                }
              </h2>
              <p>
                Departments
              </p>
            </div>

            <div className="stat-card">
              <BarChart3
                size={32}
              />
              <h2>
                {
                  stats.admissions
                }
              </h2>
              <p>
                New Admissions
              </p>
            </div>

          </div>

          {/* Filters */}

          <div className="card">

            <h2>
              Report Filters
            </h2>

            <div className="filter-grid">

              <select
                name="department"
                value={
                  filters.department
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  All Departments
                </option>

                <option>
                  Computer Science
                </option>

                <option>
                  Electrical
                  Engineering
                </option>

                <option>
                  Accounting
                </option>
              </select>

              <select
                name="level"
                value={
                  filters.level
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  All Levels
                </option>

                <option>
                  Level I
                </option>

                <option>
                  Level II
                </option>

                <option>
                  Level III
                </option>

                <option>
                  Level IV
                </option>

                <option>
                  Level V
                </option>
              </select>

              <select
                name="gender"
                value={
                  filters.gender
                }
                onChange={
                  handleChange
                }
              >
                <option value="">
                  All Genders
                </option>

                <option>
                  Male
                </option>

                <option>
                  Female
                </option>
              </select>

              <input
                type="number"
                name="year"
                placeholder="Academic Year"
                value={
                  filters.year
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

          {/* Report Types */}

          <div className="card">

            <h2>
              Report Types
            </h2>

            <div className="report-grid">

              <div className="report-card">
                <FileText
                  size={30}
                />

                <h3>
                  Student Report
                </h3>

                <p>
                  Complete student
                  listing report
                </p>
              </div>

              <div className="report-card">
                <FileText
                  size={30}
                />

                <h3>
                  Admission Report
                </h3>

                <p>
                  New admissions
                  statistics
                </p>
              </div>

              <div className="report-card">
                <FileText
                  size={30}
                />

                <h3>
                  Department Report
                </h3>

                <p>
                  Department-wise
                  student report
                </p>
              </div>

              <div className="report-card">
                <FileText
                  size={30}
                />

                <h3>
                  Gender Report
                </h3>

                <p>
                  Male/Female
                  distribution
                </p>
              </div>

            </div>

          </div>

          {/* Actions */}

          <div className="card">

            <h2>
              Actions
            </h2>

            <div className="action-buttons">

              <button
                className="generate-btn"
                onClick={
                  generateReport
                }
              >
                <FileText
                  size={18}
                />
                Generate
              </button>

              <button
                className="pdf-btn"
                onClick={
                  exportPDF
                }
              >
                <Download
                  size={18}
                />
                PDF
              </button>

              <button
                className="excel-btn"
                onClick={
                  exportExcel
                }
              >
                <Download
                  size={18}
                />
                Excel
              </button>

              <button
                className="print-btn"
                onClick={
                  printReport
                }
              >
                <Printer
                  size={18}
                />
                Print
              </button>

            </div>

          </div>

        </div>
  );
}