import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import {
  FileText,
  Download,
  Calendar,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  PieChart,
  BarChart3,
  Activity,
  Printer,
  Mail,
  Filter,
  ChevronDown,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
} from "lucide-react";
import "./Report.css";

// Department constant
const DEPARTMENT_ID = "CS_DEPT";

// Mock data
const teachersData = [
  { id: "T101", name: "Dr. Abebe Kebede", email: "abebe.k@dept.edu", department: "CS_DEPT", status: "present", attendanceRate: 94, courses: 3, rating: 4.8 },
  { id: "T102", name: "Prof. Tigist Haile", email: "tigist.h@dept.edu", department: "CS_DEPT", status: "absent", attendanceRate: 87, courses: 2, rating: 4.6 },
  { id: "T103", name: "Mr. Samuel Girma", email: "samuel.g@dept.edu", department: "CS_DEPT", status: "late", attendanceRate: 91, courses: 4, rating: 4.7 },
  { id: "T104", name: "Dr. Eden Mekonnen", email: "eden.m@dept.edu", department: "CS_DEPT", status: "present", attendanceRate: 96, courses: 3, rating: 4.9 },
];

const studentsData = [
  { id: "S001", name: "Meron Assefa", year: "Year 2, Sem 1", department: "CS_DEPT", status: "present", attendanceRate: 92, gpa: 3.8 },
  { id: "S002", name: "Dawit Tesfaye", year: "Year 1, Sem 2", department: "CS_DEPT", status: "absent", attendanceRate: 78, gpa: 3.2 },
  { id: "S003", name: "Hanna Belay", year: "Year 3, Sem 1", department: "CS_DEPT", status: "late", attendanceRate: 85, gpa: 3.5 },
  { id: "S004", name: "Nahom Alemu", year: "Year 2, Sem 2", department: "CS_DEPT", status: "present", attendanceRate: 95, gpa: 3.9 },
  { id: "S005", name: "Selam Gebre", year: "Year 1, Sem 1", department: "CS_DEPT", status: "absent", attendanceRate: 72, gpa: 2.9 },
  { id: "S006", name: "Biruk Wondimu", year: "Year 4, Sem 1", department: "CS_DEPT", status: "present", attendanceRate: 98, gpa: 4.0 },
  { id: "S007", name: "Bethlehem Alemu", year: "Year 3, Sem 2", department: "CS_DEPT", status: "present", attendanceRate: 90, gpa: 3.7 },
  { id: "S008", name: "Yonas Desta", year: "Year 2, Sem 1", department: "CS_DEPT", status: "late", attendanceRate: 82, gpa: 3.3 },
];

const coursesData = [
  { id: "CS101", name: "Introduction to Programming", teacher: "Dr. Abebe Kebede", students: 45, avgAttendance: 88, avgGrade: 78 },
  { id: "CS201", name: "Data Structures", teacher: "Prof. Tigist Haile", students: 38, avgAttendance: 85, avgGrade: 75 },
  { id: "CS301", name: "Database Systems", teacher: "Mr. Samuel Girma", students: 42, avgAttendance: 90, avgGrade: 82 },
  { id: "CS401", name: "Software Engineering", teacher: "Dr. Eden Mekonnen", students: 36, avgAttendance: 92, avgGrade: 85 },
];

const attendanceHistory = [
  { week: "Week 1", teachers: 92, students: 88 },
  { week: "Week 2", teachers: 90, students: 86 },
  { week: "Week 3", teachers: 94, students: 90 },
  { week: "Week 4", teachers: 88, students: 85 },
  { week: "Week 5", teachers: 91, students: 89 },
  { week: "Week 6", teachers: 93, students: 91 },
  { week: "Week 7", teachers: 89, students: 87 },
  { week: "Week 8", teachers: 92, students: 90 },
];

const DepartmentReport = () => {
  const [reportType, setReportType] = useState("overall");
  const [dateRange, setDateRange] = useState("month");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Calculate statistics
  const totalTeachers = teachersData.length;
  const totalStudents = studentsData.length;
  const totalCourses = coursesData.length;
  
  const avgTeacherAttendance = (teachersData.reduce((sum, t) => sum + t.attendanceRate, 0) / totalTeachers).toFixed(1);
  const avgStudentAttendance = (studentsData.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents).toFixed(1);
  const avgGPA = (studentsData.reduce((sum, s) => sum + s.gpa, 0) / totalStudents).toFixed(2);
  
  const presentToday = studentsData.filter(s => s.status === "present").length;
  const absentToday = studentsData.filter(s => s.status === "absent").length;
  const lateToday = studentsData.filter(s => s.status === "late").length;

  const highPerformers = studentsData.filter(s => s.gpa >= 3.5).length;
  const atRiskStudents = studentsData.filter(s => s.gpa < 3.0).length;

  // Generate report function
  const generateReport = () => {
    setGeneratingReport(true);
    setTimeout(() => {
      const report = {
        id: Date.now(),
        type: reportType,
        date: new Date().toLocaleDateString(),
        dateRange: dateRange,
        generatedBy: "Department Head",
        data: {
          totalTeachers,
          totalStudents,
          totalCourses,
          avgTeacherAttendance,
          avgStudentAttendance,
          avgGPA,
          presentToday,
          absentToday,
          lateToday,
          highPerformers,
          atRiskStudents,
          teachers: teachersData,
          students: studentsData,
          courses: coursesData,
          attendanceHistory,
        },
      };
      setSelectedReport(report);
      setGeneratingReport(false);
    }, 1500);
  };

  // Export functions
  const exportAsPDF = () => {
    alert("PDF export functionality would be implemented here.\nThis would generate a professional PDF report.");
  };

  const exportAsExcel = () => {
    alert("Excel export functionality would be implemented here.\nThis would export all data to an Excel spreadsheet.");
  };

  const exportAsCSV = () => {
    alert("CSV export functionality would be implemented here.\nThis would export data as CSV for further analysis.");
  };

  const sendEmail = () => {
    alert("Email report functionality would be implemented here.\nThis would send the report to stakeholders.");
  };

  const printReport = () => {
    window.print();
  };

  // Report type cards data
  const reportTypes = [
    { id: "overall", name: "Overall Summary", icon: FileText, description: "Complete department overview", color: "primary" },
    { id: "attendance", name: "Attendance Report", icon: Calendar, description: "Daily/Monthly attendance trends", color: "success" },
    { id: "academic", name: "Academic Performance", icon: GraduationCap, description: "GPA and grade analysis", color: "warning" },
    { id: "teachers", name: "Teachers Report", icon: Users, description: "Faculty performance metrics", color: "info" },
    { id: "courses", name: "Course Analysis", icon: BookOpen, description: "Course enrollment and grades", color: "primary" },
  ];

  return (
          <div className="report-container">
            {/* Header */}
            <div className="report-header">
              <div>
                <h1>Reports & Analytics</h1>
                <p>Generate and export comprehensive department reports</p>
              </div>
              <div className="report-actions">
                <button className="action-btn secondary" onClick={printReport}>
                  <Printer size={18} />
                  Print
                </button>
                <button className="action-btn secondary" onClick={sendEmail}>
                  <Mail size={18} />
                  Email
                </button>
                <div className="export-dropdown">
                  <button 
                    className="action-btn primary"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                  >
                    <Download size={18} />
                    Export
                    <ChevronDown size={16} />
                  </button>
                  {showExportMenu && (
                    <div className="export-menu">
                      <button onClick={exportAsPDF}>
                        <FileText size={16} /> Export as PDF
                      </button>
                      <button onClick={exportAsExcel}>
                        <FileText size={16} /> Export as Excel
                      </button>
                      <button onClick={exportAsCSV}>
                        <FileText size={16} /> Export as CSV
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Report Type Selection */}
            <div className="report-types-grid">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className={`report-type-card ${reportType === type.id ? "active" : ""}`}
                    onClick={() => setReportType(type.id)}
                  >
                    <div className={`report-type-icon ${type.color}`}>
                      <Icon size={24} />
                    </div>
                    <div className="report-type-info">
                      <h3>{type.name}</h3>
                      <p>{type.description}</p>
                    </div>
                    {reportType === type.id && <div className="active-indicator" />}
                  </div>
                );
              })}
            </div>

            {/* Filters Section */}
            <div className="filters-card">
              <div className="filters-header">
                <Filter size={18} />
                <h3>Report Filters</h3>
              </div>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Date Range</label>
                  <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                    <option value="week">Last 7 Days</option>
                    <option value="month">This Month</option>
                    <option value="semester">This Semester</option>
                    <option value="year">Academic Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Teacher (Optional)</label>
                  <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                    <option value="all">All Teachers</option>
                    {teachersData.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Course (Optional)</label>
                  <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                    <option value="all">All Courses</option>
                    {coursesData.map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <button 
                    className="generate-btn"
                    onClick={generateReport}
                    disabled={generatingReport}
                  >
                    {generatingReport ? (
                      <>Generating...</>
                    ) : (
                      <>Generate Report</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Report Display */}
            {generatingReport && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Generating your report...</p>
              </div>
            )}

            {selectedReport && !generatingReport && (
              <div className="generated-report">
                {/* Report Header */}
                <div className="report-content-header">
                  <div>
                    <h2>Department Report - {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}</h2>
                    <p>Generated on {selectedReport.date} | Range: {selectedReport.dateRange}</p>
                  </div>
                  <div className="report-badge">
                    <FileText size={16} />
                    {reportTypes.find(t => t.id === selectedReport.type)?.name}
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-icon blue">
                      <Users size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedReport.data.totalTeachers}</span>
                      <span className="metric-label">Total Teachers</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon green">
                      <GraduationCap size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedReport.data.totalStudents}</span>
                      <span className="metric-label">Total Students</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon orange">
                      <BookOpen size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedReport.data.totalCourses}</span>
                      <span className="metric-label">Active Courses</span>
                    </div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-icon purple">
                      <TrendingUp size={20} />
                    </div>
                    <div className="metric-info">
                      <span className="metric-value">{selectedReport.data.avgGPA}</span>
                      <span className="metric-label">Average GPA</span>
                    </div>
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="report-section">
                  <h3>Attendance Summary</h3>
                  <div className="attendance-summary">
                    <div className="attendance-stat present">
                      <CheckCircle size={24} />
                      <div>
                        <div className="stat-number">{selectedReport.data.presentToday}</div>
                        <div className="stat-label">Present Today</div>
                      </div>
                    </div>
                    <div className="attendance-stat absent">
                      <XCircle size={24} />
                      <div>
                        <div className="stat-number">{selectedReport.data.absentToday}</div>
                        <div className="stat-label">Absent Today</div>
                      </div>
                    </div>
                    <div className="attendance-stat late">
                      <Clock size={24} />
                      <div>
                        <div className="stat-number">{selectedReport.data.lateToday}</div>
                        <div className="stat-label">Late Today</div>
                      </div>
                    </div>
                    <div className="attendance-stat average">
                      <Activity size={24} />
                      <div>
                        <div className="stat-number">{selectedReport.data.avgStudentAttendance}%</div>
                        <div className="stat-label">Average Attendance</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Trend Chart */}
                <div className="report-section">
                  <h3>Attendance Trend (Last 8 Weeks)</h3>
                  <div className="trend-chart">
                    {selectedReport.data.attendanceHistory.map((week, index) => (
                      <div key={index} className="trend-bar-group">
                        <div className="trend-bars">
                          <div 
                            className="trend-bar teachers-bar"
                            style={{ height: `${week.teachers}%` }}
                            title={`Teachers: ${week.teachers}%`}
                          />
                          <div 
                            className="trend-bar students-bar"
                            style={{ height: `${week.students}%` }}
                            title={`Students: ${week.students}%`}
                          />
                        </div>
                        <div className="trend-label">{week.week}</div>
                      </div>
                    ))}
                  </div>
                  <div className="trend-legend">
                    <span><div className="legend-dot teachers"></div> Teachers</span>
                    <span><div className="legend-dot students"></div> Students</span>
                  </div>
                </div>

                {/* Teachers Performance Table */}
                <div className="report-section">
                  <h3>Teachers Performance</h3>
                  <div className="report-table-wrapper">
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Teacher Name</th>
                          <th>Email</th>
                          <th>Courses</th>
                          <th>Attendance Rate</th>
                          <th>Rating</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.data.teachers.map((teacher) => (
                          <tr key={teacher.id}>
                            <td><strong>{teacher.name}</strong></td>
                            <td>{teacher.email}</td>
                            <td>{teacher.courses}</td>
                            <td>
                              <div className="table-progress">
                                <span>{teacher.attendanceRate}%</span>
                                <div className="progress-bar">
                                  <div className="progress-fill" style={{ width: `${teacher.attendanceRate}%` }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="rating">
                                <span className="rating-value">{teacher.rating}</span>
                                <span className="rating-max">/5.0</span>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge-sm ${teacher.status}`}>
                                {teacher.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Students Performance Table */}
                <div className="report-section">
                  <h3>Students Performance</h3>
                  <div className="report-table-wrapper">
                    <table className="report-table">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>ID</th>
                          <th>Year</th>
                          <th>Attendance</th>
                          <th>GPA</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.data.students.map((student) => (
                          <tr key={student.id}>
                            <td><strong>{student.name}</strong></td>
                            <td>{student.id}</td>
                            <td>{student.year}</td>
                            <td>
                              <div className="table-progress">
                                <span>{student.attendanceRate}%</span>
                                <div className="progress-bar">
                                  <div className="progress-fill" style={{ width: `${student.attendanceRate}%` }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="gpa">
                                <span className="gpa-value">{student.gpa}</span>
                                <span className="gpa-max">/4.0</span>
                              </div>
                            </td>
                            <td>
                              <span className={`performance-badge-sm ${student.gpa >= 3.5 ? "excellent" : student.gpa >= 3.0 ? "good" : "at-risk"}`}>
                                {student.gpa >= 3.5 ? "Excellent" : student.gpa >= 3.0 ? "Good" : "At Risk"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Course Analysis */}
                <div className="report-section">
                  <h3>Course Analysis</h3>
                  <div className="courses-grid-report">
                    {selectedReport.data.courses.map((course) => (
                      <div key={course.id} className="course-card-report">
                        <div className="course-header">
                          <span className="course-code">{course.id}</span>
                          <span className="course-name">{course.name}</span>
                        </div>
                        <div className="course-details">
                          <div className="course-detail">
                            <span className="detail-label">Teacher:</span>
                            <span className="detail-value">{course.teacher}</span>
                          </div>
                          <div className="course-detail">
                            <span className="detail-label">Students:</span>
                            <span className="detail-value">{course.students}</span>
                          </div>
                          <div className="course-detail">
                            <span className="detail-label">Avg Attendance:</span>
                            <span className="detail-value">{course.avgAttendance}%</span>
                          </div>
                          <div className="course-detail">
                            <span className="detail-label">Avg Grade:</span>
                            <span className="detail-value">{course.avgGrade}%</span>
                          </div>
                        </div>
                        <div className="course-progress">
                          <div className="progress-label">Grade Distribution</div>
                          <div className="progress-bar large">
                            <div className="progress-fill grade" style={{ width: `${course.avgGrade}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Insights */}
                <div className="insights-section">
                  <h3>
                    <Award size={18} />
                    Key Insights & Recommendations
                  </h3>
                  <div className="insights-list">
                    <div className="insight">
                      <AlertCircle size={16} className="insight-icon info" />
                      <p>Student attendance is at {selectedReport.data.avgStudentAttendance}% - {selectedReport.data.avgStudentAttendance < 85 ? "Needs improvement" : "On track"}</p>
                    </div>
                    <div className="insight">
                      <AlertCircle size={16} className="insight-icon success" />
                      <p>{selectedReport.data.highPerformers} students are performing excellently (GPA ≥ 3.5)</p>
                    </div>
                    <div className="insight">
                      <AlertCircle size={16} className="insight-icon warning" />
                      <p>{selectedReport.data.atRiskStudents} students are at risk and need academic support</p>
                    </div>
                    <div className="insight">
                      <AlertCircle size={16} className="insight-icon primary" />
                      <p>Teacher attendance rate is {selectedReport.data.avgTeacherAttendance}% - Excellent!</p>
                    </div>
                  </div>
                </div>

                {/* Report Footer */}
                <div className="report-footer">
                  <p>This report was generated automatically by the Department Management System.</p>
                  <p>For any discrepancies, please contact the department administrator.</p>
                </div>
              </div>
            )}

            {/* No Report State */}
            {!selectedReport && !generatingReport && (
              <div className="empty-report-state">
                <FileText size={64} />
                <h3>No Report Generated Yet</h3>
                <p>Select report type, apply filters, and click "Generate Report" to view data</p>
              </div>
            )}
          </div>
  );
};

export default DepartmentReport;