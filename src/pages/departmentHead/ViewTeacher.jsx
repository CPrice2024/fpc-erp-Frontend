import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getTeacher } from "../../api/departmentAPI";

import {
  ArrowLeft,
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Briefcase,
  Building2,
  Clock,
  ShieldCheck,
} from "lucide-react";

import "./ViewTeacher.css";

export default function ViewTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      const { data } = await getTeacher(id);
      setTeacher(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load teacher");
    } finally {
      setLoading(false);
    }
  };

  if (loading) 
    return (
      <div className="attendance-page">

        <div className="page-loader">

          <div className="loading-spinner"></div>

          <p>Loading Teacher...</p>

        </div>

      </div>
    );

  if (!teacher) return <h2>Teacher not found.</h2>;

  return (
    <div className="view-teacher-page">

      <div className="page-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Teacher Profile</h1>

      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {teacher.name?.charAt(0).toUpperCase()}
        </div>

        <h2>{teacher.name}</h2>

        <p>{teacher.email}</p>

      </div>

      <div className="details-card">

        <div className="detail-row">

          <User size={18} />

          <span>Full Name</span>

          <strong>{teacher.name}</strong>

        </div>

        <div className="detail-row">

          <Mail size={18} />

          <span>Email</span>

          <strong>{teacher.email}</strong>

        </div>

        <div className="detail-row">

          <GraduationCap size={18} />

          <span>Gender</span>

          <strong>{teacher.gender || "-"}</strong>

        </div>

        <div className="detail-row">

          <Briefcase size={18} />

          <span>Specialization</span>

          <strong>{teacher.specialization || "-"}</strong>

        </div>

        <div className="detail-row">

          <Clock size={18} />

          <span>Experience</span>

          <strong>
            {teacher.experience || 0} Years
          </strong>

        </div>

        <div className="detail-row">

          <BookOpen size={18} />

          <span>Course</span>

          <strong>
            {teacher.course
              ? `${teacher.course.courseCode} - ${teacher.course.courseName}`
              : "Not Assigned"}
          </strong>

        </div>

        <div className="detail-row">

          <Building2 size={18} />

          <span>Department</span>

          <strong>
            {teacher.department?.name || "-"}
          </strong>

        </div>

        <div className="detail-row">

          <ShieldCheck size={18} />

          <span>Status</span>

          <strong>{teacher.status}</strong>

        </div>

      </div>

    </div>
  );
}