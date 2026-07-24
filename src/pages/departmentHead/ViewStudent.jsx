import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getStudent } from "../../api/departmentApi";

import {
  ArrowLeft,
  User,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  BadgeCheck,
  BookOpen,
  School,
  Users,
  Clock,
  ShieldCheck,
} from "lucide-react";

import "./ViewStudent.css";

export default function ViewStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const { data } = await getStudent(id);
      setStudent(data);
    } catch (err) {
      alert(err.response?.data?.message || "Unable to load student.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "-";

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="profile-loader">
          <div className="loader"></div>
          <p>Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-profile-page">
        <div className="profile-loader">
          <h2>Student not found.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-page">

      <div className="profile-topbar">

        <button
          className="back-button"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18}/>
          Back
        </button>

        <h1>Student Profile</h1>

      </div>

      {/* ================= HEADER ================= */}

      <div className="profile-header">

        <div className="profile-left">

          <div className="student-photo">

            {student.photo ? (
              <img
                src={student.photo}
                alt={student.firstName}
              />
            ) : (
              <User size={90}/>
            )}

          </div>

          <div className="student-basic">

            <h2>
              {student.firstName}{" "}
              {student.fatherName}{" "}
              {student.grandfatherName}
            </h2>

            <p className="student-number">
              Student ID : {student.studentId}
            </p>

            <span className="status-pill">
              {student.enrollmentStatus}
            </span>

          </div>

        </div>

        <div className="profile-right">

          <div className="summary-box">
            <GraduationCap size={22}/>
            <div>
              <label>Department</label>
              <span>{student.department?.name || "-"}</span>
            </div>
          </div>

          <div className="summary-box">
            <BookOpen size={22}/>
            <div>
              <label>Program</label>
              <span>{student.program || "-"}</span>
            </div>
          </div>

          <div className="summary-box">
            <School size={22}/>
            <div>
              <label>Level</label>
              <span>{student.level}</span>
            </div>
          </div>

          <div className="summary-box">
            <Calendar size={22}/>
            <div>
              <label>Semester</label>
              <span>{student.semester}</span>
            </div>
          </div>

          <div className="summary-box">
            <Users size={22}/>
            <div>
              <label>Section</label>
              <span>{student.section}</span>
            </div>
          </div>

          <div className="summary-box">
            <Clock size={22}/>
            <div>
              <label>Batch</label>
              <span>{student.batch || "-"}</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= PERSONAL ================= */}

      <Section
        title="Personal Information"
        icon={<User size={20}/>}
      >

        <Detail
          label="First Name"
          value={student.firstName}
        />

        <Detail
          label="Father Name"
          value={student.fatherName}
        />

        <Detail
          label="Grandfather Name"
          value={student.grandfatherName}
        />

        <Detail
          label="Gender"
          value={student.gender}
        />

        <Detail
          label="Date of Birth"
          value={formatDate(student.dob)}
        />

        <Detail
          label="Nationality"
          value={student.nationality}
        />

      </Section>

      {/* ================= CONTACT ================= */}

      <Section
        title="Contact Information"
        icon={<Phone size={20}/>}
      >

        <Detail
          icon={<Phone size={16}/>}
          label="Phone"
          value={student.phone}
        />

        <Detail
          icon={<Mail size={16}/>}
          label="Email"
          value={student.email}
        />

        <Detail
          icon={<MapPin size={16}/>}
          label="Region"
          value={student.region}
        />

        <Detail
          icon={<MapPin size={16}/>}
          label="Zone"
          value={student.zone}
        />

        <Detail
          icon={<MapPin size={16}/>}
          label="City"
          value={student.city}
        />

        <Detail
          icon={<MapPin size={16}/>}
          label="Woreda"
          value={student.Woreda}
        />

        <Detail
          icon={<MapPin size={16}/>}
          label="Specific Place"
          value={student.SpecificPlace}
        />

        <Detail
          icon={<MapPin size={16}/>}
          label="Address"
          value={student.address}
        />

      </Section>
            {/* ================= ACADEMIC INFORMATION ================= */}

      <Section
        title="Academic Information"
        icon={<GraduationCap size={20} />}
      >
        <Detail
          icon={<Building2 size={16} />}
          label="Department"
          value={student.department?.name}
        />

        <Detail
          icon={<BookOpen size={16} />}
          label="Program"
          value={student.program}
        />

        <Detail
          icon={<School size={16} />}
          label="Level"
          value={student.level}
        />

        <Detail
          icon={<Calendar size={16} />}
          label="Semester"
          value={student.semester}
        />

        <Detail
          icon={<Users size={16} />}
          label="Section"
          value={student.section}
        />

        <Detail
          icon={<Clock size={16} />}
          label="Batch"
          value={student.batch}
        />

        <Detail
          label="Academic Year"
          value={student.academicYear}
        />

        <Detail
          label="Study Mode"
          value={student.studyMode}
        />

        <Detail
          label="Admission Year"
          value={student.admissionYear}
        />

        <Detail
          label="Education Language"
          value={student.educationLanguage}
        />

        <Detail
          label="Registration Date"
          value={formatDate(student.registrationDate)}
        />
      </Section>

      {/* ================= COURSES ================= */}

      <Section
        title="Registered Courses"
        icon={<BookOpen size={20} />}
      >
        <div className="course-list">

          {student.courses?.length ? (
            student.courses.map((course) => (
              <div
                key={course._id}
                className="course-chip"
              >
                {course.code && (
                  <strong>{course.code}</strong>
                )}

                <span>
                  {course.name}
                </span>
              </div>
            ))
          ) : (
            <p>No registered courses.</p>
          )}

        </div>
      </Section>

      {/* ================= PREVIOUS EDUCATION ================= */}

      <Section
        title="Previous Education"
        icon={<School size={20} />}
      >

        <Detail
          label="Institution Name"
          value={student.institutionName}
        />

        <Detail
          label="Highest Qualification"
          value={student.highestQualification}
        />

        <Detail
          label="Previous Institution"
          value={student.previousInstitution}
        />

        <Detail
          label="Previous Education"
          value={student.previousEducation}
        />

        <Detail
          label="Education Type"
          value={student.educationType}
        />

        <Detail
          label="Education Sponsor"
          value={student.educationSponsor}
        />

      </Section>

      {/* ================= COC ================= */}

      <Section
        title="COC Information"
        icon={<BadgeCheck size={20} />}
      >

        <Detail
          label="COC Number"
          value={student.COC}
        />

        <Detail
          label="COC Issue Date"
          value={formatDate(student.COCIssueDate)}
        />

      </Section>

      {/* ================= GUARDIAN ================= */}

      <Section
        title="Guardian Information"
        icon={<Users size={20} />}
      >

        <Detail
          label="Guardian Name"
          value={student.guardianName}
        />

        <Detail
          label="Guardian Phone"
          value={student.guardianPhone}
        />

        <Detail
          label="Relationship"
          value={student.relationship}
        />

      </Section>

      {/* ================= REGISTRATION ================= */}

      <Section
        title="Registration Timeline"
        icon={<Calendar size={20} />}
      >

        <Detail
          label="Education Start Date"
          value={formatDate(student.educationStartDate)}
        />

        <Detail
          label="Education End Date"
          value={formatDate(student.educationEndDate)}
        />

        <Detail
          label="Duration"
          value={
            student.durationMonths
              ? `${student.durationMonths} Months`
              : "-"
          }
        />

      </Section>

      {/* ================= STATUS ================= */}

      <Section
        title="Enrollment Status"
        icon={<ShieldCheck size={20} />}
      >

        <Detail
          label="Status"
          value={student.enrollmentStatus}
        />

        <Detail
          label="Issue Date"
          value={formatDate(student.statusIssueDate)}
        />

        <Detail
          label="Institute"
          value={student.statusInstituteName}
        />

        <Detail
          label="Remark"
          value={student.statusRemark}
        />

      </Section>

      {/* ================= INMATE ================= */}

      {student.isInmate && (
        <Section
          title="Inmate Information"
          icon={<ShieldCheck size={20} />}
        >

          <Detail label="Prison ID" value={student.prisonId} />

          <Detail label="Crime Type" value={student.crimeType} />

          <Detail
            label="Sentence Duration"
            value={
              student.sentenceDuration
                ? `${student.sentenceDuration} Months`
                : "-"
            }
          />

          <Detail
            label="Security Level"
            value={student.securityLevel}
          />

          <Detail
            label="Prison Facility"
            value={student.prisonFacility}
          />

          <Detail
            label="Cell Number"
            value={student.cellNumber}
          />

          <Detail
            label="Imprisonment Start"
            value={formatDate(student.imprisonmentStartDate)}
          />

          <Detail
            label="Expected Release"
            value={formatDate(student.expectedReleaseDate)}
          />

          <Detail
            label="Parole Date"
            value={formatDate(student.paroleDate)}
          />

          <Detail
            label="Current Status"
            value={student.currentStatus}
          />

          <Detail
            label="Assigned Officer"
            value={student.assignedOfficer}
          />

          <Detail
            label="Officer Phone"
            value={student.officerPhone}
          />

        </Section>
      )}

      {/* ================= SYSTEM ================= */}

      <Section
        title="System Information"
        icon={<Clock size={20} />}
      >

        <Detail
          label="Created At"
          value={formatDate(student.createdAt)}
        />

        <Detail
          label="Updated At"
          value={formatDate(student.updatedAt)}
        />

      </Section>

    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Section({
  title,
  icon,
  children,
}) {
  return (
    <div className="profile-section">

      <div className="section-title">
        {icon}
        <h3>{title}</h3>
      </div>

      <div className="section-grid">
        {children}
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
    <div className="detail-card">

      <div className="detail-header">
        {icon}
        <span>{label}</span>
      </div>

      <p>{value || "-"}</p>

    </div>
  );
}