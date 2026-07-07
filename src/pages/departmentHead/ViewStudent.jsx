import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getStudent,
} from "../../api/departmentAPI";

import {
  ArrowLeft,
  User,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  BookOpen,
  BadgeCheck,
} from "lucide-react";

import "./ViewStudent.css";

export default function ViewStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const { data } = await getStudent(id);
      setStudent(data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load student."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-student-page">
        <div className="page-loader">
          <div className="loading-spinner"></div>
          <p>Loading student...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="view-student-page">
        <div className="page-loader">
          <p>Student not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-student-page">

      <div className="page-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Student Profile</h1>

      </div>

      {/* Profile Card */}

      <div className="student-profile-card">

        <div className="student-avatar">

          {student.photo ? (
            <img
              src={student.photo}
              alt={student.firstName}
            />
          ) : (
            <User size={70} />
          )}

        </div>

        <div>

          <h2>
            {student.firstName}{" "}
            {student.fatherName}{" "}
            {student.grandfatherName}
          </h2>

          <p>{student.studentId}</p>

          <span
            className={`status-badge ${
              student.status || "active"
            }`}
          >
            {student.status || "active"}
          </span>

        </div>

      </div>

      {/* Personal Information */}

      <div className="info-card">

        <h3>
          <User size={18} />
          Personal Information
        </h3>

        <div className="details-grid">

          <Detail
            icon={<User size={18} />}
            label="Gender"
            value={student.gender}
          />

          <Detail
            icon={<Calendar size={18} />}
            label="Date of Birth"
            value={
              student.dob
                ? new Date(
                    student.dob
                  ).toLocaleDateString()
                : "-"
            }
          />

          <Detail
            icon={<BadgeCheck size={18} />}
            label="Nationality"
            value={student.nationality}
          />

        </div>

      </div>

      {/* Academic */}

      <div className="info-card">

        <h3>
          <GraduationCap size={18} />
          Academic Information
        </h3>

        <div className="details-grid">

          <Detail
            icon={<Building2 size={18} />}
            label="Department"
            value={student.department?.name}
          />

          <Detail
            icon={<BookOpen size={18} />}
            label="Level"
            value={student.level}
          />

          <Detail
            icon={<BookOpen size={18} />}
            label="Semester"
            value={student.semester}
          />

          <Detail
            icon={<BookOpen size={18} />}
            label="Section"
            value={student.section}
          />

        </div>

      </div>

      {/* Contact */}

      <div className="info-card">

        <h3>
          <Phone size={18} />
          Contact Information
        </h3>

        <div className="details-grid">

          <Detail
            icon={<Phone size={18} />}
            label="Phone"
            value={student.phone}
          />

          <Detail
            icon={<Mail size={18} />}
            label="Email"
            value={student.email}
          />

          <Detail
            icon={<MapPin size={18} />}
            label="Region"
            value={student.region}
          />

          <Detail
            icon={<MapPin size={18} />}
            label="City"
            value={student.city}
          />

          <Detail
            icon={<MapPin size={18} />}
            label="Woreda"
            value={student.woreda}
          />

          <Detail
            icon={<MapPin size={18} />}
            label="Specific Place"
            value={student.specificPlace}
          />

          <Detail
            icon={<MapPin size={18} />}
            label="Address"
            value={student.address}
          />

        </div>

      </div>

    </div>
  );
}

function Detail({
  icon,
  label,
  value,
}) {
  return (
    <div className="detail-item">

      {icon}

      <div>

        <label>{label}</label>

        <p>{value || "-"}</p>

      </div>

    </div>
  );
}