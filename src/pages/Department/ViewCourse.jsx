import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

export default function ViewCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const courses = [
    {
      id: "C001",
      name: "Intro to Programming",
      code: "CS101",
      teacher: "Dr. Abebe Kebede",
      credit: 3,
    },
  ];

  const course = courses.find((c) => c.id === id);

  if (!course) return <p>Course not found</p>;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-area">
        <Topbar title="Course Details" />

        <div className="content-wrapper">
          <div className="card">
            <h2>{course.name}</h2>

            <p><b>Code:</b> {course.code}</p>
            <p><b>Teacher:</b> {course.teacher}</p>
            <p><b>Credit:</b> {course.credit}</p>

            <button
              className="register-btn"
              onClick={() => navigate(`/department/courses/edit/${id}`)}
            >
              Edit Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}