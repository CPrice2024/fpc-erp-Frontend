import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  PieChart,
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  GraduationCap,
  Calendar,
  Filter,
  Search,
  Printer,
  Mail,
  Eye,
  ChevronDown,
  FileBarChart,
  FileSpreadsheet,
  FileJson,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BookOpen,
  Award,
  UserCheck
} from "lucide-react";
import api from "../../api/axios";
import "./Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState("academic");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportData, setReportData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [generatingReport, setGeneratingReport] = useState(false);

  // Report types
  const reportTypes = [
    { id: "academic", label: "Academic Report", icon: <BookOpen size={18} />, color: "#667eea" },
    { id: "student", label: "Student Report", icon: <Users size={18} />, color: "#48bb78" },
    { id: "department", label: "Department Report", icon: <Building2 size={18} />, color: "#ed8936" },
    { id: "staff", label: "Staff Report", icon: <UserCheck size={18} />, color: "#4299e1" },
    { id: "financial", label: "Financial Report", icon: <DollarSign size={18} />, color: "#fc8181" },
    { id: "performance", label: "Performance Report", icon: <Award size={18} />, color: "#9f7aea" }
  ];

  // Dashboard stats
  const [stats, setStats] = useState([
    { title: "Total Students", value: 3450, change: "+12%", icon: <GraduationCap size={24} />, color: "#667eea" },
    { title: "Total Departments", value: 12, change: "+2", icon: <Building2 size={24} />, color: "#48bb78" },
    { title: "Total Staff", value: 180, change: "+8", icon: <Users size={24} />, color: "#ed8936" },
    { title: "Graduation Rate", value: "92%", change: "+5%", icon: <Award size={24} />, color: "#4299e1" }
  ]);

  // Academic data
  const [academicData, setAcademicData] = useState({
    enrollmentRate: 88,
    graduationRate: 92,
    retentionRate: 85,
    averageGPA: 3.4,
    departments: [
      { name: "Computer Science", students: 450, passRate: 94 },
      { name: "Engineering", students: 580, passRate: 89 },
      { name: "Business", students: 420, passRate: 91 },
      { name: "Medicine", students: 380, passRate: 96 },
      { name: "Arts", students: 290, passRate: 87 }
    ],
    semesterData: [
      { semester: "Fall 2023", enrollment: 3200, graduation: 450 },
      { semester: "Spring 2024", enrollment: 3350, graduation: 480 },
      { semester: "Fall 2024", enrollment: 3450, graduation: 510 }
    ]
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedReport, dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Uncomment when API is ready
      // const response = await api.get(`/college-head/reports/${selectedReport}`, {
      //   params: dateRange
      // });
      // setReportData(response.data);
      
      // Simulated data
      setTimeout(() => {
        setReportData({
          generatedAt: new Date().toISOString(),
          reportType: selectedReport,
          data: academicData
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching report data:", error);
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would call an API endpoint
      if (selectedFormat === "pdf") {
        alert("PDF report generated successfully!");
      } else if (selectedFormat === "excel") {
        exportToExcel();
      } else if (selectedFormat === "csv") {
        exportToCSV();
      } else if (selectedFormat === "json") {
        exportToJSON();
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Error generating report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const exportToExcel = () => {
    const headers = ["Report Type", "Metric", "Value", "Date Generated"];
    const data = [
      [selectedReport, "Total Students", stats[0].value, new Date().toLocaleDateString()],
      [selectedReport, "Total Departments", stats[1].value, new Date().toLocaleDateString()],
      [selectedReport, "Total Staff", stats[2].value, new Date().toLocaleDateString()],
      [selectedReport, "Graduation Rate", stats[3].value, new Date().toLocaleDateString()]
    ];
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    downloadFile(csvContent, `report_${selectedReport}_${Date.now()}.xls`, "application/vnd.ms-excel");
  };

  const exportToCSV = () => {
    const headers = ["Metric", "Value", "Change", "Status"];
    const data = stats.map(stat => [stat.title, stat.value, stat.change, "Active"]);
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    downloadFile(csvContent, `report_${selectedReport}_${Date.now()}.csv`, "text/csv");
  };

  const exportToJSON = () => {
    const jsonData = {
      reportType: selectedReport,
      generatedAt: new Date().toISOString(),
      data: stats,
      academicSummary: academicData
    };
    
    const jsonString = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonString, `report_${selectedReport}_${Date.now()}.json`, "application/json");
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReport = () => {
    alert("Report will be sent to your email address");
  };

  const getReportSummary = () => {
    switch(selectedReport) {
      case "academic":
        return {
          title: "Academic Performance Summary",
          description: "Overview of academic metrics including enrollment, graduation rates, and departmental performance"
        };
      case "student":
        return {
          title: "Student Demographics Report",
          description: "Comprehensive analysis of student population, distribution, and academic progress"
        };
      case "department":
        return {
          title: "Departmental Performance Report",
          description: "Detailed analysis of each department's performance, student count, and success rates"
        };
      case "staff":
        return {
          title: "Staff & Faculty Report",
          description: "Staff distribution, qualifications, and departmental allocation"
        };
      default:
        return {
          title: "Institutional Report",
          description: "Comprehensive institutional performance metrics"
        };
    }
  };

  return (
    <div className="reports-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Institution Reports</h1>
          <p className="page-subtitle">Generate and analyze comprehensive institutional reports</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
          <button className="btn-secondary" onClick={handleEmailReport}>
            <Mail size={18} />
            Email
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-types">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            className={`report-type-btn ${selectedReport === type.id ? 'active' : ''}`}
            onClick={() => setSelectedReport(type.id)}
            style={{ borderColor: selectedReport === type.id ? type.color : 'transparent' }}
          >
            <span style={{ color: type.color }}>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          Filters
          <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
        </button>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-range">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="date-input"
                />
                <span>to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="date-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <label>Format</label>
              <select 
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="format-select"
              >
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV File</option>
                <option value="json">JSON Data</option>
              </select>
            </div>

            <button 
              className="generate-btn"
              onClick={handleGenerateReport}
              disabled={generatingReport}
            >
              {generatingReport ? (
                <>
                  <div className="spinner-small"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Generate Report
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: stat.color }}>
            <div className="stat-header">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <span className="stat-change positive">{stat.change}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="reports-content">
        {/* Report Summary */}
        <div className="report-summary">
          <h2>{getReportSummary().title}</h2>
          <p>{getReportSummary().description}</p>
          <div className="report-meta">
            <span>
              <Calendar size={14} />
              Generated: {new Date().toLocaleDateString()}
            </span>
            <span>
              <FileText size={14} />
              Report Type: {selectedReport.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Academic Metrics */}
        {selectedReport === "academic" && (
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-header">
                <TrendingUp size={20} />
                <h3>Enrollment Rate</h3>
              </div>
              <div className="metric-value">{academicData.enrollmentRate}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${academicData.enrollmentRate}%`, background: "#667eea" }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <Award size={20} />
                <h3>Graduation Rate</h3>
              </div>
              <div className="metric-value">{academicData.graduationRate}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${academicData.graduationRate}%`, background: "#48bb78" }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <UserCheck size={20} />
                <h3>Retention Rate</h3>
              </div>
              <div className="metric-value">{academicData.retentionRate}%</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${academicData.retentionRate}%`, background: "#ed8936" }}
                />
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <GraduationCap size={20} />
                <h3>Average GPA</h3>
              </div>
              <div className="metric-value">{academicData.averageGPA}</div>
              <div className="gpa-rating">
                <span>Excellent</span>
              </div>
            </div>
          </div>
        )}

        {/* Department Performance Table */}
        <div className="data-table-container">
          <div className="table-header">
            <h3>Department Performance Analysis</h3>
            <button className="view-details">View Details</button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Total Students</th>
                <th>Pass Rate</th>
                <th>Performance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {academicData.departments.map((dept, idx) => (
                <tr key={idx}>
                  <td className="dept-name">{dept.name}</td>
                  <td>{dept.students}</td>
                  <td>{dept.passRate}%</td>
                  <td>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill"
                        style={{ width: `${dept.passRate}%` }}
                      />
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${dept.passRate >= 90 ? 'success' : dept.passRate >= 80 ? 'warning' : 'danger'}`}>
                      {dept.passRate >= 90 ? 'Excellent' : dept.passRate >= 80 ? 'Good' : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Semester Trends */}
        <div className="trends-section">
          <h3>Semester Enrollment Trends</h3>
          <div className="trends-chart">
            {academicData.semesterData.map((sem, idx) => (
              <div key={idx} className="trend-item">
                <div className="trend-label">{sem.semester}</div>
                <div className="trend-bars">
                  <div className="trend-bar enrollment">
                    <div 
                      className="bar-fill"
                      style={{ width: `${(sem.enrollment / 4000) * 100}%` }}
                    >
                      <span>{sem.enrollment}</span>
                    </div>
                    <span className="bar-label">Enrollment</span>
                  </div>
                  <div className="trend-bar graduation">
                    <div 
                      className="bar-fill"
                      style={{ width: `${(sem.graduation / 600) * 100}%` }}
                    >
                      <span>{sem.graduation}</span>
                    </div>
                    <span className="bar-label">Graduation</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-card" onClick={() => setSelectedReport("student")}>
              <Users size={24} />
              <span>Student Report</span>
            </button>
            <button className="action-card" onClick={() => setSelectedReport("department")}>
              <Building2 size={24} />
              <span>Department Report</span>
            </button>
            <button className="action-card" onClick={() => setSelectedReport("staff")}>
              <UserCheck size={24} />
              <span>Staff Report</span>
            </button>
            <button className="action-card" onClick={handleGenerateReport}>
              <Download size={24} />
              <span>Export All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading report data...</p>
        </div>
      )}
    </div>
  );
};

export default Reports;