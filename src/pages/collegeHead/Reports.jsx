import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Users,
  Building2,
  Calendar,
  Filter,
  Printer,
  Mail,
  ChevronDown,
  UserCheck
} from "lucide-react";

import api from "../../api/axios";
import "./Reports.css";

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState("academic");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [stats, setStats] =
  useState({
    totalStudents: 0,
    activeStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalDepartmentHeads: 0,
  });

 

const [departmentSummary,
setDepartmentSummary] =
  useState([]);

  // Report types
 const reportTypes = [
  {
    id: "student",
    label: "Student Report",
    icon: <Users size={18} />,
    color: "#48bb78",
  },
  {
    id: "department",
    label: "Department Report",
    icon: <Building2 size={18} />,
    color: "#ed8936",
  },
  {
    id: "staff",
    label: "Staff Report",
    icon: <UserCheck size={18} />,
    color: "#4299e1",
  },
];

 useEffect(() => {

  fetchReportData();

  const interval =
    setInterval(
      fetchReportData,
      60000
    );

  return () =>
    clearInterval(interval);

}, []);

  const fetchReportData = async () => {
  try {
    setLoading(true);

    const response =
      await api.get(
        "/reports/college-head"
      );

    setStats(
      response.data.stats
    );

    setDepartmentSummary(
      response.data.departmentSummary
    );

  } catch (error) {
  console.error(
    "Failed to load reports:",
    error
  );

  alert(
    "Failed to load report data"
  );
} finally {
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
        setTimeout(() => {
    window.print();
}, 300);
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
    const headers = [
  "Report Type",
  "Metric",
  "Value"
];
    const data = [
  [
    selectedReport,
    "Total Students",
    stats?.totalStudents || 0,
  ],

  [
    selectedReport,
    "Total Teachers",
    stats?.totalTeachers || 0,
  ],

  [
    selectedReport,
    "Total Courses",
    stats?.totalCourses || 0,
  ],

  [
    selectedReport,
    "Total Departments",
    stats?.totalDepartments || 0,
  ],
];
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    downloadFile(csvContent, `report_${selectedReport}_${Date.now()}.xls`, "application/vnd.ms-excel");
  };

  const exportToCSV = () => {
    const headers = [
  "Metric",
  "Value"
];
    const data = [
  ["Students", stats?.totalStudents || 0],
  ["Teachers", stats?.totalTeachers || 0],
  ["Courses", stats?.totalCourses || 0],
  ["Departments", stats?.totalDepartments || 0],
  ["Department Heads", stats?.totalDepartmentHeads || 0],
];
    
    const csvContent = [headers, ...data].map(row => row.join(",")).join("\n");
    downloadFile(csvContent, `report_${selectedReport}_${Date.now()}.csv`, "text/csv");
  };

  const exportToJSON = () => {
  const jsonData = {
    reportType: selectedReport,
    generatedAt: new Date().toISOString(),

    stats,

    departmentSummary,
  };

  const jsonString =
    JSON.stringify(
      jsonData,
      null,
      2
    );

  downloadFile(
    jsonString,
    `report_${selectedReport}_${Date.now()}.json`,
    "application/json"
  );
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

  const getReportSummary = () => {
    switch(selectedReport) {
      case "academic":
        return {
          title: "Academic Performance Summary"
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
          <button
  className="upload-btnn"
  onClick={fetchReportData}
>
  Refresh
</button>
          <button className="upload-btnn" onClick={handlePrint}>
            <Printer size={18} />
            Print
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="report-types">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            className={`upload-btnn ${selectedReport === type.id ? 'active' : ''}`}
            onClick={() => setSelectedReport(type.id)}
            style={{ borderColor: selectedReport === type.id ? type.color : 'transparent' }}
          >
            <span style={{ color: type.color }}>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">

  <div className="stat-card">
    <h2>{stats?.totalStudents || 0}</h2>
    <p>Students</p>
  </div>

  <div className="stat-card">
    <h2>{stats?.totalTeachers || 0}</h2>
    <p>Teachers</p>
  </div>

  <div className="stat-card">
    <h2>{stats?.totalCourses || 0}</h2>
    <p>Courses</p>
  </div>

  <div className="stat-card">
    <h2>{stats?.totalDepartments || 0}</h2>
    <p>Departments</p>
  </div>

  <div className="stat-card">
    <h2>{stats?.totalDepartmentHeads || 0}</h2>
    <p>Department Heads</p>
  </div>
  <div className="stat-card">
  <h2>
    {stats?.activeStudents || 0}
  </h2>

  <p>
    Active Students
  </p>
</div>
</div>

      {/* Main Content */}
      <div className="reports-content print-report">
        {/* Report Summary */}
        <div className="report-summary">
          {loading && (
  <div className="refresh-status">
    Refreshing report...
  </div>
)}
          
          <h2>{getReportSummary().title}</h2>
          <p>{getReportSummary().description}</p>
          <div className="report-meta">
            <span>
  Last Updated:
  {" "}
  {new Date().toLocaleTimeString()}
</span>
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
    <th>Code</th>
    <th>Head</th>
    <th>Students</th>
    <th>Teachers</th>
    <th>Courses</th>
  </tr>
</thead>
            <tbody>
               {departmentSummary.length === 0 ? (
    <tr>
      <td colSpan="6">
        No departments found
      </td>
    </tr>
  ) : (departmentSummary.map((dept) => (
    <tr key={dept._id}>
      <td>{dept.name}</td>
      <td>{dept.code}</td>

      <td>
        {dept.departmentHead?.name ||
          "Not Assigned"}
      </td>

      <td>{dept.students}</td>
      <td>{dept.teachers}</td>
      <td>{dept.courses}</td>
    </tr>
  )))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;