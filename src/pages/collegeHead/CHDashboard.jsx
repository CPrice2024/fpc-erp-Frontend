import { useState, useEffect } from "react";
import { getDashboard } from "../../api/collegeHeadApi";
import { useNavigate } from "react-router-dom";

import "./CHDashboard.css";
import {
  BookOpen,
  GraduationCap,
  Users,
  Building2,
  Download,
  RefreshCw,
  PieChart,
  Filter,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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
  stats: {},
  departmentSummary: [],
  levelStats: [],
  recentStudents: [],
});


const fetchDashboardData = async () => {
  setLoading(true);

  try {
    const response = await getDashboard();

   console.log("API URL:", import.meta.env.VITE_API_URL);
console.log("REQUEST URL:", `${import.meta.env.VITE_API_URL}/college-head/dashboard`);
console.log("DASHBOARD RESPONSE:", response);
    console.log(
  "FULL DASHBOARD DATA:",
  JSON.stringify(response.data, null, 2)
);

console.log(
  "departmentSummary:",
  response.data.departmentSummary
);

console.log(
  "levelStats:",
  response.data.levelStats
);

console.log(
  "recentStudents:",
  response.data.recentStudents
);

    setDashboardData({
      stats: response.data?.stats || {},
      departmentSummary:
        response.data?.departmentSummary || [],
      levelStats:
        response.data?.levelStats || [],
      recentStudents:
        response.data?.recentStudents || [],
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
  } finally {
    setLoading(false);
  }
};
const navigate = useNavigate();
  const handleExport = () => {
    const exportData = {
      departments: dashboardData.departmentSummary,
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
  const totalStudents =
  dashboardData.stats?.totalStudents || 1;
  console.log("CURRENT STATE:", dashboardData);

  const filteredDepartments =
  (dashboardData?.departmentSummary || []).filter((dept) => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDepartment === "all" || dept.name === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

    useEffect(() => {
    fetchDashboardData();
    
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);


  return (
    <div className="college-head-dashboard">
      {/* Header */}
     

      {/* Stats Cards */}
   <div className="stats-grid">

  <div className="stat-card">
    <GraduationCap size={24} />
    <div className="stat-value">
      {dashboardData.stats?.totalStudents || 0}
    </div>
    <div className="stat-title">
      Students
    </div>
  </div>

  <div className="stat-card">
    <Users size={24} />
    <div className="stat-value">
      {dashboardData.stats?.totalTeachers || 0}
    </div>
    <div className="stat-title">
      Teachers
    </div>
  </div>

  <div className="stat-card">
    <BookOpen size={24} />
    <div className="stat-value">
      {dashboardData.stats?.totalCourses || 0}
    </div>
    <div className="stat-title">
      Courses
    </div>
  </div>

  <div className="stat-card">
    <Building2 size={24} />
    <div className="stat-value">
      {dashboardData.stats?.totalDepartments || 0}
    </div>
    <div className="stat-title">
      Departments
    </div>
  </div>

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
              {dashboardData.departmentSummary.map((dept, idx) => (
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
        </div>
      </div>
      <div className="analytics-card">
  <h3>Students By Level</h3>

  {dashboardData.levelStats.map((level) => (
    <div
      key={level._id}
      className="level-row"
    >
      <span>
        {level._id || "Not Set"}
      </span>

      <span>
        {level.count}
      </span>
    </div>
  ))}
</div>

      <div className="department-grid">
  {(dashboardData?.departmentSummary || []).map((dept) => (
    <div
      key={dept._id}
      className="department-card"
    >
      <h3>{dept.name}</h3>

      <div className="dept-metrics">
  <div>
    <strong>{dept.students}</strong>
    <span>Students</span>
  </div>

  <div>
    <strong>{dept.teachers}</strong>
    <span>Teachers</span>
  </div>

  <div>
    <strong>{dept.courses}</strong>
    <span>Courses</span>
  </div>
</div>

      <p>
        Head:
        {" "}
        {dept.departmentHead?.name ||
          "Not Assigned"}
      </p>
    </div>
  ))}
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
                {(dashboardData?.departmentSummary || []).map((dept) => (
  <option
    key={dept._id}
    value={dept.name}
  >
    {dept.name}
  </option>
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
                    <tr key={dept._id}>
                      <td className="id-cell">
  #{dept._id.slice(-6)}
</td>
                      <td className="dept-name-cell">
                        <div className="dept-name-wrapper">
                          <div className="dept-icon">
                            <Building2 size={16} />
                          </div>
                          <div>
                            <div className="dept-name">{dept.name}</div>
                            <div className="dept-status active">
  Active
</div>
                          </div>
                        </div>
                      </td>
                      <td className="code-cell">{dept.code}</td>
                        <td></td>
                      <td></td>
                      <td className="student-count">{dept.students.toLocaleString()}</td>
                      <td>{dept.teachers}</td>
                      <td className="actions-cell">
  <button
    className="action-btn view"
    title="View"
    onClick={() =>
      navigate(
        `/college-head/departments/view/${dept._id}`
      )
    }
  >
    <Eye size={16} />
  </button>

  <button
    className="action-btn edit"
    title="Edit"
    onClick={() =>
      navigate(
        `/college-head/departments/edit/${dept._id}`
      )
    }
  >
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
            <span className="summary-value">{dashboardData.departmentSummary.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Students:</span>
            <span className="summary-value">{dashboardData.stats?.totalStudents || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Total Faculty:</span>
            <span className="summary-value">{dashboardData.stats?.totalTeachers || 0}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Student-Faculty Ratio:</span>
            <span className="summary-value">{(
 (dashboardData.stats?.totalStudents || 0) /
 Math.max(
   dashboardData.stats?.totalTeachers || 1,
   1
 )
).toFixed(1)}:1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeHeadDashboard;