import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  X,
  GraduationCap,
  Users,
  Award,
  TrendingUp,
  TrendingDown,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import "./GradeReport.css";

export default function GradeReport() {
  const navigate = useNavigate();
  
  // ===== STATES =====
  const [departments, setDepartments] = useState([]);
  const [gradeSummary, setGradeSummary] =
  useState([]);

  const [filteredSummary, setFilteredSummary] =
  useState([]);
  const [loading, setLoading] = useState(false);
  
  // ===== FILTER STATES =====
  const [filters, setFilters] = useState({
    department: "",
    level: "",
    status: "all", // all, passed, failed
    search: "",
  });
  
  // ===== STATISTICS =====
  const [stats, setStats] =
useState({
  totalStudents: 0,
  passed: 0,
  failed: 0,
  passRate: 0,
  averageGPA: 0,
  byLevel: {},
  byDepartment: {},
});

  // ===== FETCH FUNCTIONS =====
  const fetchDepartments = async () => {
    try {
      const { data } = await api.get("/registrars/departments");
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchGradeSummary =
async () => {

  console.log(filteredSummary);
  setLoading(true);

  try {

    const { data } =
      await api.get(
        "/grades/summary"
      );

    setGradeSummary(data);
    setFilteredSummary(data);

    calculateStats(data);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};

  // ===== CALCULATE STATISTICS =====
  const calculateStats = (studentData) => {
    const total = studentData.length;
    
    // Simulate grade calculation (replace with actual data from API)
    const passed =
  studentData.filter(
    s => s.status === "Passed"
  ).length;

const failed =
  studentData.filter(
    s => s.status === "Failed"
  ).length;
  const avgGpa =
  studentData.length
    ? (
        studentData.reduce(
          (sum, s) =>
            sum + Number(s.gpa),
          0
        ) /
        studentData.length
      ).toFixed(2)
    : 0;

    const passRate = total > 0 ? (passed / total) * 100 : 0;

    // Group by level
    const byLevel = {};
    studentData.forEach(s => {
      const level = s.level || "N/A";
      byLevel[level] = (byLevel[level] || 0) + 1;
    });

    // Group by department
    const byDepartment = {};
    studentData.forEach(s => {
      const dept = s.department?.name || "N/A";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });

    setStats({
  totalStudents: total,
  passed,
  failed,
  passRate,
  averageGPA: avgGpa,
  byLevel,
  byDepartment,
});
  };

  // ===== FILTER STUDENTS =====
  useEffect(() => {
    let filtered =
  [...gradeSummary];

    // Filter by department
    if (filters.department) {
      filtered = filtered.filter(s => {
        const deptId = typeof s.department === "object" ? s.department?._id : s.department;
        return deptId === filters.department;
      });
    }

    // Filter by level
    if (filters.level) {
      filtered = filtered.filter(s => s.level === filters.level);
    }

    // Filter by status (passed/failed)
   if (filters.status === "passed") {
  filtered = filtered.filter(
    s => s.status === "Passed"
  );
}

if (filters.status === "failed") {
  filtered = filtered.filter(
    s => s.status === "Failed"
  );
}

    // Search by name or ID
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.studentId?.toLowerCase().includes(searchLower) ||
        s.firstName?.toLowerCase().includes(searchLower) ||
        s.fatherName?.toLowerCase().includes(searchLower) ||
        s.email?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredSummary(filtered);
    calculateStats(filtered);
  }, [filters, gradeSummary]);

  // ===== INIT =====
  useEffect(() => {
    fetchDepartments();
    fetchGradeSummary();
  }, []);

  // ===== HELPER FUNCTIONS =====
 const getStatusBadge = (status) => {

  if (status === "Passed") {
    return {
      icon: CheckCircle,
      class: "status-passed",
      label: "Passed",
    };
  }

  if (status === "Failed") {
    return {
      icon: XCircle,
      class: "status-failed",
      label: "Failed",
    };
  }

  return {
    icon: AlertCircle,
    class: "status-pending",
    label: "Unknown",
  };
};


  // ===== EXPORT FUNCTIONS =====
  const exportToCSV = () => {
    const headers = ["Student ID", "Name", "Department", "Level", "Status", "GPA", "nominalDurations"];
    const rows = filteredSummary.map(s => [
  s.studentId,
  `${s.firstName} ${s.fatherName}`,
  s.department?.name || "N/A",
  s.level || "N/A",
  s.status,
  s.gpa,
  "-",
]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grade-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // ===== VIEW STUDENT HANDLER =====
  const handleViewStudent = (id) => {
  navigate(
    `/registrar/students/view/${id}`
  );
};

  // ===== RENDER =====
  return (
    <div className="grade-report-page">
      {/* ===== HEADER ===== */}
      <header className="grade-report-header">
        <div className="header-left">
          <div className="logo-wrapper">
            <GraduationCap size={38} className="header-icon" />
            <div>
              <h1>Grade Report</h1>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-print" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
        </div>
      </header>

      {/* ===== STATISTICS CARDS ===== */}
      <section className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <h3>{stats.totalStudents}</h3>
          </div>
        </div>

        <div className="stat-card stat-passed">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Passed</span>
            <h3>{stats.passed}</h3>
            <span className="stat-sub">{stats.passRate.toFixed(1)}%</span>
          </div>
        </div>

        <div className="stat-card stat-failed">
          <div className="stat-icon">
            <TrendingDown size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Failed</span>
            <h3>{stats.failed}</h3>
            <span className="stat-sub">{((100 - stats.passRate) || 0).toFixed(1)}%</span>
          </div>
        </div>

        <div className="stat-card stat-gpa">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Average GPA</span>
            <h3>{stats.averageGPA}</h3>
            <span className="stat-sub">College Average</span>
          </div>
        </div>
      </section>

      {/* ===== FILTERS ===== */}
      <section className="filters-section">
        <div className="filters-header">
          <h2>
            <Filter size={20} />
            Filters
          </h2>
          <button 
            className="clear-filters"
            onClick={() => setFilters({
              department: "",
              level: "",
              status: "all",
              search: "",
            })}
          >
            <X size={16} />
            Clear All
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            >
              <option value="">All Departments</option>
              {departments.map(d => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Level</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters({ ...filters, level: e.target.value })}
            > 
              <option value="Short Term">Short Term</option>
              <option value="Level I">Level I</option>
              <option value="Level II">Level II</option>
<option value="Level III">Level III</option>
<option value="Level IV">Level IV</option>
<option value="Level V">Level V</option>

            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <label>Search</label>
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESULTS COUNT ===== */}
      <div className="results-header">
        <span className="results-count">
          {filteredSummary.length} students found
        </span>
        {filteredSummary.length > 0 && (
          <span className="results-stats">
            <span className="stat-dot passed">●</span> {filteredSummary.filter(s => s.status === "Passed").length} passed
            <span className="stat-dot failed">●</span> {filteredSummary.filter(s => s.status === "Failed").length} failed
          </span>
        )}
      </div>

      {/* ===== STUDENT TABLE ===== */}
      <section className="table-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading students...</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="grade-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>GPA</th>
                  <th>nominalDurations</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      <FileText size={40} />
                      <p>No students found</p>
                      <span>Try adjusting your filters</span>
                    </td>
                  </tr>
                ) : (
                  filteredSummary.map((student, index) => {
                    console.log(student);
                    const statusBadge = getStatusBadge(student.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={student._id}>
                        <td>{index + 1}</td>
<td>{student.studentId}</td>

<td>
  {student.firstName}
  {" "}
  {student.fatherName}
</td>

<td>
  {student.department?.name || "N/A"}
</td>

<td>
  {student.level}
</td>

<td>
  <span className={statusBadge.class}>
    {student.status}
  </span>
</td>

<td>{student.gpa}</td>

<td>-</td>

                        
                        <td>
                          <button
  className="view-btn"
  onClick={() =>
    handleViewStudent(
      student._id
    )
  }
>
  View
</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}