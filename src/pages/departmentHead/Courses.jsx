import { useState, useEffect } from "react";
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
  Clock,
  Calendar,
  Users,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  GraduationCap,
  FileText,
  BarChart3,
  TrendingUp,
  UserCheck,
  BookMarked,
  Video,
  FileCheck,
  Target,
  Star,
  MessageCircle,
  MoreVertical,
  Copy,
  Archive,
  Send,
  Link2,
  CreditCard,
  DollarSign
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
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("table");
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalCourses: 0,
    activeCourses: 0,
    totalCredits: 0,
    averageStudents: 0,
    departmentDistribution: [],
    levelDistribution: []
  });

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "",
    level: "undergraduate",
    credits: 3,
    hours: 45,
    description: "",
    syllabus: "",
    prerequisites: [],
    objectives: [],
    status: "active",
    instructor: "",
    capacity: 30,
    enrolled: 0,
    semester: "fall",
    year: new Date().getFullYear(),
    schedule: {
      day: "monday",
      time: "09:00",
      duration: 2,
      room: ""
    }
  });

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchTeachers();
    fetchAnalytics();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await api.get("/department/courses");
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses(generateSampleCourses());
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments/list");
      setDepartments(response.data || [
        { id: 1, name: "Computer Science" },
        { id: 2, name: "Engineering" },
        { id: 3, name: "Business" },
        { id: 4, name: "Medicine" }
      ]);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/department/teachers");
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setTeachers([
        { id: 1, name: "Dr. John Smith" },
        { id: 2, name: "Prof. Sarah Johnson" },
        { id: 3, name: "Dr. Michael Brown" }
      ]);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/department/courses/analytics");
      setAnalytics(response.data || generateSampleAnalytics(courses));
    } catch (error) {
      setAnalytics(generateSampleAnalytics(courses));
    }
  };

  const generateSampleCourses = () => {
    const sampleCourses = [];
    const courseNames = [
      "Data Structures", "Algorithms", "Database Systems", "Operating Systems",
      "Computer Networks", "Software Engineering", "Web Development", "Machine Learning",
      "Artificial Intelligence", "Cybersecurity", "Cloud Computing", "Mobile Development"
    ];
    const departments = ["Computer Science", "Engineering", "Business"];
    const levels = ["undergraduate", "graduate", "diploma"];
    const statuses = ["active", "inactive", "draft"];
    
    for (let i = 1; i <= 25; i++) {
      sampleCourses.push({
        id: i,
        code: `CS${String(i).padStart(3, '0')}`,
        name: courseNames[i % courseNames.length] + (Math.floor(Math.random() * 100) + 1),
        department: departments[i % departments.length],
        level: levels[i % levels.length],
        credits: Math.floor(Math.random() * 3) + 2,
        hours: Math.floor(Math.random() * 30) + 30,
        description: `This course covers advanced topics in ${courseNames[i % courseNames.length]}`,
        instructor: teachers[i % teachers.length]?.name || "Staff",
        capacity: Math.floor(Math.random() * 40) + 20,
        enrolled: Math.floor(Math.random() * 35) + 5,
        status: statuses[i % statuses.length],
        semester: i % 2 === 0 ? "fall" : "spring",
        year: 2024,
        schedule: {
          day: ["monday", "tuesday", "wednesday", "thursday", "friday"][i % 5],
          time: `${9 + (i % 8)}:00`,
          duration: 2,
          room: `Room ${Math.floor(Math.random() * 100) + 100}`
        }
      });
    }
    return sampleCourses;
  };

  const generateSampleAnalytics = (coursesList) => {
    const activeCourses = coursesList.filter(c => c.status === "active").length;
    const totalCredits = coursesList.reduce((sum, c) => sum + c.credits, 0);
    const avgStudents = coursesList.reduce((sum, c) => sum + (c.enrolled || 0), 0) / coursesList.length;
    
    const deptMap = new Map();
    coursesList.forEach(c => {
      deptMap.set(c.department, (deptMap.get(c.department) || 0) + 1);
    });
    const departmentDistribution = Array.from(deptMap.entries()).map(([name, count]) => ({ name, count }));
    
    const levelMap = new Map();
    coursesList.forEach(c => {
      levelMap.set(c.level, (levelMap.get(c.level) || 0) + 1);
    });
    const levelDistribution = Array.from(levelMap.entries()).map(([level, count]) => ({ level, count }));
    
    return {
      totalCourses: coursesList.length,
      activeCourses,
      totalCredits,
      averageStudents: Math.round(avgStudents),
      departmentDistribution,
      levelDistribution
    };
  };

  const handleCreateCourse = async () => {
    try {
      const newCourse = {
        id: courses.length + 1,
        ...formData,
        enrolled: 0
      };
      setCourses([...courses, newCourse]);
      setShowModal(false);
      resetForm();
      fetchAnalytics();
      showToast("Course created successfully", "success");
    } catch (error) {
      console.error("Error creating course:", error);
      showToast("Failed to create course", "error");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      setCourses(courses.map(c => c.id === selectedCourse.id ? { ...selectedCourse, ...formData } : c));
      setShowModal(false);
      fetchAnalytics();
      showToast("Course updated successfully", "success");
    } catch (error) {
      console.error("Error updating course:", error);
      showToast("Failed to update course", "error");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      setCourses(courses.filter(c => c.id !== id));
      fetchAnalytics();
      showToast("Course deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting course:", error);
      showToast("Failed to delete course", "error");
    }
  };

  const handleDuplicateCourse = (course) => {
    const newCourse = {
      ...course,
      id: courses.length + 1,
      code: course.code + "_COPY",
      name: course.name + " (Copy)",
      enrolled: 0
    };
    setCourses([...courses, newCourse]);
    showToast("Course duplicated successfully", "success");
  };

  const handleExport = () => {
    const headers = ["Code", "Name", "Department", "Level", "Credits", "Instructor", "Enrolled", "Capacity", "Status"];
    const data = filteredCourses.map(course => [
      course.code,
      course.name,
      course.department,
      course.level,
      course.credits,
      course.instructor,
      course.enrolled,
      course.capacity,
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

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      department: "",
      level: "undergraduate",
      credits: 3,
      hours: 45,
      description: "",
      syllabus: "",
      prerequisites: [],
      objectives: [],
      status: "active",
      instructor: "",
      capacity: 30,
      enrolled: 0,
      semester: "fall",
      year: new Date().getFullYear(),
      schedule: {
        day: "monday",
        time: "09:00",
        duration: 2,
        room: ""
      }
    });
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData(course);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
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
      const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDepartment === "all" || course.department === selectedDepartment;
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
      const matchesStatus = selectedStatus === "all" || course.status === selectedStatus;
      const matchesCredit = selectedCredit === "all" || course.credits === parseInt(selectedCredit);
      return matchesSearch && matchesDept && matchesLevel && matchesStatus && matchesCredit;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") comparison = a.name?.localeCompare(b.name);
      if (sortBy === "code") comparison = a.code?.localeCompare(b.code);
      if (sortBy === "credits") comparison = a.credits - b.credits;
      if (sortBy === "enrolled") comparison = a.enrolled - b.enrolled;
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const getUniqueDepartments = () => [...new Set(courses.map(c => c.department))];
  const getUniqueLevels = () => [...new Set(courses.map(c => c.level))];
  const getCreditOptions = () => [...new Set(courses.map(c => c.credits))];

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return <span className="status-badge active"><CheckCircle size={12} /> Active</span>;
      case "inactive":
        return <span className="status-badge inactive"><XCircle size={12} /> Inactive</span>;
      default:
        return <span className="status-badge draft"><AlertCircle size={12} /> Draft</span>;
    }
  };

  const getLevelBadge = (level) => {
    switch(level) {
      case "undergraduate":
        return <span className="level-badge undergrad">Undergraduate</span>;
      case "graduate":
        return <span className="level-badge grad">Graduate</span>;
      default:
        return <span className="level-badge diploma">Diploma</span>;
    }
  };

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
          <button className="refresh-btn" onClick={() => { fetchCourses(); fetchAnalytics(); }}>
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
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              🎴 Grid
            </button>
          </div>
          <button className="primary-btn" onClick={() => {
            resetForm();
            setModalMode("add");
            setShowModal(true);
          }}>
            <Plus size={18} />
            Add Course
          </button>
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
            <div className="analytics-label">Avg Enrollment</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-course">
        <div className="search-bar-course">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by course name, code, or instructor..."
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
          <option value="name">Sort by Name</option>
          <option value="code">Sort by Code</option>
          <option value="credits">Sort by Credits</option>
          <option value="enrolled">Sort by Enrollment</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel-course">
          <div className="filter-group">
            <label>Department</label>
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              {getUniqueDepartments().map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
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
              <option value="draft">Draft</option>
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
                <th>Instructor</th>
                <th>Enrollment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
                <tr key={course.id}>
                  <td><span className="course-code">{course.code}</span></td>
                  <td className="course-info-cell">
                    <BookOpen size={16} className="course-icon" />
                    <div>
                      <div className="course-name">{course.name}</div>
                      <div className="course-hours">{course.hours} hours</div>
                    </div>
                  </td>
                  <td>{course.department}</td>
                  <td>{getLevelBadge(course.level)}</td>
                  <td>{course.credits} credits</td>
                  <td>{course.instructor}</td>
                  <td>
                    <div className="enrollment-cell">
                      <span className="enrollment-count">{course.enrolled}</span>
                      <span className="enrollment-capacity">/ {course.capacity}</span>
                      <div className="enrollment-bar">
                        <div 
                          className="enrollment-fill"
                          style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{getStatusBadge(course.status)}</td>
                  <td className="actions-cell-course">
                    <button 
                      className="action-btn view"
                      onClick={() => handleView(course)}
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(course)}
                      title="Edit Course"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="action-btn duplicate"
                      onClick={() => handleDuplicateCourse(course)}
                      title="Duplicate Course"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteCourse(course.id)}
                      title="Delete Course"
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
            <div key={course.id} className="course-grid-card">
              <div className="grid-card-header-course">
                <div className="course-code-badge">{course.code}</div>
                {getStatusBadge(course.status)}
              </div>
              <div className="grid-card-body-course">
                <h3>{course.name}</h3>
                <p className="course-description">{course.description?.substring(0, 100)}...</p>
                <div className="course-meta">
                  <div className="meta-item">
                    <GraduationCap size={14} />
                    <span>{course.level}</span>
                  </div>
                  <div className="meta-item">
                    <Award size={14} />
                    <span>{course.credits} credits</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={14} />
                    <span>{course.hours} hrs</span>
                  </div>
                </div>
                <div className="course-instructor">
                  <UserCheck size={14} />
                  <span>{course.instructor}</span>
                </div>
                <div className="course-enrollment">
                  <div className="enrollment-info">
                    <Users size={14} />
                    <span>{course.enrolled} / {course.capacity} students</span>
                  </div>
                  <div className="enrollment-bar">
                    <div 
                      className="enrollment-fill"
                      style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid-card-footer-course">
                <button className="view-btn-grid" onClick={() => handleView(course)}>
                  <Eye size={16} />
                  View Details
                </button>
                <button className="edit-btn-grid" onClick={() => handleEdit(course)}>
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
          <button className="primary-btn" onClick={() => {
            resetForm();
            setModalMode("add");
            setShowModal(true);
          }}>
            <Plus size={18} />
            Add Your First Course
          </button>
        </div>
      )}

      {/* Add/Edit Course Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-course large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-course">
              <h2>{modalMode === "add" ? "Add New Course" : "Edit Course"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-course">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Course Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="e.g., CS101"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Course Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Introduction to Programming"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Course Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value})}
                    >
                      <option value="undergraduate">Undergraduate</option>
                      <option value="graduate">Graduate</option>
                      <option value="diploma">Diploma</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Credits</label>
                    <input
                      type="number"
                      value={formData.credits}
                      onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                      min="1"
                      max="6"
                    />
                  </div>
                  <div className="form-group">
                    <label>Total Hours</label>
                    <input
                      type="number"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: parseInt(e.target.value)})}
                      min="15"
                      max="90"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Course Details</h3>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                    placeholder="Enter course description..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Instructor</label>
                    <select
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                    >
                      <option value="">Select Instructor</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    >
                      <option value="fall">Fall</option>
                      <option value="spring">Spring</option>
                      <option value="summer">Summer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Schedule Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Day</label>
                    <select
                      value={formData.schedule.day}
                      onChange={(e) => setFormData({
                        ...formData, 
                        schedule: {...formData.schedule, day: e.target.value}
                      })}
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      value={formData.schedule.time}
                      onChange={(e) => setFormData({
                        ...formData, 
                        schedule: {...formData.schedule, time: e.target.value}
                      })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Duration (hours)</label>
                    <input
                      type="number"
                      value={formData.schedule.duration}
                      onChange={(e) => setFormData({
                        ...formData, 
                        schedule: {...formData.schedule, duration: parseInt(e.target.value)}
                      })}
                      min="1"
                      max="4"
                    />
                  </div>
                  <div className="form-group">
                    <label>Room</label>
                    <input
                      type="text"
                      value={formData.schedule.room}
                      onChange={(e) => setFormData({
                        ...formData, 
                        schedule: {...formData.schedule, room: e.target.value}
                      })}
                      placeholder="e.g., Room 101"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer-course">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className="primary-btn" 
                onClick={modalMode === "add" ? handleCreateCourse : handleUpdateCourse}
              >
                {modalMode === "add" ? "Create Course" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Course Modal */}
      {showViewModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-course" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-course">
              <h2>Course Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-course view-mode">
              <div className="course-header-view">
                <div className="course-code-large">{selectedCourse.code}</div>
                <h2>{selectedCourse.name}</h2>
                {getStatusBadge(selectedCourse.status)}
              </div>

              <div className="details-section">
                <h3>Course Information</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Department</label>
                    <p>{selectedCourse.department}</p>
                  </div>
                  <div className="detail-item">
                    <label>Level</label>
                    <p>{selectedCourse.level}</p>
                  </div>
                  <div className="detail-item">
                    <label>Credits</label>
                    <p>{selectedCourse.credits}</p>
                  </div>
                  <div className="detail-item">
                    <label>Total Hours</label>
                    <p>{selectedCourse.hours} hours</p>
                  </div>
                  <div className="detail-item">
                    <label>Instructor</label>
                    <p>{selectedCourse.instructor}</p>
                  </div>
                  <div className="detail-item">
                    <label>Semester</label>
                    <p>{selectedCourse.semester} {selectedCourse.year}</p>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Schedule</h3>
                <div className="schedule-info">
                  <div className="schedule-item">
                    <Calendar size={16} />
                    <span>{selectedCourse.schedule?.day}</span>
                  </div>
                  <div className="schedule-item">
                    <Clock size={16} />
                    <span>{selectedCourse.schedule?.time}</span>
                  </div>
                  <div className="schedule-item">
                    <Clock size={16} />
                    <span>{selectedCourse.schedule?.duration} hours</span>
                  </div>
                  <div className="schedule-item">
                    <MapPin size={16} />
                    <span>{selectedCourse.schedule?.room}</span>
                  </div>
                </div>
              </div>

              <div className="details-section">
                <h3>Description</h3>
                <p className="course-description-full">{selectedCourse.description}</p>
              </div>

              <div className="details-section">
                <h3>Enrollment Statistics</h3>
                <div className="enrollment-stats">
                  <div className="stat-circle">
                    <div className="stat-number">{selectedCourse.enrolled}</div>
                    <div className="stat-label">Enrolled</div>
                  </div>
                  <div className="stat-circle">
                    <div className="stat-number">{selectedCourse.capacity}</div>
                    <div className="stat-label">Capacity</div>
                  </div>
                  <div className="stat-circle">
                    <div className="stat-number">
                      {Math.round((selectedCourse.enrolled / selectedCourse.capacity) * 100)}%
                    </div>
                    <div className="stat-label">Fill Rate</div>
                  </div>
                </div>
                <div className="enrollment-bar-large">
                  <div 
                    className="enrollment-fill-large"
                    style={{ width: `${(selectedCourse.enrolled / selectedCourse.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer-course">
              <button className="secondary-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="primary-btn" onClick={() => {
                setShowViewModal(false);
                handleEdit(selectedCourse);
              }}>
                <Edit2 size={16} />
                Edit Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;