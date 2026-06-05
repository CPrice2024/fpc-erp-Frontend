import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../../components/common/Sidebar";
import Topbar from "../../../components/common/Topbar";

export default function ViewStudent() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const student = state || {
    id: "ST001",
    name: "Abebe Kebede",
    email: "abebe@example.com",
    department: "Computer Science",
    type: "Regular",
    batch: "10",
    status: "Active",
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="View Student" />

        <div className="teacher-dashboard">
          <div className="dashboard-header">
            <h1>Student Details</h1>

            <button
              className="register-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>

          <div className="card_table">
            <div className="form-grid">

              <div>
                <label>ID</label>
                <input value={student.id} readOnly />
              </div>

              <div>
                <label>Full Name</label>
                <input value={student.name} readOnly />
              </div>

              <div>
                <label>Email</label>
                <input value={student.email} readOnly />
              </div>

              <div>
                <label>Department</label>
                <input value={student.department} readOnly />
              </div>

              <div>
                <label>Type</label>
                <input value={student.type} readOnly />
              </div>

              <div>
                <label>Batch</label>
                <input value={student.batch} readOnly />
              </div>

              <div>
                <label>Status</label>
                <input value={student.status} readOnly />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}