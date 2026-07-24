import { useEffect, useState } from "react";
import { Search, Eye, Users, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyStudents } from "../../api/teacherApi";

import "./MyStudents.css";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") ||
  "http://localhost:5000";

export default function MyStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    setFilteredStudents(
      students.filter((student) =>
        student.studentId?.toLowerCase().includes(keyword) ||
        student.firstName?.toLowerCase().includes(keyword) ||
        student.fatherName?.toLowerCase().includes(keyword)
      )
    );
  }, [search, students]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getMyStudents();
      setStudents(data || []);
      setFilteredStudents(data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
   const statusMap = {
  enrolled: "active",
  suspended: "suspended",
  graduated: "graduated",
  transfer: "transfer",
  withdrawn: "inactive",
  deferred: "inactive",
};
    return statusMap[status?.toLowerCase()] || "active";
  };

  if (loading) {
    return (
      <div className="students-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="students-container">
        <div className="empty-state">
          <AlertCircle size={48} />
          <h3>Unable to Load Students</h3>
          <p>{error}</p>
          <button
            onClick={fetchStudents}
            style={{
              marginTop: "12px",
              padding: "10px 24px",
              background: "#1a1f2e",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="students-container">
      <div className="students-header">
        <h1>
          <Users size={18} />
          My Students
        </h1>
        <p>Students assigned to your course</p>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <h3>No Students Found</h3>
          <p>
            {search
              ? "No students match your search criteria."
              : "You don't have any students assigned yet."}
          </p>
        </div>
      ) : (
        <table className="student-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Name</th>
              <th>Level</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td data-label="Photo">
                  <img
                    src={
                      student.photo
                        ? `${API_URL}${student.photo}`
                        : "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(student.firstName || "S") +
                          "&size=40&background=1a1f2e&color=fff"
                    }
                    alt={student.firstName}
                    className="student-avatar"
                  />
                </td>
                <td data-label="ID">{student.studentId}</td>
                <td data-label="Name">
                  {student.firstName} {student.fatherName}
                </td>
                <td data-label="Level">{student.level || "N/A"}</td>
                <td data-label="Status">
                  <span
  className={`active-status ${getStatusClass(
    student.enrollmentStatus
  )}`}
>
  {student.enrollmentStatus || "Enrolled"}
</span>
                </td>
                <td data-label="Action">
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/teacher/student/${student._id}`)
                    }
                    title="View Student"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}