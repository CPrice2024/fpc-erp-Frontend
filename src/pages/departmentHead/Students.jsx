import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MoreVertical,
  Calendar,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  BarChart3,
  TrendingUp,
  UserCheck,
  Activity,
  X
} from "lucide-react";
import api from "../../api/axios";
import "./StudentsManagement.css";

const StudentsManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    activeStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    averageAttendance: 0,
    averagePerformance: 0,
    topPerforming: [],
    classDistribution: [],
    yearDistribution: []
  });

  useEffect(() => {
    fetchStudents();
    fetchAnalytics();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get("/department/students");
      setStudents(response.data || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents(generateSampleStudents());
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/department/students/analytics");
      setAnalytics(response.data || generateSampleAnalytics(students));
    } catch (error) {
      setAnalytics(generateSampleAnalytics(students));
    }
  };

  const generateSampleStudents = () => {
    const sampleStudents = [];
    const names = ["John Smith", "Emma Johnson", "Michael Brown", "Sophia Davis", "William Wilson"];
    const classes = ["10A", "10B", "11A", "11B", "12A", "12B"];
    const statuses = ["active", "inactive", "graduated", "transferred"];
    const genders = ["Male", "Female"];
    
    for (let i = 1; i <= 30; i++) {
      sampleStudents.push({
        id: i,
        studentId: `STU${String(i).padStart(4, '0')}`,
        name: names[i % names.length] + " " + (Math.floor(Math.random() * 100) + 1),
        email: `student${i}@college.edu`,
        phone: `+1 234 567 ${String(890 + i).slice(0, 3)}`,
        gender: genders[i % 2],
        dateOfBirth: `200${Math.floor(Math.random() * 5) + 1}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        className: classes[Math.floor(Math.random() * classes.length)],
        year: Math.floor(Math.random() * 4) + 1,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        attendance: Math.floor(Math.random() * 30) + 70,
        performance: Math.floor(Math.random() * 30) + 70,
        gpa: (Math.random() * 2 + 2).toFixed(2),
        address: `${Math.floor(Math.random() * 1000)} Main Street, City`,
        parentName: `Parent of ${names[i % names.length]}`,
        parentPhone: `+1 234 567 ${String(800 + i).slice(0, 3)}`,
        parentEmail: `parent${i}@example.com`,
        enrollmentDate: `202${Math.floor(Math.random() * 3) + 1}-0${Math.floor(Math.random() * 9) + 1}-01`
      });
    }
    return sampleStudents;
  };

  const generateSampleAnalytics = (studentsList) => {
    const activeStudents = studentsList.filter(s => s.status === "active").length;
    const maleStudents = studentsList.filter(s => s.gender === "Male").length;
    const femaleStudents = studentsList.filter(s => s.gender === "Female").length;
    const avgAttendance = studentsList.reduce((sum, s) => sum + (s.attendance || 0), 0) / studentsList.length;
    const avgPerformance = studentsList.reduce((sum, s) => sum + (s.performance || 0), 0) / studentsList.length;
    
    const classMap = new Map();
    studentsList.forEach(s => {
      classMap.set(s.className, (classMap.get(s.className) || 0) + 1);
    });
    const classDistribution = Array.from(classMap.entries()).map(([name, count]) => ({ name, count }));
    
    const yearMap = new Map();
    studentsList.forEach(s => {
      yearMap.set(s.year, (yearMap.get(s.year) || 0) + 1);
    });
    const yearDistribution = Array.from(yearMap.entries()).map(([year, count]) => ({ year, count }));
    
    return {
      totalStudents: studentsList.length,
      activeStudents,
      maleStudents,
      femaleStudents,
      averageAttendance: Math.round(avgAttendance),
      averagePerformance: Math.round(avgPerformance),
      topPerforming: [...studentsList].sort((a, b) => b.performance - a.performance).slice(0, 5),
      classDistribution,
      yearDistribution
    };
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleExport = () => {
    const headers = ["Student ID", "Name", "Email", "Phone", "Class", "Year", "Status", "Attendance", "Performance", "GPA"];
    const data = filteredStudents.map(student => [
      student.studentId,
      student.name,
      student.email,
      student.phone,
      student.className,
      student.year,
      student.status,
      student.attendance + "%",
      student.performance + "%",
      student.gpa
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

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === "all" || student.className === selectedClass;
      const matchesStatus = selectedStatus === "all" || student.status === selectedStatus;
      const matchesGender = selectedGender === "all" || student.gender === selectedGender;
      const matchesYear = selectedYear === "all" || student.year === parseInt(selectedYear);
      return matchesSearch && matchesClass && matchesStatus && matchesGender && matchesYear;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") comparison = a.name?.localeCompare(b.name);
      if (sortBy === "performance") comparison = (a.performance || 0) - (b.performance || 0);
      if (sortBy === "attendance") comparison = (a.attendance || 0) - (b.attendance || 0);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const getUniqueClasses = () => [...new Set(students.map(s => s.className))];
  const getUniqueYears = () => [...new Set(students.map(s => s.year))];

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return <span className="status-badge active"><CheckCircle size={12} /> Active</span>;
      case "inactive":
        return <span className="status-badge inactive"><XCircle size={12} /> Inactive</span>;
      case "graduated":
        return <span className="status-badge graduated"><Award size={12} /> Graduated</span>;
      default:
        return <span className="status-badge transferred"><AlertCircle size={12} /> Transferred</span>;
    }
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 85) return "excellent";
    if (performance >= 70) return "good";
    if (performance >= 50) return "average";
    return "poor";
  };

  return (
    <div className="students-management">
      {/* Header */}
      <div className="page-header-students">
        <div>
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">View and manage student information and academic records</p>
        </div>
        <div className="header-actions-students">
          <button className="export-btn" onClick={handleExport}>
            <Download size={18} />
            Export Data
          </button>
          <button className="refresh-btn" onClick={() => { fetchStudents(); fetchAnalytics(); }}>
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
            Refresh
          </button>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Table
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🎴 Grid
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="analytics-icon" style={{ background: "#6366f110", color: "#6366f1" }}>
            <Users size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.totalStudents}</div>
            <div className="analytics-label">Total Students</div>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon" style={{ background: "#10b98110", color: "#10b981" }}>
            <UserCheck size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.activeStudents}</div>
            <div className="analytics-label">Active Students</div>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon" style={{ background: "#f59e0b10", color: "#f59e0b" }}>
            <BarChart3 size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.averagePerformance}%</div>
            <div className="analytics-label">Avg Performance</div>
          </div>
        </div>
        <div className="analytics-card">
          <div className="analytics-icon" style={{ background: "#8b5cf610", color: "#8b5cf6" }}>
            <Activity size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.averageAttendance}%</div>
            <div className="analytics-label">Avg Attendance</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-students">
        <div className="search-bar-students">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`filter-toggle-students ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>

        <select 
          className="sort-select-students"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="performance">Sort by Performance</option>
          <option value="attendance">Sort by Attendance</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel-students">
          <div className="filter-group">
            <label>Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="all">All Classes</option>
              {getUniqueClasses().map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Gender</label>
            <select value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="all">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <button 
            className="clear-filters-students"
            onClick={() => {
              setSelectedClass("all");
              setSelectedStatus("all");
              setSelectedGender("all");
              setSelectedYear("all");
              setSearchTerm("");
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Students Display */}
      {loading ? (
        <div className="loading-state-students">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="table-container-students">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                <th>Email</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.studentId}</td>
                  <td className="student-info-cell">
                    <div className="student-avatar">
                      {student.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="student-name">{student.name}</div>
                      <div className="student-gpa">GPA: {student.gpa}</div>
                    </div>
                  </td>
                  <td><span className="class-badge">{student.className}</span></td>
                  <td>{student.email}</td>
                  <td>
                    <div className="performance-cell">
                      <div className="performance-value">{student.attendance}%</div>
                      <div className="performance-bar-small">
                        <div className="performance-fill" style={{ width: `${student.attendance}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="performance-cell">
                      <div className={`performance-value ${getPerformanceColor(student.performance)}`}>
                        {student.performance}%
                      </div>
                      <div className="performance-bar-small">
                        <div 
                          className={`performance-fill ${getPerformanceColor(student.performance)}`} 
                          style={{ width: `${student.performance}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(student.status)}</td>
                  <td className="actions-cell-students">
                    <button 
                      className="action-btn view"
                      onClick={() => handleViewStudent(student)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-students">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="students-grid">
          {currentStudents.map((student) => (
            <div key={student.id} className="student-grid-card">
              <div className="grid-card-header">
                <div className="grid-student-avatar">
                  {student.name?.charAt(0).toUpperCase()}
                </div>
                <div className="grid-student-info">
                  <h4>{student.name}</h4>
                  <p>{student.studentId}</p>
                </div>
                {getStatusBadge(student.status)}
              </div>
              <div className="grid-card-body">
                <div className="grid-detail">
                  <GraduationCap size={14} />
                  <span>{student.className} | Year {student.year}</span>
                </div>
                <div className="grid-detail">
                  <Mail size={14} />
                  <span>{student.email}</span>
                </div>
                <div className="grid-detail">
                  <Phone size={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
              <div className="grid-card-footer">
                <div className="grid-performance">
                  <div className="grid-performance-item">
                    <span>Attendance</span>
                    <div className="mini-progress">
                      <div className="mini-progress-fill" style={{ width: `${student.attendance}%` }} />
                    </div>
                    <strong>{student.attendance}%</strong>
                  </div>
                  <div className="grid-performance-item">
                    <span>Performance</span>
                    <div className="mini-progress">
                      <div className="mini-progress-fill" style={{ width: `${student.performance}%` }} />
                    </div>
                    <strong>{student.performance}%</strong>
                  </div>
                </div>
                <button className="view-details-btn" onClick={() => handleViewStudent(student)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredStudents.length === 0 && !loading && (
        <div className="empty-state-students">
          <Users size={48} />
          <h3>No students found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-students" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-students">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-students view-mode">
              <div className="student-profile-header">
                <div className="profile-avatar-large">
                  {selectedStudent.name?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                  <h2>{selectedStudent.name}</h2>
                  <p className="profile-id">{selectedStudent.studentId}</p>
                  <div className="profile-badges">
                    {getStatusBadge(selectedStudent.status)}
                    <span className="class-badge">{selectedStudent.className}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Personal Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Full Name</label>
                    <p>{selectedStudent.name}</p>
                  </div>
                  <div className="detail-item">
                    <label>Student ID</label>
                    <p>{selectedStudent.studentId}</p>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <p>{selectedStudent.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <p>{selectedStudent.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Gender</label>
                    <p>{selectedStudent.gender}</p>
                  </div>
                  <div className="detail-item">
                    <label>Date of Birth</label>
                    <p>{selectedStudent.dateOfBirth}</p>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Academic Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Class</label>
                    <p>{selectedStudent.className}</p>
                  </div>
                  <div className="detail-item">
                    <label>Year</label>
                    <p>Year {selectedStudent.year}</p>
                  </div>
                  <div className="detail-item">
                    <label>GPA</label>
                    <p className="gpa-value">{selectedStudent.gpa}</p>
                  </div>
                  <div className="detail-item">
                    <label>Performance</label>
                    <div className="performance-detail">
                      <div className="performance-bar">
                        <div className="performance-fill" style={{ width: `${selectedStudent.performance}%` }} />
                      </div>
                      <span>{selectedStudent.performance}%</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Attendance</label>
                    <div className="performance-detail">
                      <div className="performance-bar">
                        <div className="performance-fill" style={{ width: `${selectedStudent.attendance}%` }} />
                      </div>
                      <span>{selectedStudent.attendance}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Parent Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Parent Name</label>
                    <p>{selectedStudent.parentName}</p>
                  </div>
                  <div className="detail-item">
                    <label>Parent Phone</label>
                    <p>{selectedStudent.parentPhone}</p>
                  </div>
                  <div className="detail-item">
                    <label>Parent Email</label>
                    <p>{selectedStudent.parentEmail}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer-students">
              <button className="secondary-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManagement;