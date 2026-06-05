// src/pages/Students.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Download,
  Filter,
} from "lucide-react";

export default function Students() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // Make students editable
  const [students, setStudents] = useState([
    {
      id: "ST001",
      name: "Abebe Kebede",
      email: "abebe@example.com",
      department: "Computer Science",
      type: "Regular",
      batch: "10",
      date: "2023-09-01",
      status: "Active",
    },
    {
      id: "ST002",
      name: "Tigist Alemu",
      email: "tigist@example.com",
      department: "Law",
      type: "Inmate",
      batch: "10",
      date: "2023-09-02",
      status: "Active",
    },
    {
      id: "ST003",
      name: "Mohammed Ahmed",
      email: "mohammed@example.com",
      department: "Business",
      type: "Regular",
      batch: "11",
      date: "2023-09-03",
      status: "Inactive",
    },
  ]);

  // Search Filter
  const filteredStudents = students.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.department.toLowerCase().includes(search.toLowerCase())
  );

  // VIEW FUNCTION
  const viewStudent = (student) => {
    navigate(`/teacher/students/view/${student.id}`, {
      state: student,
    });
  };

  // EDIT FUNCTION
  const editStudent = (student) => {
    navigate(`/teacher/students/edit/${student.id}`, {
      state: student,
    });
  };

  // DELETE FUNCTION
  const deleteStudent = (id) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${id}?`
    );

    if (confirmDelete) {
      setStudents(students.filter((item) => item.id !== id));
    }
  };

  const exportData = () => {
    alert("Download Student Report");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Students" />

        <div className="teacher-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1>Student List</h1>
              <p>Manage all students</p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                className="register-btn"
                onClick={() =>
                  navigate("/teacher/students/register")
                }
              >
                Register Student
              </button>
              <button
                className="register-btn"
                onClick={exportData}
              >
                <Download size={18} />
                Download Report
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="card_table" style={{ marginBottom: "20px" }}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
          </div>

          {/* Table */}
          <div className="card">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.department}</td>
                    <td>{student.type}</td>
                    <td>{student.batch}</td>
                    <td>{student.status}</td>

                    <td>
                      <div className="action-btns">
                        {/* VIEW */}
                        <button
                          title="View"
                          onClick={() =>
                            viewStudent(student)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        {/* EDIT */}
                        <button
                          title="Edit"
                          onClick={() =>
                            editStudent(student)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        {/* DELETE */}
                        <button
                          title="Delete"
                          onClick={() =>
                            deleteStudent(student.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}