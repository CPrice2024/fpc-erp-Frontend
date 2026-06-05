import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  Bell,
  Search,
  Filter,
  CheckCircle,
  Mail,
  Phone,
  ChevronDown,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Edit2,
  ChevronRight,
  ChevronLeft,
  PieChart,
  BarChart3,
  X
} from "lucide-react";
import { getDashboard } from "../../api/collegeHeadApi";
import "./CHDashboard.css";

const CollegeHeadDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    departments: [],
    departmentData: [],
    enrollmentData: []
  });

  const [user, setUser] = useState({ 
    name: "Dr. John Smith", 
    role: "College Head", 
    email: "head@test.com",
    avatar: "JS"
  });

  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Department Request", message: "Computer Science department has requested additional funding", time: "5 min ago", read: false, type: "info" },
    { id: 2, title: "Faculty Meeting", message: "Annual faculty meeting scheduled for tomorrow at 10 AM", time: "1 hour ago", read: false, type: "event" },
    { id: 3, title: "Budget Approval", message: "Q4 budget has been approved by the finance committee", time: "3 hours ago", read: true, type: "success" }
  ]);

  useEffect(() => {
    fetchDashboardData();
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getDashboard();
      const data = response.data;
      
      setDashboardData({
        stats: [
          { title: "Total Departments", value: data.departments || 12, icon: <Building2 size={24} />, change: "+2", trend: "up", color: "#6366f1", bgColor: "#6366f110" },
          { title: "Total Students", value: data.students || 3450, icon: <GraduationCap size={24} />, change: "+12%", trend: "up", color: "#10b981", bgColor: "#10b98110" },
          { title: "Unread Messages", value: data.unreadMessages || 8, icon: <MessageCircle size={24} />, change: "-3", trend: "down", color: "#f59e0b", bgColor: "#f59e0b10" },
          { title: "Faculty Members", value: data.facultyMembers || 156, icon: <Users size={24} />, change: "+5", trend: "up", color: "#ef4444", bgColor: "#ef444410" }
        ],
        departments: [
          { id: 1, name: "Computer Science", code: "CS101", email: "cs@college.edu", phone: "+1 234 567 890", established: "2010", students: 450, faculty: 25, status: "active" },
          { id: 2, name: "Electrical Engineering", code: "ENG102", email: "eng@college.edu", phone: "+1 234 567 891", established: "1995", students: 580, faculty: 32, status: "active" },
          { id: 3, name: "Business Administration", code: "BUS103", email: "bus@college.edu", phone: "+1 234 567 892", established: "2005", students: 420, faculty: 20, status: "active" },
          { id: 4, name: "Medicine", code: "MED104", email: "med@college.edu", phone: "+1 234 567 893", established: "1980", students: 380, faculty: 45, status: "active" },
          { id: 5, name: "Arts & Humanities", code: "ART105", email: "art@college.edu", phone: "+1 234 567 894", established: "2000", students: 290, faculty: 18, status: "inactive" },
          { id: 6, name: "Law", code: "LAW106", email: "law@college.edu", phone: "+1 234 567 895", established: "2015", students: 310, faculty: 22, status: "active" }
        ],
        departmentData: [
          { name: "Computer Science", students: 450 },
          { name: "Engineering", students: 580 },
          { name: "Business", students: 420 },
          { name: "Medicine", students: 380 },
          { name: "Arts", students: 290 },
          { name: "Law", students: 310 }
        ],
        enrollmentData: [
          { year: "2020", students: 2800 },
          { year: "2021", students: 3050 },
          { year: "2022", students: 3250 },
          { year: "2023", students: 3400 },
          { year: "2024", students: 3450 }
        ]
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const exportData = {
      departments: dashboardData.departments,
      stats: dashboardData.stats,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `departments_export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Data exported successfully", "success");
  };

  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<div class="toast-content">${message}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  const filteredDepartments = dashboardData.departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "all" || dept.name === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const totalStudents = dashboardData.departments.reduce((sum, dept) => sum + (dept.students || 0), 0);
  const totalFaculty = dashboardData.departments.reduce((sum, dept) => sum + (dept.faculty || 0), 0);
  const maxStudents = Math.max(...dashboardData.enrollmentData.map(d => d.students || 0));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="college-head-dashboard">
      {/* Header */}
     

      {/* Stats Cards */}
      <div className="stats-grid">
        {dashboardData.stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: stat.bgColor, color: stat.color }}>
                {stat.icon}
              </div>
              <div className={`stat-trend ${stat.trend}`}>
                {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </div>
            </div>
            <div className="stat-value">{stat.value.toLocaleString()}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Visualization Section */}
      <div className="visualization-section">
        <div className="section-header">
          <h2>Departments Overview</h2>
          <div className="header-actions">
            <button className="action-btn" onClick={handleExport}>
              <Download size={18} />
              Export
            </button>
            <button className="action-btn" onClick={fetchDashboardData}>
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Department Distribution Chart */}
        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-header">
              <h3>Department Distribution</h3>
              <PieChart size={18} />
            </div>
            <div className="department-distribution">
              {dashboardData.departmentData.map((dept, idx) => (
                <div key={idx} className="distribution-item">
                  <div className="distribution-info">
                    <span className="dept-name">{dept.name}</span>
                    <span className="dept-students">{dept.students} students</span>
                  </div>
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{ 
                        width: `${(dept.students / totalStudents) * 100}%`,
                        background: `hsl(${idx * 60}, 70%, 50%)`
                      }}
                    />
                  </div>
                  <span className="distribution-percentage">
                    {((dept.students / totalStudents) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrollment Trends */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Enrollment Trends</h3>
              <BarChart3 size={18} />
            </div>
            <div className="enrollment-trends">
              {dashboardData.enrollmentData.map((data, idx) => (
                <div key={idx} className="trend-item">
                  <div className="trend-label">{data.year}</div>
                  <div className="trend-bar-container">
                    <div 
                      className="trend-bar"
                      style={{ 
                        width: `${(data.students / maxStudents) * 100}%`,
                        background: "linear-gradient(90deg, #6366f1, #8b5cf6)"
                      }}
                    >
                      <span className="trend-value">{data.students}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="table-section">
        <div className="section-header">
          <h2>Departments</h2>
          <p className="section-subtitle">Manage college departments and their information</p>
          <div className="table-actions">
            <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Department</label>
              <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                <option value="all">All Departments</option>
                {dashboardData.departments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
            <button 
              className="clear-filters"
              onClick={() => {
                setSelectedDepartment("all");
                setSearchTerm("");
              }}
            >
              Clear All
            </button>
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading departments...</p>
            </div>
          ) : (
            <>
              <table className="departments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Department Name</th>
                    <th>Code</th>
                    <th>Contact</th>
                    <th>Established</th>
                    <th>Students</th>
                    <th>Faculty</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDepartments.map((dept) => (
                    <tr key={dept.id}>
                      <td className="id-cell">#{dept.id}</td>
                      <td className="dept-name-cell">
                        <div className="dept-name-wrapper">
                          <div className="dept-icon">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <div className="dept-name">{dept.name}</div>
                            <div className={`dept-status ${dept.status}`}>
                              {dept.status}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="code-cell">{dept.code}</td>
                      <td>
                        <div className="contact-info">
                          <div><Mail size={12} /> {dept.email}</div>
                          <div><Phone size={12} /> {dept.phone}</div>
                        </div>
                      </td>
                      <td>{dept.established}</td>
                      <td className="student-count">{dept.students.toLocaleString()}</td>
                      <td>{dept.faculty}</td>
                      <td className="actions-cell">
                        <button className="action-btn view" title="View">
                          <Eye size={16} />
                        </button>
                        <button className="action-btn edit" title="Edit">
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
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

              {filteredDepartments.length === 0 && (
                <div className="empty-state">
                  <Building2 size={48} />
                  <h3>No departments found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="quick-stats-footer">
        <div className="stat-summary">
          <div className="summary-item">
            <span className="summary-label">Total Departments:</span>
            <span className="summary-value">{dashboardData.departments.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Students:</span>
            <span className="summary-value">{totalStudents.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Faculty:</span>
            <span className="summary-value">{totalFaculty}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Student-Faculty Ratio:</span>
            <span className="summary-value">{(totalStudents / totalFaculty).toFixed(1)}:1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeHeadDashboard;