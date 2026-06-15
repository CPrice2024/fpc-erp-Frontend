import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Users,
  Award,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import api from "../../api/axios";
import "./CourseManagement.css";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCredit, setSelectedCredit] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("courseName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();
  
  const [analytics, setAnalytics] = useState({
  totalCourses: 0,
  activeCourses: 0,
  totalCredits: 0,
  averageStudents: 0,
  departmentDistribution: [],
  levelDistribution: [],
});

const calculateAnalytics = (courseData) => {
  setAnalytics({
    totalCourses: courseData.length,

    activeCourses:courseData.filter(c => c.status === "active" ).length,

    totalCredits: courseData.reduce(
      (sum, c) =>
        sum + (c.creditHour || 0),
      0
    ),

    averageStudents: 0,

    departmentDistribution: [],
    levelDistribution: [],
  });
};
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/courses");
      setCourses(response.data || []);
      calculateAnalytics(response.data || []);
    } catch (error) {
  console.error("Error fetching courses:", error);
  setCourses([]);
}finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      await api.delete(
  `/courses/${id}`
);

await fetchCourses();
      showToast("Course deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast("Failed to delete course", "error");
    }
  };

  useEffect(() => {
  fetchCourses();
}, []);


  

  const handleExport = () => {
    const headers = [
  "Code",
  "Course Name",
  "Department",
  "Level",
  "Credit Hours",
  "Teacher",
  "Status"
];
const data = filteredCourses.map(course => [
  course.courseCode,
  course.courseName,
  course.department?.name || "",
  course.level,
  course.creditHour,
  course.teacher?.name || "",
  course.status
]);
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `courses_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Export completed successfully", "success");
  };

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<div class="toast-content">${message}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch =
  course.courseName
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase()) ||

  course.courseCode
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase()) ||

  course.teacher?.name
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === "all" || course.department?._id === selectedDepartment;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
      const matchesCredit = selectedCredit === "all" || course.creditHour === parseInt(selectedCredit); 
      return matchesSearch && matchesDept && matchesLevel && matchesStatus && matchesCredit;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "courseName") comparison = a.courseName?.localeCompare(b.courseName);
      if (sortBy === "code") comparison = a.courseCode?.localeCompare(b.courseCode);
      if (sortBy === "credits") comparison = (a.creditHour || 0) -(b.creditHour || 0)
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const getUniqueDepartments = () => {return courses.reduce((acc, course) => { if (course.department && !acc.find( d => d._id === course.department._id)) {acc.push(course.department);}return acc;},[]);};
  const getUniqueLevels = () => [...new Set(courses.map(c => c.level))];
  const getCreditOptions = () =>
  [...new Set(
    courses.map(
      c => c.creditHour
    )
  )];

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return <span className="status-badge active"><CheckCircle size={12} /> Active</span>;
      case "inactive":
        return <span className="status-badge inactive"><XCircle size={12} /> Inactive</span>;
        default: 
        return null;
    }
  };

const getLevelBadge = (level) => {
  return (
    <span className="level-badge">
      {level}
    </span>
  );
};
useEffect(() => {
  setCurrentPage(1);
}, [
  searchTerm,
  selectedDepartment,
  selectedLevel,
  selectedStatus,
  selectedCredit
]);

  return (
    <div className="course-management">
      {/* Header */}
      <div className="page-header-course">
        <div>
          <h1 className="page-title">Course Management</h1>
          <p className="page-subtitle">Manage academic courses, curriculum, and assignments</p>
        </div>
        <div className="header-actions-course">
          <button className="export-btn" onClick={handleExport}>
            <Download size={18} />
            Export
          </button>
          <button className="refresh-btn" onClick={() => fetchCourses()}>
            <RefreshCw size={18} className={loading ? "spinning" : ""} />
          </button>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              📋 Table
            </button>
            <button
  className="primary-btn"
  onClick={() =>
    navigate(
      "/department-head/courses/create"
    )
  }
>
  <Plus size={12} />
  Course
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
      <div className="analytics-grid-course">
        <div className="analytics-card-course">
          <div className="analytics-icon" style={{ background: "#6366f110", color: "#6366f1" }}>
            <BookOpen size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.totalCourses}</div>
            <div className="analytics-label">Total Courses</div>
          </div>
        </div>
        <div className="analytics-card-course">
          <div className="analytics-icon" style={{ background: "#10b98110", color: "#10b981" }}>
            <CheckCircle size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.activeCourses}</div>
            <div className="analytics-label">Active Courses</div>
          </div>
        </div>
        <div className="analytics-card-course">
          <div className="analytics-icon" style={{ background: "#f59e0b10", color: "#f59e0b" }}>
            <Award size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.totalCredits}</div>
            <div className="analytics-label">Total Credits</div>
          </div>
        </div>
        <div className="analytics-card-course">
          <div className="analytics-icon" style={{ background: "#8b5cf610", color: "#8b5cf6" }}>
            <Users size={24} />
          </div>
          <div className="analytics-info">
            <div className="analytics-value">{analytics.averageStudents}</div>
            <div className="analytics-label">Teacher Assignment</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-course">
        <div className="search-bar-course">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by course name, code, or Teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`filter-toggle-course ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>

        <select 
          className="sort-select-course"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="courseName">Sort by Name</option>
          <option value="code">Sort by Code</option>
          <option value="credits">Sort by Credits</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel-course">
          <div className="filter-group">
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              {getUniqueDepartments().map(dept => (<option key={dept._id}value={dept._id}>{dept.name}</option>))}
            </select>
          </div>
          <div className="filter-group">
            <label>Level</label>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="all">All Levels</option>
              {getUniqueLevels().map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Status</label>
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Credits</label>
            <select value={selectedCredit} onChange={(e) => setSelectedCredit(e.target.value)}>
              <option value="all">All Credits</option>
              {getCreditOptions().map(credit => (
                <option key={credit} value={credit}>{credit} credits</option>
              ))}
            </select>
          </div>
          <button 
            className="clear-filters-course"
            onClick={() => {
              setSelectedDepartment("all");
              setSelectedLevel("all");
              setSelectedStatus("all");
              setSelectedCredit("all");
              setSearchTerm("");
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Course Display */}
      {loading ? (
        <div className="loading-state-course">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : viewMode === "table" ? (
        <div className="table-container-course">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Course Name</th>
                <th>Department</th>
                <th>Level</th>
                <th>Credits</th>
                <th>Teacher</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
                <tr key={course._id}>
                  <td><span className="course-code">{course.courseCode}</span></td>
                  <td className="course-info-cell">
                    <BookOpen size={16} className="course-icon" />
                    <div>
                      <div className="course-name">{course.courseName}</div>
                    </div>
                  </td>
                  <td> {course.department?.name}</td>
                  <td>{getLevelBadge(course.level)}</td>
                  <td>{course.creditHour} credits</td>
                  <td>{course.teacher?.name || "Not Assigned"}</td>
                  <td>{getStatusBadge(course.status)}</td>
                  <td className="actions-cell-course">
                    <button className="action-btn view" onClick={() =>
      navigate(
        `/department-head/courses/view/${course._id}`
      )
    }
  >
    <Eye size={16} />
  </button>

  <button
    className="action-btn edit"
    onClick={() =>
      navigate(
        `/department-head/courses/edit/${course._id}`
      )
    }
  >
    <Edit2 size={16} />
  </button>

  <button
    className="action-btn delete"
    onClick={() =>
      handleDeleteCourse(course._id)
    }
  >
    <Trash2 size={16} />
  </button>

</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-course">
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
        <div className="courses-grid">
          {currentCourses.map((course) => (
            <div key={course._id} className="course-grid-card">
              <div className="grid-card-header-course">
                <div className="course-code-badge">{course.courseCode}</div>
                {getStatusBadge(course.status)}
              </div>
              <div className="grid-card-body-course">
                <h3>{course.courseName}</h3>
                <div className="course-meta">
                  <div className="meta-item">
                    <GraduationCap size={14} />
                    <span>{course.level}</span>
                  </div>
                  <div className="meta-item">
                    <Award size={14} />
                    <span>{course.creditHour} credits</span>
                  </div>
                </div>
                <div className="course-Teacher">
                  <UserCheck size={14} />
                  <span>{course.teacher?.name || "Not Assigned"}</span>
                </div>
              </div>
              <div className="grid-card-footer-course">
               <button
  className="view-btn-grid"
  onClick={() =>
    navigate(
      `/department-head/courses/view/${course._id}`
    )
  }
>
  <Eye size={16} />
  View
</button>
                <button
  className="edit-btn-grid"
  onClick={() =>
    navigate(
      `/department-head/courses/edit/${course._id}`
    )
  }
>
  <Edit2 size={16} />
  Edit
</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && !loading && (
        <div className="empty-state-course">
          <BookOpen size={48} />
          <h3>No courses found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;