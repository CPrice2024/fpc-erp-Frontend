import { useEffect, useState } from "react";
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Clock, 
  AlertCircle,
  RefreshCw,
  User
} from "lucide-react";
import { teacherAPI } from "../../services/teacherAPI";
import "./MyCourse.css";

export default function MyCourse() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await teacherAPI.myCourse();
      setCourse(data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Failed to load course.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="teacher-course-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="teacher-course-page">
        <div className="empty-state">
          <AlertCircle size={48} />
          <h2>Unable to Load Course</h2>
          <p>{error}</p>
          <button 
            className="retry-btn" 
            onClick={loadCourse}
            style={{
              marginTop: "12px",
              padding: "10px 24px",
              background: "#1a1f2e",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="teacher-course-page">
        <div className="empty-state">
          <BookOpen size={48} />
          <h2>No Course Assigned</h2>
          <p>You haven't been assigned a course yet. Please contact your department head.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-course-page">
      <div className="page-header">
        <h1>
          <BookOpen size={18} />
          My Course
        </h1>
        <p>View your assigned teaching course details</p>
      </div>

      <div className="course-card">
        <div className="course-title">
          <BookOpen size={18} />
          <div>
            <h2>{course.courseName}</h2>
            <p>{course.courseCode}</p>
          </div>
        </div>

        <div className="course-grid">
          <div className="info-box">
            <GraduationCap size={22} />
            <div>
              <span>Level</span>
              <strong>{course.level || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <Clock size={22} />
            <div>
              <span>Semester</span>
              <strong>{course.semester || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <Building2 size={22} />
            <div>
              <span>Department</span>
              <strong>{course.department?.name || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <BookOpen size={22} />
            <div>
              <span>Credit Hour</span>
              <strong>{course.creditHour || "N/A"}</strong>
            </div>
          </div>

          <div className="info-box">
            <User size={22} />
            <div>
              <span>Section</span>
              <strong>{course.section || "N/A"}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}