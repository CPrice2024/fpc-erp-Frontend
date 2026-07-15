import "./TVETTrainerDataSheet.css";
import logo from "../../assets/FPClogo.png";

export default function TVETTrainerDataSheetPDF({
    students = [],
    department,
    college,
    programLevel,
    modality,
    admissionDate,
    graduationDate
}) {

    return (
  <div className="pdf-preview-wrapper">

    <div className="pdf-page tvet-sheet">

      {/* Watermark */}

      <div className="pdf-watermark">
        FEDERAL PRISON COLLEGE
      </div>

      {/* ================= HEADER ================= */}

      <div className="pdf-header">

        <div className="logo-area">

          <img
            src={logo}
            alt="College Logo"
            className="college-logo"
          />

        </div>

        <div className="header">

          <h1>
            FEDERAL PRISON COLLEGE
          </h1>

          <h2>
            OFFICE OF THE REGISTRAR
          </h2>

          <h3>
            TVET TRAINERS DATA SHEET
          </h3>

        </div>

        <div className="header-right">

          <table>

            <tbody>

              <tr>

                <td>Date</td>

                <td>
                  {new Date().toLocaleDateString()}
                </td>

              </tr>

              <tr>

                <td>Total Students</td>

                <td>{students.length}</td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= COLLEGE INFORMATION ================= */}

      <div className="pdf-section">

        <div className="section-title">

          COLLEGE INFORMATION

        </div>

        <div className="section-grid">

          <div className="section-item">

            <strong>Institution</strong>

            <span>
              {college}
            </span>

          </div>

          <div className="section-item">

            <strong>Department</strong>

            <span>
              {department}
            </span>

          </div>

          <div className="section-item">

            <strong>Program Level</strong>

            <span>
              {programLevel}
            </span>

          </div>

          <div className="section-item">

            <strong>Modality</strong>

            <span>
              {modality}
            </span>

          </div>

          <div className="section-item">

            <strong>Admission Date</strong>

            <span>
              {admissionDate}
            </span>

          </div>

          <div className="section-item">

            <strong>Graduation Date</strong>

            <span>
              {graduationDate}
            </span>

          </div>

        </div>

      </div>

      {/* ================= PROGRAM LEVEL ================= */}

      <div className="checkbox-section">

        <strong>Program Level :</strong>

        <span>
          {programLevel === "Level I" ? "☑" : "☐"} Level I
        </span>

        <span>
          {programLevel === "Level II" ? "☑" : "☐"} Level II
        </span>

        <span>
          {programLevel === "Level III" ? "☑" : "☐"} Level III
        </span>

        <span>
          {programLevel === "Level IV" ? "☑" : "☐"} Level IV
        </span>

        <span>
          {programLevel === "Level V" ? "☑" : "☐"} Level V
        </span>

      </div>

      {/* ================= MODALITY ================= */}

      <div className="checkbox-section">

        <strong>Modality :</strong>

        <span>

          {modality === "Regular" ? "☑" : "☐"}

          Regular

        </span>

        <span>

          {modality === "Extension" ? "☑" : "☐"}

          Extension

        </span>

      </div>

      {/* ================= STUDENT TABLE ================= */}

      <div className="pdf-section">

        <div className="section-title">

          TRAINEE LIST

        </div>

        <table className="student-table">

          <thead>

            <tr>

              <th>No</th>

              <th>ID</th>

              <th>First Name</th>

              <th>Father</th>

              <th>Grandfather</th>

              <th>Sex</th>

              <th>Citizen</th>

              <th>Birth</th>

              <th>Grade10</th>

              <th>Year</th>

              <th>Grade12</th>

              <th>Year</th>

              <th>Equiv.</th>

              <th>Admission</th>

              <th>COC ID</th>

              <th>Issued</th>

              <th>Graduate COC</th>

              <th>Issue Date</th>

            </tr>

          </thead>

          <tbody>

            {students.length > 0 ? (

              students.map((student, index) => (

                <tr key={student._id || index}>

                  <td>{index + 1}</td>

                  <td>{student.studentId}</td>

                  <td>{student.firstName}</td>

                  <td>{student.fatherName}</td>

                  <td>{student.grandfatherName}</td>

                  <td>{student.gender}</td>

                  <td>{student.citizenship}</td>

                  <td>

                    {student.birthDate
                      ? new Date(student.birthDate).toLocaleDateString()
                      : ""}

                  </td>

                  <td>{student.grade10Result}</td>

                  <td>{student.grade10Year}</td>

                  <td>{student.grade12Result}</td>

                  <td>{student.grade12Year}</td>

                  <td>{student.equivalence}</td>

                  <td>{student.admissionDate}</td>

                  <td>{student.cocId}</td>

                  <td>{student.cocIssuedDate}</td>

                  <td>{student.graduatedCocId}</td>

                  <td>{student.graduatedCocIssuedDate}</td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="18"
                  style={{
                    textAlign: "center",
                  }}
                >

                  No Student Data Available

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ================= SIGNATURE ================= */}

      <div className="signature-section">

        <div className="signature-card">

          <div className="signature-line"></div>

          <h4>

            Registrar

          </h4>

        </div>

        <div className="signature-card">

          <div className="signature-line"></div>

          <h4>

            Department Head

          </h4>

        </div>

        <div className="signature-card">

          <div className="signature-line"></div>

          <h4>

            College Head

          </h4>

        </div>

      </div>

      {/* ================= FOOTER ================= */}

      <div className="pdf-footer">

        Federal Prison College • Registrar Office

        <br />

        This document is generated electronically by the College ERP System.

      </div>

    </div>

  </div>
);

}

 