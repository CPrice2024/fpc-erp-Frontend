import "./PDFStyles.css";
import logo from "../../assets/FPClogo.png";

export default function StudentProfilePDF({
  student,
}) {

  if (!student) return null;

  return (
    <div className="pdf-preview-wrapper">
      <div className="pdf-page">
        <div className="pdf-watermark">
  Federal Prison College
</div>

      {/* Header */}

      {/* ================= HEADER ================= */}

<div className="pdf-header">

  <div className="logo-area">
    <img src={logo} alt="College Logo" className="college-logo" />
  </div>

  <div className="header">

    <h1>
      FEDERAL PRISON COLLEGE
    </h1>

    <h2>
      STUDENT profile
    </h2>

    <p>
      Registrar Office
    </p>

  </div>

  <div className="header-right">

    <p>
      Date:
      {new Date().toLocaleDateString()}
    </p>

    <p>
      ID:
      {student.studentId}
    </p>

  </div>

</div>

      {/* Student Header */}

      <div className="student-banner">

  <div>

    <img
      src={
        student.photo
          ? `${import.meta.env.VITE_API_URL.replace(
              "/api",
              ""
            )}${student.photo}`
          : "/default-avatar.png"
      }
      alt=""
      className="student-photo"
    />

  </div>

  <div className="student-basic">

    <h2>

      {student.firstName}{" "}
      {student.fatherName}{" "}
      {student.grandfatherName}

    </h2>

    <table>

      <tbody>

        <tr>
          <td>Student ID</td>
          <td>{student.studentId}</td>
        </tr>

        <tr>
          <td>Status</td>
          <td>{student.status}</td>
        </tr>

        <tr>
          <td>Department</td>
          <td>
            {student.department?.name}
          </td>
        </tr>

        <tr>
          <td>Program</td>
          <td>{student.program}</td>
        </tr>

        <tr>
          <td>Level</td>
          <td>{student.level}</td>
        </tr>

      </tbody>

    </table>

  </div>

</div>
{/* ================= PERSONAL INFORMATION ================= */}

<div className="pdf-section">

  <div className="section-title">
    PERSONAL INFORMATION
  </div>

  <div className="section-grid">

    <div className="section-item">
      <strong>Full Name</strong>
      <span>
        {student.firstName}{" "}
        {student.fatherName}{" "}
        {student.grandfatherName}
      </span>
    </div>

    <div className="section-item">
      <strong>Gender</strong>
      <span>{student.gender || "N/A"}</span>
    </div>

    <div className="section-item">
      <strong>Date of Birth</strong>
      <span>
        {student.dob
          ? new Date(student.dob).toLocaleDateString()
          : "N/A"}
      </span>
    </div>

    <div className="section-item">
      <strong>Nationality</strong>
      <span>
        {student.nationality || "N/A"}
      </span>
    </div>

  </div>

</div>
{/* ================= CONTACT INFORMATION ================= */}

<div className="pdf-section">

  <div className="section-title">
    CONTACT INFORMATION
  </div>

  <div className="section-grid">

    <div className="section-item">
      <strong>Phone</strong>
      <span>{student.phone || "N/A"}</span>
    </div>

    <div className="section-item">
      <strong>Email</strong>
      <span>{student.email || "N/A"}</span>
    </div>

    <div className="section-item">
      <strong>Region</strong>
      <span>{student.region || "N/A"}</span>
    </div>

    <div className="section-item">
      <strong>City</strong>
      <span>{student.city || "N/A"}</span>
    </div>

    <div className="section-item">
      <strong>Woreda</strong>
      <span>{student.Woreda || "N/A"}</span>
    </div>

    <div className="section-item">
      <strong>Specific Place</strong>
      <span>
        {student.SpecificPlace || "N/A"}
      </span>
    </div>

    <div className="section-item full-width">
      <strong>Address</strong>
      <span>{student.address || "N/A"}</span>
    </div>

  </div>
  <div className="seal-area">
    <div className="signature-section">

    <div className="signature-card">

        <div className="signature-line"></div>

        <h4>Registrar</h4>

        <p>Federal Prison College</p>

    </div>

    <div className="signature-card">

        <div className="signature-line"></div>

        <h4>College Head</h4>

        <p>Federal Prison College</p>

    </div>

</div>

    <div className="seal-circle">

        <div className="seal-inner">
            VIRTUAL
            <br />
            COLLEGE
            <br />
            SEAL
        </div>

    </div>

</div>

<div className="pdf-footer">

    This document is computer generated and does not require a physical stamp.

    <br />

    Federal Prison College • Registrar Office

</div>

</div>

    </div>
    </div>
  );
}