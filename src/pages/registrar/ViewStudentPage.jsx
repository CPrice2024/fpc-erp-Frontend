import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  BookOpen,
  CheckCircle,
  XCircle,
  Download,
  MapPin,
  Hash,
  Building,
  Clock,
  TrendingUp,
  TrendingDown,
  Edit,
  BarChart3,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
AlertCircle,
} from "lucide-react";
import "./ViewStudentPage.css";
import { useRef } from "react";

import RegistrationSlipPDF
from "../../components/pdf/RegistrationSlipPDF";

import StudentProfilePDF
from "../../components/pdf/StudentProfilePDF";

import TranscriptPDF
from "../../components/pdf/TranscriptPDF";

import TVETTrainerDataSheetPDF
from "../../components/pdf/TVETTrainerDataSheetPDF";

export default function ViewStudentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ===== STATES =====
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [courseFilter, setCourseFilter] = useState("all"); // all, passed, failed, in-progress
  const [courseSearch, setCourseSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState(null);

  const transcriptRef = useRef(null);
  const profileRef = useRef(null);
  const slipRef = useRef(null);
  const trainerSheetRef = useRef(null);
  const downloadPDF = async (
  ref,
  fileName
) => {

  if (!ref.current) return;

  const canvas =
    await html2canvas(ref.current, {

      scale: 2,

      useCORS: true,

      backgroundColor: "#ffffff",

    });

  const imgData =
    canvas.toDataURL("image/png");

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const pdfWidth =
    pdf.internal.pageSize.getWidth();

  const pdfHeight =
    (canvas.height * pdfWidth) /
    canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save(fileName);

};
  const [courseStats, setCourseStats] = useState({
    total: 0,
    passed: 0,
    failed: 0,
    inProgress: 0,
    averageGrade: 0,
    totalnominalDurations: 0,
    gpa: 0,
    bySemester: {},
    byDepartment: {},
  });
  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    excused: 0,
    total: 0,
    rate: 0,
  });

  // ===== FETCH STUDENT DATA =====
  useEffect(() => {
    const fetchStudentData = async () => {
      setLoading(true);
      try {
        // Fetch student details
       const studentRes =
  await api.get(
    `/registrars/students/${id}`
  );

setStudent(studentRes.data);

const { data } = await api.get(
  `/registrars/students/${id}/courses`
);

setCourses(data);
console.log(data);

try {
  const enrollRes =
    await api.get(
      `/registrars/students/${id}/enrollments`
    );

  setEnrollments(
    enrollRes.data || []
  );
} catch {
  setEnrollments([]);
}

try {
  const attendanceRes =
    await api.get(
      `/registrars/students/${id}/attendance`
    );

  setAttendance(
    attendanceRes.data || []
  );

  calculateAttendanceStats(
    attendanceRes.data || []
  );
} catch {
  setAttendance([]);
}

        setError(null);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.response?.data?.message || "Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id]);


  // ===== CALCULATE COURSE STATISTICS =====
  const calculateCourseStats = (courseData) => {
    const total = courseData.length;
    let passed = 0;
    let failed = 0;
    let inProgress = 0;
    let totalPoints = 0;
    let totalnominalDurations = 0;
    const bySemester = {};
    const byDepartment = {};

    courseData.forEach(course => {
      const status = course.status || course.gradeStatus || "in-progress";
      const nominalDurations = course.nominalDurations || 3;
      const gradePoint = getGradePoint(course.grade);

      // Count by status
      if (status === "passed" || (course.grade && course.grade !== 'F' && course.grade !== 'D' && course.grade !== 'W')) {
        passed++;
        totalPoints += gradePoint * nominalDurations;
      } else if (status === "failed" || course.grade === 'F' || course.grade === 'D') {
        failed++;
      } else {
        inProgress++;
      }

      totalnominalDurations += nominalDurations;

      // Group by semester
      const semester = course.semester || "N/A";
      bySemester[semester] = (bySemester[semester] || 0) + 1;

      // Group by department
      const dept = course.department?.name || course.department || "N/A";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });

    const gpa = totalnominalDurations > 0 ? (totalPoints / totalnominalDurations) : 0;
    const averageGrade = total > 0 ? (totalPoints / total) : 0;

    setCourseStats({
      total,
      passed,
      failed,
      inProgress,
      averageGrade,
      totalnominalDurations,
      gpa,
      bySemester,
      byDepartment,
    });
  };

  // ===== CALCULATE ATTENDANCE STATISTICS =====
  const calculateAttendanceStats = (attendanceData) => {
    const present = attendanceData.filter(a => a.status === "present").length;
    const absent = attendanceData.filter(a => a.status === "absent").length;
    const excused = attendanceData.filter(a => a.status === "excused").length;
    const total = attendanceData.length;
    const rate = total > 0 ? (present / total) * 100 : 0;

    setAttendanceStats({ present, absent, excused, total, rate });
  };

  // ===== HELPER FUNCTIONS =====
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

const getStatusBadge = (status) => {
  switch (status) {
    case "Enrolled":
      return {
        icon: CheckCircle,
        class: "status-passed",
        label: "Enrolled",
      };

    case "Deferred":
      return {
        icon: Clock,
        class: "status-warning",
        label: "Deferred",
      };

    case "Suspended":
      return {
        icon: AlertTriangle,
        class: "status-warning",
        label: "Suspended",
      };

    case "Withdrawn":
      return {
        icon: XCircle,
        class: "status-failed",
        label: "Withdrawn",
      };

    case "Graduated":
      return {
        icon: Award,
        class: "status-passed",
        label: "Graduated",
      };

    default:
      return {
        icon: AlertCircle,
        class: "status-pending",
        label: status || "Unknown",
      };
  }
};

  const getGradeColor = (grade) => {
    const gradeMap = {
      'A': '#22c55e',
      'A-': '#4ade80',
      'B+': '#60a5fa',
      'B': '#3b82f6',
      'B-': '#818cf8',
      'C+': '#f59e0b',
      'C': '#f97316',
      'C-': '#ef4444',
      'D': '#dc2626',
      'F': '#991b1b',
      'W': '#94a3b8',
      'I': '#f59e0b',
    };
    return gradeMap[grade] || '#64748b';
  };

  const getGradePoint = (grade) => {
    const pointMap = {
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D': 1.0,
      'F': 0.0,
      'W': 0.0,
      'I': 0.0,
    };
    return pointMap[grade] || 0.0;
  };

  const getCourseStatus = (course) => {
    const grade = course.grade;
    const status = course.status || course.gradeStatus;
    
    if (status === "in-progress" || status === "ongoing") {
      return { label: "In Progress", class: "in-progress", icon: Clock };
    }
    if (grade === 'W') {
      return { label: "Withdrawn", class: "withdrawn", icon: XCircle };
    }
    if (grade === 'I') {
      return { label: "Incomplete", class: "incomplete", icon: AlertTriangle };
    }
    if (grade && grade !== 'F' && grade !== 'D') {
      return { label: "Passed", class: "passed", icon: CheckCircle };
    }
    if (grade === 'F' || grade === 'D') {
      return { label: "Failed", class: "failed", icon: XCircle };
    }
    return { label: "Not Graded", class: "pending", icon: Clock };
  };

  const getSemesterName = (semester) => {
    const semMap = {
      '1': 'Fall',
      '2': 'Spring',
      '3': 'Summer',
      'fall': 'Fall',
      'spring': 'Spring',
      'summer': 'Summer',
    };
    return semMap[semester] || semester || "N/A";
  };

  // ===== FILTER COURSES =====
  const getFilteredCourses = () => {
    let filtered = [...courses];

    // Filter by status
    if (courseFilter === "passed") {
      filtered = filtered.filter(c => {
        const status = getCourseStatus(c);
        return status.class === "passed";
      });
    } else if (courseFilter === "failed") {
      filtered = filtered.filter(c => {
        const status = getCourseStatus(c);
        return status.class === "failed";
      });
    } else if (courseFilter === "in-progress") {
      filtered = filtered.filter(c => {
        const status = getCourseStatus(c);
        return status.class === "in-progress";
      });
    }

    // Search by course name or code
    if (courseSearch) {
      const searchLower = courseSearch.toLowerCase();
      filtered = filtered.filter(c =>
  c.courseName?.toLowerCase().includes(searchLower) ||
  c.courseCode?.toLowerCase().includes(searchLower)
);
    }

    return filtered;
  };

  const filteredCourses = getFilteredCourses();



  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="view-student-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Please Wait...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error || !student) {
    return (
      <div className="view-student-page">
        <div className="error-container">
          <div className="error-icon">
            <XCircle size={48} />
          </div>
          <h2>Unable to Load Student</h2>
          <p>{error || "Student not found"}</p>
          <button className="btn-back" onClick={() => navigate("/registrar/grade-report")}>
            <ArrowLeft size={18} />
            Back to Grade Report
          </button>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  const statusBadge = getStatusBadge(student.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className="view-student-page">
      {/* ===== HEADER ===== */}
      <header className="view-student-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/registrar/grade-report")}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="header-divider"></div>
          <div className="header-title">
            <div>
              <h1>Student Profile</h1>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-edit" onClick={() => navigate(`/registrar/enrollment/${student._id}`)}>
            <Edit size={18} />
            Edit
          </button>
          <button
            
          
  className="btn-export"
  onClick={() =>
  downloadPDF(
    profileRef,
    `${student.studentId}-Student-Profile.pdf`
  )
}
>
  <Download size={18} />
  Profile
</button>
<button
    className="btn-export"
    onClick={() =>
  downloadPDF(
    slipRef,
    `${student.studentId}-Registration-Slip.pdf`
  )
}onClick={() =>
  downloadPDF(
    slipRef,
    `${student.studentId}-Registration-Slip.pdf`
  )
}
>
    <Download size={18} />
    Slip
</button>

<button
  className="btn-export"
  onClick={() =>
  downloadPDF(
    transcriptRef,
    `${student.studentId}-Transcript.pdf`
  )
}>
  <Download size={18} />
  Transcript
</button>
<button
  className="btn-export"
  onClick={() =>
  downloadPDF(
    trainerSheetRef,
    `${student.studentId}-TVET-Trainer-Data-Sheet.pdf`
  )
}
>
  <Download size={18} />
  ETA 
</button>
        </div>
      </header>

      {/* ===== STUDENT OVERVIEW ===== */}
      <section className="student-overview">
        <div className="overview-card">
            <div className="overview-avatar">
  {student.photo ? (
    <img
      src={`http://localhost:5000${student.photo}`}
      alt={student.firstName}
      className="student-photo"
    />
  ) : (
    <User size={48} />
  )}
</div>
          <div className="overview-info">
            <h2>{student.firstName} {student.fatherName}</h2>
            <div className="overview-meta">
              <span className="meta-item">
                <Hash size={16} />
                {student.studentId}
              </span>
              <span className="meta-item">
                <Building size={16} />
                {student.department?.name || "N/A"}
              </span>
              <span className="meta-item">
                <Award size={16} />
                Level {student.level || "N/A"}
              </span>
              <span className={`meta-status ${statusBadge.class}`}>
                <StatusIcon size={14} />
                {statusBadge.label}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-mini-grid">
          <div className="stat-mini">
            <span className="stat-mini-label">GPA</span>
            <span className="stat-mini-value">{courseStats.gpa.toFixed(2)}</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-label">nominalDurations</span>
            <span className="stat-mini-value">{courseStats.totalnominalDurations}</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-label">Attendance</span>
            <span className="stat-mini-value">{attendanceStats.rate.toFixed(1)}%</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-label">Courses</span>
            <span className="stat-mini-value">{courseStats.total}</span>
          </div>
        </div>
      </section>

      {/* ===== TAB NAVIGATION ===== */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`tab-btn ${activeTab === "courses" ? "active" : ""}`}
          onClick={() => setActiveTab("courses")}
        >
          <BookOpen size={18} />
          Courses & Reports
        </button>
        <button
          className={`tab-btn ${activeTab === "attendance" ? "active" : ""}`}
          onClick={() => setActiveTab("attendance")}
        >
          <Clock size={18} />
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === "statistics" ? "active" : ""}`}
          onClick={() => setActiveTab("statistics")}
        >
          <BarChart3 size={18} />
          Statistics
        </button>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="tab-content">
        {/* ===== PROFILE TAB ===== */}
        {activeTab === "profile" && (
          <div className="profile-tab">
            <div className="profile-grid">
              {/* Personal Information */}
              <div className="info-card">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Full Name</span>
                    <span className="info-value">{student.firstName} {student.fatherName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Student ID</span>
                    <span className="info-value">{student.studentId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">
                      <Mail size={14} />
                      {student.email || "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">
                      <Phone size={14} />
                      {student.phone || "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Address</span>
                    <span className="info-value">
                      <MapPin size={14} />
                      {student.address || "N/A"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Date of Birth</span>
                    <span className="info-value">
                      <Calendar size={14} />
                      {formatDate(student.dob)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-card">
  <h3>Contact Information</h3>

  <div className="info-grid">

    <div className="info-item">
      <span className="info-label">Phone</span>
      <span className="info-value">
        {student.phone || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Email</span>
      <span className="info-value">
        {student.email || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Region</span>
      <span className="info-value">
        {student.region || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">City</span>
      <span className="info-value">
        {student.city || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <div className="info-item">
  <span className="info-label">Zone</span>
  <span className="info-value">
    {student.zone || "N/A"}
  </span>
</div>
      <span className="info-label">Woreda</span>
      <span className="info-value">
        {student.Woreda || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Specific Place</span>
      <span className="info-value">
        {student.SpecificPlace || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Address</span>
      <span className="info-value">
        {student.address || "N/A"}
      </span>
    </div>

  </div>
</div>

              <div className="info-card">
  <h3>Education Details</h3>

  <div className="info-grid">

    <div className="info-item">
      <span className="info-label">Institution</span>
      <span className="info-value">
        {student.institutionName || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Education Type</span>
      <span className="info-value">
        {student.educationType || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Highest Qualification</span>
      <span className="info-value">
        {student.highestQualification || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Previous Institution</span>
      <span className="info-value">
        {student.previousInstitution || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Previous Education</span>
      <span className="info-value">
        {student.previousEducation || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Department</span>
      <span className="info-value">
        {student.department?.name || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Program</span>
      <span className="info-value">
        {student.program || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">COC</span>
      <span className="info-value">
        {student.COC || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Level</span>
      <span className="info-value">
        {student.level || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Semester</span>
      <span className="info-value">
        {student.semester || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Batch</span>
      <span className="info-value">
        {student.batch || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Academic Year</span>
      <span className="info-value">
        {student.academicYear || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Study Mode</span>
      <span className="info-value">
        {student.studyMode || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Enrollment Status</span>
      <span className="info-value">
        {student.enrollmentStatus || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Sponsor</span>
      <span className="info-value">
        {student.educationSponsor || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Language</span>
      <span className="info-value">
        {student.educationLanguage || "N/A"}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Registration Date</span>
      <span className="info-value">
        {formatDate(student.registrationDate)}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Education Start</span>
      <span className="info-value">
        {formatDate(student.educationStartDate)}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Education End</span>
      <span className="info-value">
        {formatDate(student.educationEndDate)}
      </span>
    </div>

    <div className="info-item">
      <span className="info-label">Duration</span>
      <span className="info-value">
        {student.durationMonths
          ? `${student.durationMonths} Months`
          : "N/A"}
      </span>
    </div>

  </div>
</div>
{/* Inmate Information */}
{student.isInmate && (
  <div className="info-card">
    <h3>Inmate Information</h3>

    <div className="info-grid">
      <div className="info-item">
        <span className="info-label">Prison ID</span>
        <span className="info-value">
          {student.prisonId || "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Crime Type</span>
        <span className="info-value">
          {student.crimeType || "N/A"}
        </span>
      </div>
      <div className="info-item">
        <span className="info-label">Crime Type</span>
        <span className="info-value">
          {student.crimeType || "N/A"}
        </span>
      </div>


      <div className="info-item">
        <span className="info-label">Sentence Duration</span>
        <span className="info-value">
          {student.sentenceDuration
            ? `${student.sentenceDuration} Years`
            : "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Security Level</span>
        <span className="info-value">
          {student.securityLevel || "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Prison Facility</span>
        <span className="info-value">
          {student.prisonFacility || "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Cell Number</span>
        <span className="info-value">
          {student.cellNumber || "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Imprisonment Start Date</span>
        <span className="info-value">
          {formatDate(student.imprisonmentStartDate)}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Expected Release Date</span>
        <span className="info-value">
          {formatDate(student.expectedReleaseDate)}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Parole Date</span>
        <span className="info-value">
          {formatDate(student.paroleDate)}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Current Status</span>
        <span className="info-value">
          {student.currentStatus || "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Assigned Officer</span>
        <span className="info-value">
          {student.assignedOfficer || "N/A"}
        </span>
      </div>

      <div className="info-item">
        <span className="info-label">Officer Phone</span>
        <span className="info-value">
          {student.officerPhone || "N/A"}
        </span>
      </div>
    </div>
  </div>
)}
{/* ================= GUARDIAN INFORMATION ================= */}

<div className="pdf-section">

  <div className="section-title">
    GUARDIAN INFORMATION
  </div>

  <div className="section-grid">

    <div className="section-itemm">
      <strong>Guardian Name</strong>
      <span
      className="info-value">
        {student.guardianName || "N/A"}
      </span>
    </div>

    <div className="section-itemm">
      <strong>Guardian Phone</strong>
      <span
      className="info-value">
        {student.guardianPhone || "N/A"}
      </span>
    </div>

    <div className="section-itemm">
      <strong>Relationship</strong>
      <span
      className="info-value">
        {student.relationship || "N/A"}
      </span>
    </div>

  </div>

</div>

              {/* Academic Summary */}
              <div className="info-card summary-card">
                <h3>Academic Summary</h3>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">CGPA</span>
                    <span className="summary-value cgpa">{courseStats.gpa.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total nominalDurations</span>
                    <span className="summary-value">{courseStats.totalnominalDurations}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Passed</span>
                    <span className="summary-value passed">{courseStats.passed}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Failed</span>
                    <span className="summary-value failed">{courseStats.failed}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">In Progress</span>
                    <span className="summary-value in-progress">{courseStats.inProgress}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Attendance</span>
                    <span className="summary-value">{attendanceStats.rate.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== COURSES TAB ===== */}
        {activeTab === "courses" && (
          <div className="courses-tab">
            <div className="courses-header">
              <div className="courses-title">
                <h3>Course Details & Reports</h3>
                <span className="course-count">{courses.length} courses</span>
              </div>
              <div className="courses-stats">
                <span className="course-stat passed">
                  <TrendingUp size={16} />
                  Passed: {courseStats.passed}
                </span>
                <span className="course-stat failed">
                  <TrendingDown size={16} />
                  Failed: {courseStats.failed}
                </span>
                <span className="course-stat in-progress">
                  <Clock size={16} />
                  In Progress: {courseStats.inProgress}
                </span>
              </div>
            </div>

            {/* Course Filters */}
            <div className="course-filters">
              <div className="filter-group">
                <label>Filter by Status</label>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                  <option value="in-progress">In Progress</option>
                </select>
              </div>
              <div className="filter-group search-group">
                <label>Search Course</label>
                <div className="search-input-wrapper">
                  <Search size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or code..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="course-table-wrapper">
              {filteredCourses.length > 0 ? (
                <table className="course-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>nominalDurations</th>
                      <th>Semester</th>
                      <th>Grade</th>
                      <th>Grade Point</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course, index) => {
                      const status = getCourseStatus(course);
                      const StatusIcon = status.icon;
                      const grade = course.grade || "N/A";
                      const gradePoint = getGradePoint(grade);
                      const isExpanded = expandedCourse === course._id;

                      return (
                        <>
                          <tr key={course._id} className={`course-row ${status.class}`}>
                            <td>{index + 1}</td>
                            <td>
                              <span className="course-code">{course.courseCode || "N/A"}</span>
                            </td>
                            <td>{course.courseName || "N/A"}</td>
                            <td>{course.nominalDuration || 30}</td>
                            <td>
                              <span className="semester-badge">
                                {getSemesterName(course.semester)} {course.year || ""}
                              </span>
                            </td>
                            <td>
                              {grade !== "N/A" ? (
                                <span 
                                  className="grade-badge"
                                  style={{ 
                                    backgroundColor: getGradeColor(grade),
                                    color: '#fff'
                                  }}
                                >
                                  {grade}
                                </span>
                              ) : (
                                <span className="grade-na">N/A</span>
                              )}
                            </td>
                            <td>
                              {grade !== "N/A" && grade !== 'W' && grade !== 'I' 
                                ? gradePoint.toFixed(1) 
                                : '-'}
                            </td>
                            <td>
                              <span className={`course-status ${status.class}`}>
                                <StatusIcon size={14} />
                                {status.label}
                              </span>
                            </td>
                            <td>
                              <button
                                className="expand-btn"
                                onClick={() => setExpandedCourse(
                                  isExpanded ? null : course._id
                                )}
                              >
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                {isExpanded ? "Hide" : "View"}
                              </button>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className="course-detail-row">
                              <td colSpan="9">
                                <div className="course-detail-panel">
                                  <div className="detail-grid">
                                    <div className="detail-section">
                                      <h4>Course Information</h4>
                                      <div className="detail-item">
                                        <span className="detail-label">Course Code</span>
                                        <span>{course.courseCode || "N/A"}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Course Name</span>
                                        <span>{course.courseName || "N/A"}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">nominalDurations</span>
                                        <span>{course.nominalDuration || 30}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Department</span>
                                        <span>{student.department?.name || "N/A"}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Teacher</span>
                                        <span>{course.teacher || "N/A"}</span>
                                      </div>
                                    </div>

                                    <div className="detail-section">
                                      <h4>Grade Details</h4>
                                      <div className="detail-item">
                                        <span className="detail-label">Grade</span>
                                        <span className="grade-value" style={{ color: getGradeColor(grade) }}>
                                          {grade}
                                        </span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Grade Point</span>
                                        <span>{gradePoint.toFixed(1)}</span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Status</span>
                                        <span className={`course-status ${status.class}`}>
                                          <StatusIcon size={14} />
                                          {status.label}
                                        </span>
                                      </div>
                                      <div className="detail-item">
                                        <span className="detail-label">Semester</span>
                                        <span>{getSemesterName(course.semester)} {course.year || ""}</span>
                                      </div>
                                    </div>

                                    <div className="detail-section">
                                      <h4>Performance Metrics</h4>
                                      <div className="metric-grid">
                                        <div className="metric-item">
                                          <span className="metric-label">Assignment</span>
                                          <span className="metric-value">{course.assignment}</span>
                                        </div>
                                        <div className="metric-item">
                                          <span className="metric-label">Quiz</span>
                                          <span className="metric-value">{course.quiz}</span>
                                        </div>
                                        <div className="metric-item">
                                          <span className="metric-label">Midterm</span>
                                          <span className="metric-value">{course.midExam}</span>
                                        </div>
                                        <div className="metric-item">
                                          <span className="metric-label">Final</span>
                                          <span className="metric-value">{course.finalExam}</span>
                                        </div>
                                        <div className="metric-item">
                                          <span className="metric-label">Attendance</span>
                                          <span className="metric-value">{course.attendanceRate || "N/A"}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3">
                        <strong>Summary</strong>
                      </td>
                      <td>
                        <strong>{courseStats.totalnominalDurations} nominalDurations</strong>
                      </td>
                      <td colSpan="2">
                        <strong>CGPA: {courseStats.gpa.toFixed(2)}</strong>
                      </td>
                      <td colSpan="3">
                        <strong>
                          <span className="text-passed">{courseStats.passed} Passed</span> | 
                          <span className="text-failed"> {courseStats.failed} Failed</span> | 
                          <span className="text-in-progress"> {courseStats.inProgress} In Progress</span>
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <p>No courses found</p>
                  <span>Try adjusting your filters or search terms</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ATTENDANCE TAB ===== */}
        {activeTab === "attendance" && (
          <div className="attendance-tab">
            <div className="attendance-header">
              <h3>Attendance Records</h3>
              <div className="attendance-summary">
                <div className="attendance-stat">
                  <span className="stat-label">Overall Rate</span>
                  <span className="stat-value">{attendanceStats.rate.toFixed(1)}%</span>
                </div>
                <div className="attendance-stat">
                  <span className="stat-label">Present</span>
                  <span className="stat-value present">{attendanceStats.present}</span>
                </div>
                <div className="attendance-stat">
                  <span className="stat-label">Absent</span>
                  <span className="stat-value absent">{attendanceStats.absent}</span>
                </div>
                <div className="attendance-stat">
                  <span className="stat-label">Excused</span>
                  <span className="stat-value excused">{attendanceStats.excused}</span>
                </div>
              </div>
            </div>

            {attendance.length > 0 ? (
              <div className="attendance-table-wrapper">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatDate(record.date)}</td>
                        <td>{record.course?.name || "N/A"}</td>
                        <td>
                          <span className={`attendance-status ${record.status}`}>
                            {record.status === "present" ? (
                              <CheckCircle size={14} />
                            ) : record.status === "excused" ? (
                              <Clock size={14} />
                            ) : (
                              <XCircle size={14} />
                            )}
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td>{record.remarks || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <Clock size={48} />
                <p>No attendance records</p>
                <span>Attendance data is not available for this student</span>
              </div>
            )}
          </div>
        )}

        {/* ===== STATISTICS TAB ===== */}
        {activeTab === "statistics" && (
          <div className="statistics-tab">
            <div className="stats-grid-overview">
              {/* Performance Overview */}
              <div className="stat-card-overview">
                <h4>Performance Overview</h4>
                <div className="performance-metrics">
                  <div className="metric">
                    <span className="metric-label">Current GPA</span>
                    <span className="metric-value large">{courseStats.gpa.toFixed(2)}</span>
                    <span className="metric-sub">Out of 4.0</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Completion Rate</span>
                    <span className="metric-value large">
                      {courseStats.total > 0 
                        ? ((courseStats.passed / courseStats.total) * 100).toFixed(1) 
                        : 0}%
                    </span>
                    <span className="metric-sub">{courseStats.passed} of {courseStats.total} courses</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Average Grade</span>
                    <span className="metric-value large">{courseStats.averageGrade.toFixed(1)}</span>
                    <span className="metric-sub">Grade point average</span>
                  </div>
                </div>
              </div>

              {/* Course Distribution */}
              <div className="stat-card-overview">
                <h4>Course Distribution</h4>
                <div className="distribution-grid">
                  <div className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="bar passed" 
                        style={{ width: `${courseStats.total > 0 ? (courseStats.passed / courseStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <span className="dot passed"></span>
                      Passed: {courseStats.passed}
                    </div>
                  </div>
                  <div className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="bar failed" 
                        style={{ width: `${courseStats.total > 0 ? (courseStats.failed / courseStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <span className="dot failed"></span>
                      Failed: {courseStats.failed}
                    </div>
                  </div>
                  <div className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="bar in-progress" 
                        style={{ width: `${courseStats.total > 0 ? (courseStats.inProgress / courseStats.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <span className="dot in-progress"></span>
                      In Progress: {courseStats.inProgress}
                    </div>
                  </div>
                </div>
              </div>

              {/* By Semester */}
              <div className="stat-card-overview">
                <h4>Courses by Semester</h4>
                <div className="semester-distribution">
                  {Object.entries(courseStats.bySemester).map(([semester, count]) => (
                    <div key={semester} className="semester-item">
                      <span className="semester-name">{getSemesterName(semester)}</span>
                      <div className="semester-bar-wrapper">
                        <div 
                          className="semester-bar" 
                          style={{ width: `${(count / courseStats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="semester-count">{count}</span>
                    </div>
                  ))}
                  {Object.keys(courseStats.bySemester).length === 0 && (
                    <div className="empty-state-mini">No semester data available</div>
                  )}
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="stat-card-overview">
                <h4>Grade Distribution</h4>
                <div className="grade-distribution">
                  {['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F', 'W', 'I'].map(grade => {
                    const count = courses.filter(c => c.grade === grade).length;
                    if (count === 0) return null;
                    return (
                      <div key={grade} className="grade-item">
                        <span 
                          className="grade-dot"
                          style={{ backgroundColor: getGradeColor(grade) }}
                        ></span>
                        <span className="grade-letter">{grade}</span>
                        <div className="grade-bar-wrapper">
                          <div 
                            className="grade-bar" 
                            style={{ 
                              width: `${(count / courseStats.total) * 100}%`,
                              backgroundColor: getGradeColor(grade)
                            }}
                          ></div>
                        </div>
                        <span className="grade-count">{count}</span>
                      </div>
                    );
                  })}
                  {courses.filter(c => c.grade).length === 0 && (
                    <div className="empty-state-mini">No grades available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Temporary PDF Preview */}
      <div
  style={{
    marginTop: "40px",
    padding: "20px",
    background: "#f3f4f6",
  }}
>

  <div ref={profileRef}>
    <StudentProfilePDF
      student={student}
      courses={courses}
      attendance={attendance}
    />
  </div>

  <div ref={transcriptRef}>
    <TranscriptPDF
      student={student}
      courses={courses}
      attendance={attendance}
    />
  </div>

  <div ref={slipRef}>
    <RegistrationSlipPDF
        student={student}
        courses={courses}
    />
</div>
<div ref={trainerSheetRef}>
  <TVETTrainerDataSheetPDF
    students={[student]}
    department={student.department?.name}
    college="Tesfa technical and vocational training college"
    programLevel={student.level}
    modality={student.program}
    admissionDate={student.registrationDate}
    graduationDate={student.educationEndDate}
  />
</div>

</div>

    </div>
  );
}