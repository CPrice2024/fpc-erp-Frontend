import "./PDFStyles.css";
import logo from "../../assets/FPClogo.png";
import stamp from "../../assets/stamp_fpc.png";


export default function RegistrationSlipPDF({
  student,
  courses = [],
}) {
  if (!student) return null;

  return (
    <div className="pdf-preview-wrapper">
      <div className="pdf-page registration-slip">

        {/* Watermark */}

        <div className="pdf-watermark">
          Tesfa technical and vocational training college        </div>

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
              Tesfa technical and vocational training college            </h1>

            <h2>
              OFFICE OF THE REGISTRAR
            </h2>

            <h2>
              REGISTRATION SLIP
            </h2>

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
                  <td>ID No</td>
                  <td>
                    {student.studentId}
                  </td>
                </tr>

              </tbody>
            </table>

          </div>

        </div>

        {/* ================= STUDENT DETAILS ================= */}

        <div className="pdf-section">

          <div className="section-title">
            STUDENT INFORMATION
          </div>

          <div className="section-grid">

            <div className="section-item">
              <strong>Name</strong>

              <span>
                {student.firstName}{" "}
                {student.fatherName}{" "}
                {student.grandfatherName}
              </span>
            </div>

            <div className="section-item">
              <strong>Student ID</strong>

              <span>
                {student.studentId}
              </span>
            </div>

            <div className="section-item">
              <strong>Gender</strong>

              <span>
                {student.gender}
              </span>
            </div>

            <div className="section-item">
              <strong>Program</strong>

              <span>
                {student.program || "Regular"}
              </span>
            </div>

            <div className="section-item">
              <strong>Department</strong>

              <span>
                {student.department?.name}
              </span>
            </div>

            <div className="section-item">
              <strong>Academic Year</strong>

              <span>
                {student.academicYear}
              </span>
            </div>

            <div className="section-item">
              <strong>Semester</strong>

              <span>
                {student.semester}
              </span>
            </div>

            <div className="section-item">
              <strong>Batch</strong>

              <span>
                {student.batch}
              </span>
            </div>

          </div>

        </div>

        {/* ================= COURSE TABLE ================= */}

        <div className="pdf-section">

          <div className="section-title">
            COURSES
          </div>

          <table className="course-table">

            <thead>

              <tr>

                <th>No</th>

                <th>Course Code</th>

                <th>Course Title</th>

                <th>nominalDuration</th>

              </tr>

            </thead>

            <tbody>

              {courses.length > 0 ? (

                courses.map((course, index) => (

                  <tr key={course._id || index}>

                    <td>{index + 1}</td>

                    <td>
                      {course.courseCode}
                    </td>

                    <td>
                      {course.courseName}
                    </td>

                    <td>
                      {course.nominalDuration ||
                        course.nominalDurations}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No Registered Courses
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= SIGNATURE ================= */}

        <div className="seal-area">

          <div className="signature-section">

            <div className="signature-card">

              <div className="signature-line"></div>

              <h4>
                Student Signature
              </h4>

              <p>
                Date:
                __________________
              </p>

            </div>

            <div className="signature-card">

              <div className="signature-line"></div>

              <h4>
                Registrar
              </h4>

              <p>
                Date:
                __________________
              </p>

            </div>

          </div>

           <div className="logo-area">
              <img src={stamp} alt="College Stamp" className="college-stamp" />
            </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="pdf-footer">

          This registration slip is computer generated.

          <br />

          Tesfa technical and vocational training college • Registrar Office

        </div>
        <h2>------------------------------------------------------------------</h2>
        <div className="pdf-watermark">
          Tesfa technical and vocational training college        </div>

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
              Tesfa technical and vocational training college            </h1>

            <h2>
              OFFICE OF THE REGISTRAR
            </h2>

            <h2>
              REGISTRATION SLIP
            </h2>

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
                  <td>ID No</td>
                  <td>
                    {student.studentId}
                  </td>
                </tr>

              </tbody>
            </table>

          </div>

        </div>

        {/* ================= STUDENT DETAILS ================= */}

        <div className="pdf-section">

          <div className="section-title">
            STUDENT INFORMATION
          </div>

          <div className="section-grid">

            <div className="section-item">
              <strong>Name</strong>

              <span>
                {student.firstName}{" "}
                {student.fatherName}{" "}
                {student.grandfatherName}
              </span>
            </div>

            <div className="section-item">
              <strong>Student ID</strong>

              <span>
                {student.studentId}
              </span>
            </div>

            <div className="section-item">
              <strong>Gender</strong>

              <span>
                {student.gender}
              </span>
            </div>

            <div className="section-item">
              <strong>Program</strong>

              <span>
                {student.program || "Regular"}
              </span>
            </div>

            <div className="section-item">
              <strong>Department</strong>

              <span>
                {student.department?.name}
              </span>
            </div>

            <div className="section-item">
              <strong>Academic Year</strong>

              <span>
                {student.academicYear}
              </span>
            </div>

            <div className="section-item">
              <strong>Semester</strong>

              <span>
                {student.semester}
              </span>
            </div>

            <div className="section-item">
              <strong>Batch</strong>

              <span>
                {student.batch}
              </span>
            </div>

          </div>

        </div>

        {/* ================= COURSE TABLE ================= */}

        <div className="pdf-section">

          <div className="section-title">
            COURSES
          </div>

          <table className="course-table">

            <thead>

              <tr>

                <th>No</th>

                <th>Course Code</th>

                <th>Course Title</th>

                <th>nominalDuration</th>

              </tr>

            </thead>

            <tbody>

              {courses.length > 0 ? (

                courses.map((course, index) => (

                  <tr key={course._id || index}>

                    <td>{index + 1}</td>

                    <td>
                      {course.courseCode}
                    </td>

                    <td>
                      {course.courseName}
                    </td>

                    <td>
                      {course.nominalDuration ||
                        course.nominalDuration}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No Registered Courses
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= SIGNATURE ================= */}

        <div className="seal-area">

          <div className="signature-section">

            <div className="signature-card">

              <div className="signature-line"></div>

              <h4>
                Student Signature
              </h4>

              <p>
                Date:
                __________________
              </p>

            </div>

            <div className="signature-card">

              <div className="signature-line"></div>

              <h4>
                Registrar
              </h4>

              <p>
                Date:
                __________________
              </p>

            </div>

          </div>

           <div className="logo-area">
              <img src={stamp} alt="College Stamp" className="college-stamp" />
            </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="pdf-footer">

          This registration slip is computer generated and
          does not require a physical stamp.

          <br />

          Tesfa technical and vocational training college • Registrar Office

        </div>

      </div>
      
      
    </div>

    
  );
}