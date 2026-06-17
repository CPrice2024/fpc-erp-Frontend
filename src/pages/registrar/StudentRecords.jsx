import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  UserPlus,
  Users,
  User,
  Building2,
  FileText,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  Filter,
  MoreVertical,
  X
} from "lucide-react";
import "./StudentRecords.css";

export default function StudentRecords() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const levels = ["Level I", "Level II", "Level III", "Level IV", "Level V"];

  useEffect(() => {
    fetchStudents();
    fetchDepartments();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, search, departmentFilter, levelFilter]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeMenu && !e.target.closest('.action-menu-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/registrars/students");
      setStudents(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/registrars/departments");
      setDepartments(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filterStudents = () => {
    let data = [...students];

    if (search) {
      data = data.filter(
        (student) =>
          student.firstName?.toLowerCase().includes(search.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(search.toLowerCase()) ||
          student.fatherName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (departmentFilter) {
      data = data.filter((student) => student.department?._id === departmentFilter);
    }

    if (levelFilter) {
      data = data.filter((student) => student.level === levelFilter);
    }

    setFilteredStudents(data);
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
      setActiveMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = (studentId, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === studentId ? null : studentId);
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return (
        <span className="status-badge active">
          <span className="status-dot"></span>
          Active
        </span>
      );
    }
    return (
      <span className="status-badge inactive">
        <span className="status-dot"></span>
        Inactive
      </span>
    );
  };

  const exportExcel = () => {
    const headers = ["ID", "Name", "Gender", "Department", "Level", "Academic Year", "Batch", "Phone", "Status"];
    const data = filteredStudents.map(s => [
      s.studentId,
      `${s.firstName} ${s.fatherName}`,
      s.gender,
      s.department?.name || "",
      s.level,
      s.academicYear,
      s.batch,
      s.phone,
      s.status
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="enrollment-container">
      {/* Header */}
      <div className="enrollment-container">
        <div>
          <h1>
            Student Records
          </h1>
          <p>Manage all registered students across departments</p>
        </div>

        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchStudents}>
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
            Refresh
          </button>
          <button onClick={exportExcel}>
            <Download size={18} />
            Export Excel
          </button>
          <button onClick={() => window.print()}>
            <Printer size={18} />
            Print
          </button>
          <button
            className="add-btn"
            onClick={() => navigate("/registrar/Enrollment")}
          >
            <UserPlus size={18} />
            Add Student
          </button>
          <button>
            <FileText size={18} />
            ID Card
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
        className="header-actions button"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
              {dept.name}
            </option>
          ))}
        </select>

        <select
        className="header-actions button"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="">All Levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h2>{students.length}</h2>
          <p>Total Students</p>
        </div>

        <div className="summary-card">
          <h2>{students.filter(s => s.gender === "Male").length}</h2>
          <p>Male</p>
        </div>

        <div className="summary-card">
          <h2>{students.filter(s => s.gender === "Female").length}</h2>
          <p>Female</p>
        </div>

        <div className="summary-card">
          <h2>{departments.length}</h2>
          <p>Departments</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Photo</th>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Department</th>
              <th>Level</th>
              <th>Academic Year</th>
              <th>Batch</th>
              <th>Phone</th>
              <th>Registered</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12">
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading students...</p>
                  </div>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="12">
                  <div className="empty-state">
                    <Users size={48} />
                    <h3>No Students Found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td data-label="Photo">
                    <img
                      src={
                        student.photo
                          ? `http://localhost:5000${student.photo}`
                          : "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.firstName || "S")
                      }
                      alt={student.firstName}
                    />
                  </td>
                  <td data-label="ID">{student.studentId}</td>
                  <td data-label="Name">
                    {student.firstName} {student.fatherName}
                  </td>
                  <td data-label="Gender">{student.gender}</td>
                  <td data-label="Department">
                    <span className="dept-badge">
                      {student.department?.name || "-"}
                    </span>
                  </td>
                  <td data-label="Level">
                    <span className="level-badge">{student.level}</span>
                  </td>
                  <td data-label="Academic Year">{student.academicYear}</td>
                  <td data-label="Batch">{student.batch}</td>
                  <td data-label="Phone">{student.phone}</td>
                  <td data-label="Registered">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td data-label="Status">{getStatusBadge(student.status)}</td>
                  <td data-label="Actions">
                    <div className="action-menu-container">
                      <button
                        className="action-menu-btn"
                        onClick={(e) => toggleMenu(student._id, e)}
                        title="Actions"
                      >
                        <MoreVertical size={18} />
                      </button>
                      
                      {activeMenu === student._id && (
                        <div className="action-popup">
                          <div className="popup-arrow"></div>
                          <button
                            className="popup-action view"
                            onClick={() => {
                              navigate(`/registrar/students/view/${student._id}`);
                              setActiveMenu(null);
                            }}
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                          <button
                            className="popup-action edit"
                            onClick={() => {
                              navigate(`/registrar/enrollment/${student._id}`);
                              setActiveMenu(null);
                            }}
                          >
                            <Edit2 size={16} />
                            <span>Edit</span>
                          </button>
                          <button
                            className="popup-action delete"
                            onClick={() => deleteStudent(student._id)}
                          >
                            <Trash2 size={16} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}