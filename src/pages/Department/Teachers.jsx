import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Download,
  RefreshCw,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Upload,
  MessageCircle,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  UserCheck,
  UserX,
  MoreVertical,
  Copy,
  Archive,
  Send
} from "lucide-react";
import api from "../../api/axios";
import "./TeacherManagement.css";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    qualification: "",
    experience: "",
    joiningDate: "",
    status: "active",
    address: "",
    emergencyContact: "",
    salary: "",
    department: "",
    assignedClass: "",
    subjects: []
  });

  const [assignData, setAssignData] = useState({
    teacherId: "",
    classId: "",
    subjects: [],
    startDate: "",
    endDate: ""
  });

  // Available subjects
  const availableSubjects = [
    "Mathematics", "Physics", "Chemistry", "Biology", 
    "Computer Science", "English", "History", "Geography",
    "Economics", "Business Studies", "Accounting", "Psychology"
  ];

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
    fetchDepartments();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/department/teachers");
      setTeachers(response.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      showToast("Failed to fetch teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await api.get("/department/classes");
      setClasses(response.data || [
        { id: 1, name: "Class 10A", section: "A", strength: 35 },
        { id: 2, name: "Class 10B", section: "B", strength: 32 },
        { id: 3, name: "Class 11A", section: "A", strength: 38 },
        { id: 4, name: "Class 11B", section: "B", strength: 36 },
        { id: 5, name: "Class 12A", section: "A", strength: 40 },
        { id: 6, name: "Class 12B", section: "B", strength: 37 }
      ]);
    } catch (error) {
      console.error("Error fetching classes:", error);
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

  const handleCreateTeacher = async () => {
    try {
      const response = await api.post("/department/teachers", formData);
      setTeachers([...teachers, response.data]);
      setShowModal(false);
      resetForm();
      showToast("Teacher created successfully", "success");
    } catch (error) {
      console.error("Error creating teacher:", error);
      showToast(error.response?.data?.message || "Failed to create teacher", "error");
    }
  };

  const handleUpdateTeacher = async () => {
    try {
      const response = await api.put(`/department/teachers/${selectedTeacher.id}`, formData);
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? response.data : t));
      setShowModal(false);
      showToast("Teacher updated successfully", "success");
    } catch (error) {
      console.error("Error updating teacher:", error);
      showToast("Failed to update teacher", "error");
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    
    try {
      await api.delete(`/department/teachers/${id}`);
      setTeachers(teachers.filter(t => t.id !== id));
      showToast("Teacher deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      showToast("Failed to delete teacher", "error");
    }
  };

  const handleAssignToClass = async () => {
    try {
      await api.post("/department/assign-teacher", assignData);
      setShowAssignModal(false);
      fetchTeachers(); // Refresh teacher list
      showToast("Teacher assigned to class successfully", "success");
    } catch (error) {
      console.error("Error assigning teacher:", error);
      showToast("Failed to assign teacher", "error");
    }
  };

  const handleBulkUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/department/teachers/bulk-upload", formData);
      setTeachers([...teachers, ...response.data]);
      showToast(`${response.data.length} teachers uploaded successfully`, "success");
    } catch (error) {
      console.error("Error uploading teachers:", error);
      showToast("Failed to upload teachers", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      qualification: "",
      experience: "",
      joiningDate: "",
      status: "active",
      address: "",
      emergencyContact: "",
      salary: "",
      department: "",
      assignedClass: "",
      subjects: []
    });
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData(teacher);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleView = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const handleAssign = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignData({ ...assignData, teacherId: teacher.id });
    setShowAssignModal(true);
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Specialization", "Qualification", "Experience", "Status", "Assigned Class"];
    const data = filteredTeachers.map(teacher => [
      teacher.name,
      teacher.email,
      teacher.phone,
      teacher.specialization,
      teacher.qualification,
      teacher.experience,
      teacher.status,
      teacher.assignedClass || "Not Assigned"
    ]);
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `teachers_${new Date().toISOString()}.csv`;
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

  // Filtering and sorting
  const filteredTeachers = teachers
    .filter(teacher => {
      const matchesSearch = teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           teacher.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClass = selectedClass === "all" || teacher.assignedClass === selectedClass;
      const matchesStatus = selectedStatus === "all" || teacher.status === selectedStatus;
      return matchesSearch && matchesClass && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") comparison = a.name?.localeCompare(b.name);
      if (sortBy === "experience") comparison = (a.experience || 0) - (b.experience || 0);
      if (sortBy === "status") comparison = a.status?.localeCompare(b.status);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status) {
      case "active":
        return <span className="status-badge active"><CheckCircle size={12} /> Active</span>;
      case "inactive":
        return <span className="status-badge inactive"><XCircle size={12} /> Inactive</span>;
      default:
        return <span className="status-badge pending"><AlertCircle size={12} /> Pending</span>;
    }
  };

  const getExperienceLevel = (years) => {
    if (!years) return "Fresher";
    if (years < 2) return "Junior";
    if (years < 5) return "Mid-Level";
    if (years < 10) return "Senior";
    return "Expert";
  };

  return (
    <div className="teacher-management">
      {/* Header Section */}
      <div className="page-header-teacher">
        <div>
          <h1 className="page-title">Teacher Management</h1>
          <p className="page-subtitle">Manage faculty members and class assignments</p>
        </div>
        <div className="header-actions-teacher">
          <label className="upload-btn">
            <Upload size={18} />
            Bulk Upload
            <input type="file" accept=".csv,.xlsx" onChange={handleBulkUpload} hidden />
          </label>
          <button className="export-btn" onClick={exportToCSV}>
            <Download size={18} />
            Export
          </button>
          <button className="primary-btn" onClick={() => {
            resetForm();
            setModalMode("add");
            setShowModal(true);
          }}>
            <UserPlus size={18} />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards-teacher">
        <div className="stat-card-teacher">
          <div className="stat-icon" style={{ background: "#6366f110", color: "#6366f1" }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.length}</div>
            <div className="stat-label">Total Teachers</div>
          </div>
        </div>
        <div className="stat-card-teacher">
          <div className="stat-icon" style={{ background: "#10b98110", color: "#10b981" }}>
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.filter(t => t.status === "active").length}</div>
            <div className="stat-label">Active Teachers</div>
          </div>
        </div>
        <div className="stat-card-teacher">
          <div className="stat-icon" style={{ background: "#f59e0b10", color: "#f59e0b" }}>
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.filter(t => t.assignedClass).length}</div>
            <div className="stat-label">Assigned Teachers</div>
          </div>
        </div>
        <div className="stat-card-teacher">
          <div className="stat-icon" style={{ background: "#8b5cf610", color: "#8b5cf6" }}>
            <Award size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{teachers.filter(t => t.experience >= 5).length}</div>
            <div className="stat-label">Senior Faculty</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters-teacher">
        <div className="search-bar-teacher">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`filter-toggle-teacher ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
        </button>

        <select 
          className="sort-select-teacher"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Sort by Name</option>
          <option value="experience">Sort by Experience</option>
          <option value="status">Sort by Status</option>
        </select>

        <button 
          className="refresh-btn-teacher"
          onClick={fetchTeachers}
        >
          <RefreshCw size={18} className={loading ? "spinning" : ""} />
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel-teacher">
          <div className="filter-group">
            <label>Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="all">All Classes</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.name}>{cls.name}</option>
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
          <button 
            className="clear-filters-teacher"
            onClick={() => {
              setSelectedClass("all");
              setSelectedStatus("all");
              setSearchTerm("");
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Teachers Table */}
      <div className="table-container-teacher">
        {loading ? (
          <div className="loading-state-teacher">
            <div className="spinner"></div>
            <p>Loading teachers...</p>
          </div>
        ) : (
          <>
            <table className="teachers-table">
              <thead>
                <tr>
                  <th>Teacher</th>
                  <th>Contact</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Assigned Class</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTeachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="teacher-info-cell">
                      <div className="teacher-avatar">
                        {teacher.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="teacher-name">{teacher.name}</div>
                        <div className="teacher-qualification">{teacher.qualification || "N/A"}</div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info-cell">
                        <div><Mail size={14} /> {teacher.email}</div>
                        <div><Phone size={14} /> {teacher.phone || "N/A"}</div>
                      </div>
                    </td>
                    <td>
                      <span className="specialization-badge">{teacher.specialization || "General"}</span>
                    </td>
                    <td>
                      <div className="experience-cell">
                        <span className="experience-value">{teacher.experience || 0} years</span>
                        <span className="experience-level">{getExperienceLevel(teacher.experience)}</span>
                      </div>
                    </td>
                    <td>
                      {teacher.assignedClass ? (
                        <span className="assigned-class-badge">
                          <BookOpen size={12} />
                          {teacher.assignedClass}
                        </span>
                      ) : (
                        <button 
                          className="assign-btn-small"
                          onClick={() => handleAssign(teacher)}
                        >
                          <Plus size={12} />
                          Assign
                        </button>
                      )}
                    </td>
                    <td>{getStatusBadge(teacher.status)}</td>
                    <td className="actions-cell-teacher">
                      <button 
                        className="action-btn view"
                        onClick={() => handleView(teacher)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(teacher)}
                        title="Edit Teacher"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        title="Delete Teacher"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="action-btn assign"
                        onClick={() => handleAssign(teacher)}
                        title="Assign to Class"
                      >
                        <BookOpen size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-teacher">
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

            {filteredTeachers.length === 0 && (
              <div className="empty-state-teacher">
                <Users size={48} />
                <h3>No teachers found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="primary-btn" onClick={() => setShowModal(true)}>
                  <UserPlus size={18} />
                  Add Your First Teacher
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Teacher Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-teacher large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-teacher">
              <h2>{modalMode === "add" ? "Add New Teacher" : "Edit Teacher"}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-teacher">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="teacher@college.edu"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+1 234 567 890"
                    />
                  </div>
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
                </div>
              </div>

              <div className="form-section">
                <h3>Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Specialization</label>
                    <input
                      type="text"
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div className="form-group">
                    <label>Qualification</label>
                    <input
                      type="text"
                      value={formData.qualification}
                      onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                      placeholder="e.g., PhD, Masters"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                      placeholder="Years of experience"
                    />
                  </div>
                  <div className="form-group">
                    <label>Joining Date</label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Salary</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      placeholder="Annual salary"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Address & Emergency Contact</h3>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    rows="2"
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer-teacher">
              <button className="secondary-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button 
                className="primary-btn" 
                onClick={modalMode === "add" ? handleCreateTeacher : handleUpdateTeacher}
              >
                {modalMode === "add" ? "Create Teacher" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-teacher" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-teacher">
              <h2>Teacher Details</h2>
              <button className="close-btn" onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-teacher view-mode">
              <div className="view-avatar-large">
                {selectedTeacher.name?.charAt(0).toUpperCase()}
              </div>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label>Full Name</label>
                  <p>{selectedTeacher.name}</p>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <p>{selectedTeacher.email}</p>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <p>{selectedTeacher.phone || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Specialization</label>
                  <p>{selectedTeacher.specialization || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Qualification</label>
                  <p>{selectedTeacher.qualification || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Experience</label>
                  <p>{selectedTeacher.experience || 0} years</p>
                </div>
                <div className="detail-item">
                  <label>Joining Date</label>
                  <p>{selectedTeacher.joiningDate || "N/A"}</p>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <p>{getStatusBadge(selectedTeacher.status)}</p>
                </div>
                <div className="detail-item">
                  <label>Assigned Class</label>
                  <p>{selectedTeacher.assignedClass || "Not assigned"}</p>
                </div>
                <div className="detail-item">
                  <label>Address</label>
                  <p>{selectedTeacher.address || "N/A"}</p>
                </div>
              </div>
            </div>
            
            <div className="modal-footer-teacher">
              <button className="secondary-btn" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button 
                className="primary-btn" 
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedTeacher);
                }}
              >
                Edit Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign to Class Modal */}
      {showAssignModal && selectedTeacher && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-teacher" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-teacher">
              <h2>Assign Teacher to Class</h2>
              <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-teacher">
              <div className="assign-info">
                <div className="teacher-info-assign">
                  <div className="assign-avatar">{selectedTeacher.name?.charAt(0)}</div>
                  <div>
                    <h4>{selectedTeacher.name}</h4>
                    <p>{selectedTeacher.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Select Class</label>
                <select
                  value={assignData.classId}
                  onChange={(e) => setAssignData({...assignData, classId: e.target.value})}
                >
                  <option value="">Choose a class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - Section {cls.section} (Strength: {cls.strength})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Assign Subjects</label>
                <div className="subjects-selector">
                  {availableSubjects.map(subject => (
                    <label key={subject} className="subject-checkbox">
                      <input
                        type="checkbox"
                        value={subject}
                        checked={assignData.subjects.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAssignData({
                              ...assignData,
                              subjects: [...assignData.subjects, subject]
                            });
                          } else {
                            setAssignData({
                              ...assignData,
                              subjects: assignData.subjects.filter(s => s !== subject)
                            });
                          }
                        }}
                      />
                      <span>{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={assignData.startDate}
                    onChange={(e) => setAssignData({...assignData, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={assignData.endDate}
                    onChange={(e) => setAssignData({...assignData, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer-teacher">
              <button className="secondary-btn" onClick={() => setShowAssignModal(false)}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleAssignToClass}>
                Assign Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;