
import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import { PlusCircle, Users, Filter } from "lucide-react";

export default function StudentsByDepartment() {
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    department: "",
    batch: "",
    type: "Regular",
  });

  const [students, setStudents] = useState([]);

  const departments = ["Computer Science", "Law", "Business", "Engineering"];

  const [selectedDept, setSelectedDept] = useState("All");

  // Handle input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Register student
  const handleSubmit = () => {
    if (!formData.name || !formData.department) {
      alert("Name and Department required");
      return;
    }

    setStudents([
      ...students,
      {
        ...formData,
        id: "ST" + (students.length + 1).toString().padStart(3, "0"),
        status: "Active",
      },
    ]);

    setFormData({
      id: "",
      name: "",
      email: "",
      department: "",
      batch: "",
      type: "Regular",
    });

    setShowForm(false);
  };

  // Group students by department
  const groupedStudents = students.reduce((acc, student) => {
    if (!acc[student.department]) acc[student.department] = [];
    acc[student.department].push(student);
    return acc;
  }, {});

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Students Management" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">

            {/* Header */}
            <div className="dashboard-header">
              <div>
                <h1>Students</h1>
                <p>Register and manage students by department</p>
              </div>

              <button
                className="register-btn"
                onClick={() => setShowForm(true)}
              >
                <PlusCircle size={18} /> Register Student
              </button>
            </div>

            {/* Filter */}
            <div className="card">
              <div style={{ display: "flex", gap: "10px" }}>
                <Filter size={18} />
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                >
                  <option value="All">All Departments</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student List by Department */}
            {Object.keys(groupedStudents).map((dept) => {
              if (selectedDept !== "All" && selectedDept !== dept) return null;

              return (
                <div key={dept} className="card">
                  <h3>{dept}</h3>

                  <table className="student-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Batch</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {groupedStudents[dept].map((student) => (
                        <tr key={student.id}>
                          <td>{student.id}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.batch}</td>
                          <td>{student.type}</td>
                          <td>
                            <span className="status active">
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* Register Modal */}
            {showForm && (
              <div className="modal">
                <div className="modal-content">
                  <h2>Register Student</h2>

                  <input
                    name="name"
                    placeholder="Student Name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>

                  <input
                    name="batch"
                    placeholder="Batch"
                    value={formData.batch}
                    onChange={handleChange}
                  />

                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option>Regular</option>
                    <option>Inmate</option>
                  </select>

                  <div className="modal-actions">
                    <button onClick={handleSubmit} className="register-btn">
                      Save
                    </button>

                    <button
                      onClick={() => setShowForm(false)}
                      className="filter-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <footer className="dashboard-footer">
              <p>© 2026 Federal Prison Commission — Student Management</p>
            </footer>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .student-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .student-table th,
        .student-table td {
          padding: 10px;
          border-bottom: 1px solid #eee;
        }

        .status.active {
          background: #10b98122;
          color: #10b981;
          padding: 4px 8px;
          border-radius: 10px;
        }

        .modal {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 12px;
          width: 400px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .modal-content input,
        .modal-content select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}