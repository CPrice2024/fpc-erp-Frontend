import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../../components/common/Sidebar";
import Topbar from "../../../components/common/Topbar";

export default function EditStudent() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [student, setStudent] = useState(
    state || {
      id: "ST001",
      name: "",
      email: "",
      department: "",
      type: "",
      batch: "",
      status: "",
    }
  );

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const saveStudent = () => {
    alert("Student Updated Successfully");
    navigate("/teacher/students");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Edit Student" />

        <div className="teacher-dashboard">
          <div className="dashboard-header">
            <h1>Edit Student</h1>

            <button
              className="register-btn"
              onClick={saveStudent}
            >
              Save Changes
            </button>
          </div>

          <div className="card_table">
            <div className="form-grid">

              <input
                name="id"
                value={student.id}
                readOnly
              />

              <input
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Full Name"
              />

              <input
                name="email"
                value={student.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <input
                name="department"
                value={student.department}
                onChange={handleChange}
                placeholder="Department"
              />

              <input
                name="type"
                value={student.type}
                onChange={handleChange}
                placeholder="Type"
              />

              <input
                name="batch"
                value={student.batch}
                onChange={handleChange}
                placeholder="Batch"
              />

              <input
                name="status"
                value={student.status}
                onChange={handleChange}
                placeholder="Status"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}