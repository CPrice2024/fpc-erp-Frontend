import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  UserCheck,
  Edit3,
} from "lucide-react";
import "./attendance.css";

// Department constant
const DEPARTMENT_ID = "CS_DEPT";

// Initial department data (only CS department members)
const initialTeachers = [
  { id: "T101", name: "Dr. Abebe Kebede", email: "abebe.k@dept.edu", department: "CS_DEPT", status: "present" },
  { id: "T102", name: "Prof. Tigist Haile", email: "tigist.h@dept.edu", department: "CS_DEPT", status: "absent" },
  { id: "T103", name: "Mr. Samuel Girma", email: "samuel.g@dept.edu", department: "CS_DEPT", status: "late" },
  { id: "T104", name: "Dr. Eden Mekonnen", email: "eden.m@dept.edu", department: "CS_DEPT", status: "present" },
];

const initialStudents = [
  { id: "S001", name: "Meron Assefa", year: "Year 2, Sem 1", department: "CS_DEPT", status: "present" },
  { id: "S002", name: "Dawit Tesfaye", year: "Year 1, Sem 2", department: "CS_DEPT", status: "absent" },
  { id: "S003", name: "Hanna Belay", year: "Year 3, Sem 1", department: "CS_DEPT", status: "late" },
  { id: "S004", name: "Nahom Alemu", year: "Year 2, Sem 2", department: "CS_DEPT", status: "present" },
  { id: "S005", name: "Selam Gebre", year: "Year 1, Sem 1", department: "CS_DEPT", status: "absent" },
  { id: "S006", name: "Biruk Wondimu", year: "Year 4, Sem 1", department: "CS_DEPT", status: "present" },
];

// ✅ Component name must start with uppercase letter
const Attendance = () => {
  // State
  const [teachers, setTeachers] = useState(initialTeachers);
  const [students, setStudents] = useState(initialStudents);
  const [roleFilter, setRoleFilter] = useState("all");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Filter teachers by department (ensuring only department members)
  const departmentTeachers = teachers.filter(t => t.department === DEPARTMENT_ID);
  const departmentStudents = students.filter(s => s.department === DEPARTMENT_ID);

  // Apply search filter to teachers
  const filteredTeachers = departmentTeachers.filter(teacher => {
    if (teacherSearch.trim() === "") return true;
    const term = teacherSearch.toLowerCase();
    return (
      teacher.name.toLowerCase().includes(term) ||
      teacher.id.toLowerCase().includes(term) ||
      teacher.email.toLowerCase().includes(term)
    );
  });

  // Apply search filter to students
  const filteredStudents = departmentStudents.filter(student => {
    if (studentSearch.trim() === "") return true;
    const term = studentSearch.toLowerCase();
    return (
      student.name.toLowerCase().includes(term) ||
      student.id.toLowerCase().includes(term) ||
      student.year.toLowerCase().includes(term)
    );
  });

  // Show toast notification
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2000);
  };

  // Update teacher attendance status
  const updateTeacherStatus = (teacherId, newStatus) => {
    setTeachers(prev =>
      prev.map(teacher =>
        teacher.id === teacherId && teacher.department === DEPARTMENT_ID
          ? { ...teacher, status: newStatus }
          : teacher
      )
    );
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      showToast(`Attendance updated for ${teacher.name} → ${newStatus.toUpperCase()}`);
    }
  };

  // Update student attendance status
  const updateStudentStatus = (studentId, newStatus) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === studentId && student.department === DEPARTMENT_ID
          ? { ...student, status: newStatus }
          : student
      )
    );
    const student = students.find(s => s.id === studentId);
    if (student) {
      showToast(`Attendance updated for ${student.name} → ${newStatus.toUpperCase()}`);
    }
  };

  // Bulk mark attendance for all department members
  const markBulkAttendance = () => {
    setTeachers(prev =>
      prev.map(teacher =>
        teacher.department === DEPARTMENT_ID ? { ...teacher, status: "present" } : teacher
      )
    );
    setStudents(prev =>
      prev.map(student =>
        student.department === DEPARTMENT_ID ? { ...student, status: "present" } : student
      )
    );
    showToast("✅ Bulk attendance marked as PRESENT for all department teachers & students");
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return { className: "status-present", text: "Present", icon: <CheckCircle size={14} /> };
      case "absent":
        return { className: "status-absent", text: "Absent", icon: <XCircle size={14} /> };
      default:
        return { className: "status-late", text: "Late", icon: <Clock size={14} /> };
    }
  };

  return (

          <div className="attendance-dashboard">
            {/* Header */}
            <div className="dashboard-header">
              <div>
                <h1>Attendance</h1>
                <p>Manage attendance for teachers & students<strong>Computer Science Dept</strong></p>
              </div>

              <button className="register-btn" onClick={markBulkAttendance}>
                <Edit3 size={18} /> Mark Bulk Attendance
              </button>
            </div>

            {/* Department Info Card */}
            <div className="card">
              <div className="dept-info-row">
                <div className="dept-info">
                  <Users size={18} className="dept-icon" />
                  <strong>Active Department:</strong> Faculty of Computing - Computer Science (CS)
                </div>
                <div className="badge-type">
                  <UserCheck size={14} /> Role: Department Head
                </div>
              </div>
              <hr />
              
              {/* Role Filter Chips */}
              <div className="filter-btns">
                <button
                  className={`filter-chip ${roleFilter === "all" ? "active" : ""}`}
                  onClick={() => setRoleFilter("all")}
                >
                  All Members
                </button>
                <button
                  className={`filter-chip ${roleFilter === "teacher" ? "active" : ""}`}
                  onClick={() => setRoleFilter("teacher")}
                >
                  Teachers
                </button>
                <button
                  className={`filter-chip ${roleFilter === "student" ? "active" : ""}`}
                  onClick={() => setRoleFilter("student")}
                >
                  Students
                </button>
              </div>
            </div>

            {/* Teachers Section */}
            {(roleFilter === "all" || roleFilter === "teacher") && (
              <div className="card">
                <h3 className="section-title">
                  <Users size={18} /> Department Teachers Attendance
                </h3>
                
                <div className="input-group">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search teacher by name, ID or email..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                  />
                </div>

                <div className="table-wrapper">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Status Today</th>
                        <th>Mark Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="empty-row">No teachers found under this department</td>
                        </tr>
                      ) : (
                        filteredTeachers.map((teacher) => {
                          const badge = getStatusBadge(teacher.status);
                          return (
                            <tr key={teacher.id}>
                              <td>{teacher.id}</td>
                              <td><strong>{teacher.name}</strong></td>
                              <td>{teacher.email}</td>
                              <td>
                                <span className={`status-badge ${badge.className}`}>
                                  {badge.icon} {badge.text}
                                </span>
                              </td>
                              <td>
                                <div className="attendance-control">
                                  <button
                                    className={`attn-btn present ${teacher.status === "present" ? "active-status" : ""}`}
                                    onClick={() => updateTeacherStatus(teacher.id, "present")}
                                  >
                                    <CheckCircle size={14} /> Present
                                  </button>
                                  <button
                                    className={`attn-btn absent ${teacher.status === "absent" ? "active-status" : ""}`}
                                    onClick={() => updateTeacherStatus(teacher.id, "absent")}
                                  >
                                    <XCircle size={14} /> Absent
                                  </button>
                                  <button
                                    className={`attn-btn late ${teacher.status === "late" ? "active-status" : ""}`}
                                    onClick={() => updateTeacherStatus(teacher.id, "late")}
                                  >
                                    <Clock size={14} /> Late
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Students Section */}
            {(roleFilter === "all" || roleFilter === "student") && (
              <div className="card">
                <h3 className="section-title">
                  <Users size={18} /> Department Students Attendance
                </h3>
                
                <div className="input-group">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search student by name, ID or year..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>

                <div className="table-wrapper">
                  <table className="attendance-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Year/Semester</th>
                        <th>Status Today</th>
                        <th>Mark Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="empty-row">No students found under this department</td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const badge = getStatusBadge(student.status);
                          return (
                            <tr key={student.id}>
                              <td>{student.id}</td>
                              <td><strong>{student.name}</strong></td>
                              <td>{student.year}</td>
                              <td>
                                <span className={`status-badge ${badge.className}`}>
                                  {badge.icon} {badge.text}
                                </span>
                              </td>
                              <td>
                                <div className="attendance-control">
                                  <button
                                    className={`attn-btn present ${student.status === "present" ? "active-status" : ""}`}
                                    onClick={() => updateStudentStatus(student.id, "present")}
                                  >
                                    <CheckCircle size={14} /> Present
                                  </button>
                                  <button
                                    className={`attn-btn absent ${student.status === "absent" ? "active-status" : ""}`}
                                    onClick={() => updateStudentStatus(student.id, "absent")}
                                  >
                                    <XCircle size={14} /> Absent
                                  </button>
                                  <button
                                    className={`attn-btn late ${student.status === "late" ? "active-status" : ""}`}
                                    onClick={() => updateStudentStatus(student.id, "late")}
                                  >
                                    <Clock size={14} /> Late
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
    );
      
      
};

export default Attendance;