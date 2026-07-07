import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getStudents,
  getStudentStats,
} from "../../api/departmentAPI";

import {
  Search,
  Eye,
  Users,
  UserCheck,
  User,
} from "lucide-react";

import "./Students.css";

export default function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  const [stats, setStats] = useState({
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    activeStudents: 0,
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const [studentsRes, statsRes] =
        await Promise.all([
          getStudents(),
          getStudentStats(),
        ]);

      setStudents(studentsRes.data);
      setStats(statsRes.data);

    } catch (error) {
      console.error(error);
      alert("Failed to load students");
    }
  };

  const filteredStudents = students.filter((student) => {

    const keyword = search.toLowerCase();

    return (

      student.studentId
        ?.toLowerCase()
        .includes(keyword)

      ||

      `${student.firstName} ${student.fatherName} ${student.grandfatherName}`
        .toLowerCase()
        .includes(keyword)

      ||

      student.phone
        ?.toLowerCase()
        .includes(keyword)

      ||

      student.email
        ?.toLowerCase()
        .includes(keyword)

    );

  });

  return (
    <div className="students-page">

      {/* Header */}

      <div className="students-top">

        <div>

          <h1>Department Students</h1>

          <p>
            View students registered in your department
          </p>

        </div>

      </div>

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">

          <Users size={28} />

          <h2>{stats.totalStudents}</h2>

          <p>Total Students</p>

        </div>

        <div className="stat-card">

          <User size={28} />

          <h2>{stats.maleStudents}</h2>

          <p>Male Students</p>

        </div>

        <div className="stat-card">

          <User size={28} />

          <h2>{stats.femaleStudents}</h2>

          <p>Female Students</p>

        </div>

        <div className="stat-card">

          <UserCheck size={28} />

          <h2>{stats.activeStudents}</h2>

          <p>Active Students</p>

        </div>

      </div>

      {/* Search */}

      <div className="table-card">

        <div className="table-header">

          <div className="search-box">

            <Search size={18} />

            <input
              type="text"
              placeholder="Search by ID, name, phone or email..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>

        {/* Table */}

        <table>

          <thead>

            <tr>

              <th>Student ID</th>

              <th>Full Name</th>

              <th>Gender</th>

              <th>Level</th>

              <th>Semester</th>

              <th>Section</th>

              <th>Phone</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredStudents.length > 0 ? (

              filteredStudents.map((student) => (

                <tr key={student._id}>

                  <td>

                    {student.studentId}

                  </td>

                  <td>

                    {student.firstName}{" "}
                    {student.fatherName}

                  </td>

                  <td>

                    <span className="gender-badge">

                      {student.gender}

                    </span>

                  </td>

                  <td>

                    {student.level}

                  </td>

                  <td>

                    {student.semester}

                  </td>

                  <td>

                    {student.section}

                  </td>

                  <td>

                    {student.phone}

                  </td>

                  <td>

                    <span
                      className={`status-badge ${
                        student.status || "active"
                      }`}
                    >
                      {student.status || "active"}
                    </span>

                  </td>

                  <td className="action-buttons">

                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/department-head/students/view/${student._id}`
                        )
                      }
                    >
                      <Eye size={17} />
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="9"
                  className="empty-row"
                >

                  No students found

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}