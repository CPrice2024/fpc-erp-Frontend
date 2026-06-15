import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  BookOpen,
  GraduationCap,
  Award,
  User,
  Building2,
  Calendar,
  Clock,
  ArrowLeft,
  Edit2,
  CheckCircle,
  XCircle
} from "lucide-react";
import "./CourseForm.css"

export default function ViewCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="view-course-page">
        <div className="page-loader">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="view-course-page">
        <div className="page-loader">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-course-page">
      <div className="view-header">
        <h1>{course.courseName}</h1>
        <span className="course-code">{course.courseCode}</span>
      </div>

      <div className="course-details-card">
        <div className="detail-row">
          <BookOpen size={18} />
          <span>Course Name</span>
          <strong>{course.courseName}</strong>
        </div>

        <div className="detail-row">
          <GraduationCap size={18} />
          <span>Level</span>
          <strong>{course.level || "Not specified"}</strong>
        </div>

        <div className="detail-row">
          <Award size={18} />
          <span>Credit Hour</span>
          <strong>{course.creditHour}</strong>
        </div>

        <div className="detail-row">
          <Building2 size={18} />
          <span>Department</span>
          <strong>{course.department?.name || "Not assigned"}</strong>
        </div>

        <div className="detail-row">
          <User size={18} />
          <span>Teacher</span>
          <strong>{course.teacher?.name || "Not Assigned"}</strong>
        </div>

        <div className="detail-row">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {course.status === "active" ? (
              <CheckCircle size={18} color="#16a34a" />
            ) : (
              <XCircle size={18} color="#dc2626" />
            )}
            <span>Status</span>
          </div>
          <strong>
            <span className={`status-badge ${course.status === "active" ? "active" : "inactive"}`}>
              {course.status === "active" ? "Active" : "Inactive"}
            </span>
          </strong>
        </div>

        <div className="detail-row">
          <Calendar size={18} />
          <span>Created</span>
          <strong>{formatDate(course.createdAt)}</strong>
        </div>

        {course.updatedAt && course.updatedAt !== course.createdAt && (
          <div className="detail-row">
            <Clock size={18} />
            <span>Last Updated</span>
            <strong>{formatDate(course.updatedAt)}</strong>
          </div>
        )}
      </div>

      <div className="form-actions" style={{ maxWidth: 700, margin: "24px auto 0" }}>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/department-head/courses")}
        >
          <ArrowLeft size={16} />
          Back to Courses
        </button>
        <button
          type="button"
          className="save-btn"
          onClick={() => navigate(`/department-head/courses/edit/${course._id}`)}
        >
          <Edit2 size={16} />
          Edit Course
        </button>
      </div>
    </div>
  );
}