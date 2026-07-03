import "./PDFStyles.css";
import logo from "../../assets/FPClogo.png";



export default function TranscriptPDF({
  student,
  courses = [],
}) {

  if (!student) return null;

  const totalCredits = courses.reduce(
    (sum, c) => sum + (c.creditHour || c.credits || 0),
    0
  );

  const groupedCourses = courses.reduce((groups, course) => {
  const level = course.level || student.level || "Level I";

  if (!groups[level]) {
    groups[level] = [];
  }

  groups[level].push(course);

  return groups;
}, {});


  return (
    <div className="pdf-preview-wrapper">

      <div className="pdf-page transcript-page">

        <div className="pdf-watermark">
          Federal Prison College
        </div>

        {/* Header */}

        <div className="pdf-header">

          <div className="logo-area">
            <img
              src={logo}
              alt=""
              className="college-logo"
            />
          </div>

          <div className="header">

            <h1>FEDERAL PRISON COLLEGE</h1>

            <h2>
              OFFICE OF THE REGISTRAR
            </h2>

            <h3>
              OFFICIAL ACADEMIC TRANSCRIPT
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
                  <td>ID No</td>
                  <td>
                    {student.studentId}
                  </td>
                </tr>

              </tbody>
            </table>

          </div>

        </div>

        {/* Student */}

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
              <strong>Department</strong>

              <span>
                {student.department?.name}
              </span>

            </div>

            <div className="section-item">
              <strong>Program</strong>

              <span>
                {student.program}
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

          </div>

        </div>

        {/* Results */}
        <div className="pdf-section">

  <div className="section-title">
    ACADEMIC RESULTS
  </div>

  {Object.entries(groupedCourses).map(
    ([level, levelCourses]) => {

      const levelCredits = levelCourses.reduce(
        (sum, c) =>
          sum + (c.creditHour || c.credits || 0),
        0
      );

      const levelResult =
        levelCourses.some(
          (c) => c.grade === "F"
        )
          ? "FAILED"
          : "PASSED";

      return (

        <div
          key={level}
          className="level-section"
        >
          <h3 className="level-title">
  Level class {level.replace(/[^0-9]/g, "") || level}
</h3>

          <table className="course-table">

            <thead>

              <tr>

                <th>No</th>

                <th>Course Code</th>

                <th>Course Title</th>

                <th>Credit Hour</th>

                <th>Grade</th>

                <th>Result</th>

              </tr>

            </thead>

            <tbody>

              {levelCourses.map(
                (course, index) => (

                  <tr key={index}>

                    <td>{index + 1}</td>

                    <td>
                      {course.courseCode}
                    </td>

                    <td>
                      {course.courseName}
                    </td>

                    <td>
                      {course.creditHour}
                    </td>

                    <td>
                      {course.grade}
                    </td>

                    <td>

                      {course.grade === "F"
                        ? "FAILED"
                        : "PASSED"}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          <div className="level-summary">

            <strong>

              Total Credit Hours:

            </strong>

            {levelCredits}

            <br />

            <strong>

              Academic Result:

            </strong>

            {levelResult}

          </div>

        </div>

      );

    }
  )}

</div>
        <div className="transcript-summary">

    <div>

        <strong>Total Credit Hours</strong>

        <span>
            {totalCredits}
        </span>

    </div>

    <div>

        <strong>Overall Result</strong>

        <span>

            {
            courses.some(c=>c.grade==="F")
            ? "FAIL"
            : "PASS"
            }

        </span>

    </div>

    <div>

        <strong>Date of Issue</strong>

        <span>

            {new Date().toLocaleDateString()}

        </span>

    </div>

</div>

        {/* Signatures */}

        <div className="seal-area">

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
                College Head
              </h4>

            </div>

          </div>

          <div className="seal-circle">

            <div className="seal-inner">

              VIRTUAL

              <br/>

              COLLEGE

              <br/>

              SEAL

            </div>

          </div>

        </div>

        <div className="pdf-footer">

          This transcript is computer generated and does not require a physical stamp.

          <br/>

          Federal Prison College • Registrar Office

        </div>

      </div>

    </div>
  );
}