import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

export default function ViewTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const teachers = [
    {
      id: "T001",
      name: "Dr. Abebe Kebede",
      email: "abebe@example.com",
      specialization: "Artificial Intelligence",
      experience: "10 years",
    },
  ];

  const teacher = teachers.find((t) => t.id === id);

  if (!teacher)
    return (
      <div className="app-layout">
        <Sidebar />
        <div className="main-content-area">
          <Topbar title="Teacher Details" />
          <div className="content-wrapper">
            <div className="card empty-state">
              <h2>Teacher not found</h2>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Teacher Details" />

        <div className="content-wrapper">
          <div className="teacher-view-card">

            {/* Header */}
            <div className="teacher-header">
              <div className="avatar">
                {teacher.name.charAt(0)}
              </div>

              <div>
                <h2>{teacher.name}</h2>
                <p className="sub-text">{teacher.specialization}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="teacher-grid">
              <div className="info-box">
                <span>Email</span>
                <p>{teacher.email}</p>
              </div>

              <div className="info-box">
                <span>Specialization</span>
                <p>{teacher.specialization}</p>
              </div>

              <div className="info-box">
                <span>Experience</span>
                <p>{teacher.experience}</p>
              </div>

              <div className="info-box">
                <span>Teacher ID</span>
                <p>{teacher.id}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/department/teachers/edit/${id}`)}
              >
                Edit Teacher
              </button>

              <button
                className="back-btn"
                onClick={() => navigate("/department/teachers")}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}