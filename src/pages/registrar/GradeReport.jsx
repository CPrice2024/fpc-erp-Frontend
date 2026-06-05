// src/pages/registrar/GradeReport.jsx

import { useState } from "react";
import {
  Search,
  Printer,
  Download,
  FileText,
} from "lucide-react";

import "./GradeReport.css";

export default function GradeReport() {
  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [semester, setSemester] =
    useState("");

  const reports = [
    {
      id: "ST0001",
      name: "Abebe Kebede",
      department:
        "Computer Science",
      semester: "Semester 1",
      gpa: 3.75,
      status: "Passed",
    },
    {
      id: "ST0002",
      name: "Tigist Alemu",
      department:
        "Electrical Engineering",
      semester: "Semester 2",
      gpa: 2.95,
      status: "Passed",
    },
    {
      id: "ST0003",
      name: "Dawit Bekele",
      department:
        "Computer Science",
      semester: "Semester 1",
      gpa: 1.95,
      status: "Warning",
    },
  ];

  const filteredReports =
    reports.filter((r) => {
      return (
        (search === "" ||
          r.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          r.id
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )) &&
        (department === "" ||
          r.department ===
            department) &&
        (semester === "" ||
          r.semester === semester)
      );
    });

  const printReport = () => {
    window.print();
  };

  return (

        <div className="grade-report-page">

          {/* Header */}
          <div className="page-header">
            <div>
              <h1>
                Grade Reports
              </h1>

              <p>
                View student
                academic
                performance and GPA
                reports.
              </p>
            </div>

            <div className="header-actions">
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

              <button className="export-btn">
                <Download
                  size={18}
                />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-card">

            <div className="search-box">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />
            </div>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
            >
              <option value="">
                All Departments
              </option>

              <option>
                Computer Science
              </option>

              <option>
                Electrical Engineering
              </option>
            </select>

            <select
              value={semester}
              onChange={(e) =>
                setSemester(
                  e.target.value
                )
              }
            >
              <option value="">
                All Semesters
              </option>

              <option>
                Semester 1
              </option>

              <option>
                Semester 2
              </option>
            </select>

          </div>

          {/* Report Table */}
          <div className="table-card">

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>GPA</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map(
                  (report) => (
                    <tr
                      key={report.id}
                    >
                      <td>
                        {report.id}
                      </td>

                      <td>
                        {report.name}
                      </td>

                      <td>
                        {
                          report.department
                        }
                      </td>

                      <td>
                        {
                          report.semester
                        }
                      </td>

                      <td>
                        {report.gpa}
                      </td>

                      <td>
                        <span
                          className={`status ${
                            report.status ===
                            "Passed"
                              ? "passed"
                              : "warning"
                          }`}
                        >
                          {
                            report.status
                          }
                        </span>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

          </div>

          {/* Summary */}
          <div className="summary-card">

            <FileText
              size={40}
            />

            <div>
              <h3>
                Total Reports
              </h3>

              <p>
                {
                  filteredReports.length
                }{" "}
                Student Records
              </p>
            </div>

          </div>

        </div>
  );
}