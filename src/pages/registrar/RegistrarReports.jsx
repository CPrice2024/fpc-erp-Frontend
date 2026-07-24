import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  ArrowLeft,
  Download,
  Printer,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from "lucide-react";
import "./Reports.css";

export default function RegistrarReports() {
  const navigate = useNavigate();
  
  // ===== STATES =====
  const [loading, setLoading] = useState(false);
  const [activeReport, setActiveReport] = useState("students"); // students, finance
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  
  // ===== STUDENT REPORT STATES =====
  const [studentStats, setStudentStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byDepartment: {},
    byLevel: {},
    byGender: { male: 0, female: 0 },
    newThisMonth: 0,
    newThisYear: 0,
  });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState({
    department: "",
    level: "",
    status: "all",
  });
  const [departments, setDepartments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentDetail, setShowStudentDetail] = useState(false);
  
  // ===== FINANCE REPORT STATES =====
  const [financeStats, setFinanceStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    paidStudents: 0,
    fundedStudents: 0,
    pendingPayments: 0,
    byPaymentMethod: {},
    byPaymentType: {},
    monthlyData: {},
    dailyData: {},
  });
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentSearch, setPaymentSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState({
    method: "all",
    type: "all",
    status: "all",
  });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);

  // ===== FETCH DATA =====
  useEffect(() => {
    if (activeReport === "students") {
      fetchStudentData();
    } else {
      fetchFinanceData();
    }
  }, [activeReport, dateRange]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // Fetch all students
      const studentsRes = await api.get("/registrars/students");
      const studentData = studentsRes.data || [];
      setStudents(studentData);
      
      // Fetch departments
      const deptRes = await api.get("/registrars/departments");
      setDepartments(deptRes.data || []);
      
      // Calculate statistics
      calculateStudentStats(studentData);
      setFilteredStudents(studentData);
    } catch (error) {
      console.error("Error fetching student data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const paymentsRes = await api.get("/finance");
      const paymentData = paymentsRes.data || [];
      setPayments(paymentData);
      
      // Calculate finance statistics
      calculateFinanceStats(paymentData);
      setFilteredPayments(paymentData);
    } catch (error) {
      console.error("Error fetching finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===== CALCULATE STUDENT STATISTICS =====
  const calculateStudentStats = (data) => {
    const total = data.length;
    const active = data.filter(s => s.status === "active").length;
    const inactive = total - active;
    
    // By Department
    const byDepartment = {};
    data.forEach(s => {
      const dept = s.department?.name || "N/A";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });
    
    // By Level
    const byLevel = {};
    data.forEach(s => {
      const level = s.level || "N/A";
      byLevel[level] = (byLevel[level] || 0) + 1;
    });
    
    // By Gender
    const byGender = { male: 0, female: 0 };
    data.forEach(s => {
      if (s.gender?.toLowerCase() === "male") byGender.male++;
      else if (s.gender?.toLowerCase() === "female") byGender.female++;
    });
    
    // New this month
    const now = new Date();
    const thisMonth = data.filter(s => {
      const created = new Date(s.createdAt);
      return created.getMonth() === now.getMonth() && 
             created.getFullYear() === now.getFullYear();
    }).length;
    
    // New this year
    const thisYear = data.filter(s => {
      const created = new Date(s.createdAt);
      return created.getFullYear() === now.getFullYear();
    }).length;
    
    setStudentStats({
      total,
      active,
      inactive,
      byDepartment,
      byLevel,
      byGender,
      newThisMonth: thisMonth,
      newThisYear: thisYear,
    });
  };

  // ===== CALCULATE FINANCE STATISTICS =====
  const calculateFinanceStats = (data) => {
    const totalRevenue = data.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPayments = data.length;
    const paidStudents = data.filter(p => p.paymentType === "Paid").length;
    const fundedStudents = data.filter(p => p.paymentType === "Funded").length;
    const pendingPayments = data.filter(p => p.status === "pending").length;
    
    // By Payment Method
    const byPaymentMethod = {};
    data.forEach(p => {
      const method = p.paymentMethod || "N/A";
      byPaymentMethod[method] = (byPaymentMethod[method] || 0) + 1;
    });
    
    // By Payment Type
    const byPaymentType = {};
    data.forEach(p => {
      const type = p.paymentType || "N/A";
      byPaymentType[type] = (byPaymentType[type] || 0) + 1;
    });
    
    // Monthly Data
    const monthlyData = {};
    data.forEach(p => {
      const date = new Date(p.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyData[key]) monthlyData[key] = 0;
      monthlyData[key] += p.amount || 0;
    });
    
    // Daily Data (last 30 days)
    const dailyData = {};
    const now = new Date();
    data.forEach(p => {
      const date = new Date(p.createdAt);
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      if (diffDays <= 30) {
        const key = date.toISOString().split('T')[0];
        if (!dailyData[key]) dailyData[key] = 0;
        dailyData[key] += p.amount || 0;
      }
    });
    
    setFinanceStats({
      totalRevenue,
      totalPayments,
      paidStudents,
      fundedStudents,
      pendingPayments,
      byPaymentMethod,
      byPaymentType,
      monthlyData,
      dailyData,
    });
  };

  // ===== FILTER STUDENTS =====
  useEffect(() => {
    let filtered = [...students];
    
    if (studentSearch) {
      const search = studentSearch.toLowerCase();
      filtered = filtered.filter(s =>
        s.studentId?.toLowerCase().includes(search) ||
        s.firstName?.toLowerCase().includes(search) ||
        s.fatherName?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search)
      );
    }
    
    if (studentFilter.department) {
      filtered = filtered.filter(s => {
        const deptId = typeof s.department === "object" ? s.department?._id : s.department;
        return deptId === studentFilter.department;
      });
    }
    
    if (studentFilter.level) {
      filtered = filtered.filter(s => s.level === studentFilter.level);
    }
    
    if (studentFilter.status === "active") {
      filtered = filtered.filter(s => s.status === "active");
    } else if (studentFilter.status === "inactive") {
      filtered = filtered.filter(s => s.status !== "active");
    }
    
    setFilteredStudents(filtered);
  }, [students, studentSearch, studentFilter]);

  // ===== FILTER PAYMENTS =====
  useEffect(() => {
    let filtered = [...payments];
    
    if (paymentSearch) {
      const search = paymentSearch.toLowerCase();
      filtered = filtered.filter(p =>
        p.receiptNumber?.toLowerCase().includes(search) ||
        p.student?.firstName?.toLowerCase().includes(search) ||
        p.student?.studentId?.toLowerCase().includes(search) ||
        p.transactionId?.toLowerCase().includes(search)
      );
    }
    
    if (paymentFilter.method !== "all") {
      filtered = filtered.filter(p => p.paymentMethod === paymentFilter.method);
    }
    
    if (paymentFilter.type !== "all") {
      filtered = filtered.filter(p => p.paymentType === paymentFilter.type);
    }
    
    if (paymentFilter.status !== "all") {
      filtered = filtered.filter(p => p.status === paymentFilter.status);
    }
    
    setFilteredPayments(filtered);
  }, [payments, paymentSearch, paymentFilter]);

  // ===== HELPER FUNCTIONS =====
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "active" || status === "paid") {
      return { icon: CheckCircle, class: "status-active", label: "Active" };
    } else if (status === "pending") {
      return { icon: Clock, class: "status-pending", label: "Pending" };
    } else {
      return { icon: XCircle, class: "status-inactive", label: "Inactive" };
    }
  };

  const getPaymentTypeBadge = (type) => {
    if (type === "Paid") {
      return { class: "type-paid", label: "Paid" };
    } else if (type === "Funded") {
      return { class: "type-funded", label: "Funded" };
    }
    return { class: "type-other", label: type || "N/A" };
  };

  // ===== EXPORT FUNCTIONS =====
  const exportStudentReport = () => {
    const headers = ["#", "Student ID", "Name", "Department", "Level", "Status", "Email", "Phone"];
    const rows = filteredStudents.map((s, i) => [
      i + 1,
      s.studentId,
      `${s.firstName} ${s.fatherName}`,
      s.department?.name || "N/A",
      s.level || "N/A",
      s.status || "N/A",
      s.email || "N/A",
      s.phone || "N/A",
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    downloadCSV(csv, `student-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportFinanceReport = () => {
    const headers = ["#", "Receipt", "Student", "Amount", "Type", "Method", "Status", "Date"];
    const rows = filteredPayments.map((p, i) => [
      i + 1,
      p.receiptNumber || "N/A",
      `${p.student?.firstName || "N/A"} ${p.student?.fatherName || ""}`,
      p.amount || 0,
      p.paymentType || "N/A",
      p.paymentMethod || "N/A",
      p.status || "N/A",
      formatDate(p.createdAt),
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    downloadCSV(csv, `finance-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: "text/csv" });
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

  // ===== VIEW STUDENT DETAIL =====
  const viewStudentDetail = (student) => {
    setSelectedStudent(student);
    setShowStudentDetail(true);
  };

  const viewPaymentDetail = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetail(true);
  };

  // ===== RENDER =====
  return (
    <div className="reports-page">
      {/* ===== HEADER ===== */}
      <header className="reports-header">
        <div className="header-left">
          <button className="btn-back" onClick={() => navigate("/registrar")}>
            <ArrowLeft size={20} />
            Back
          </button>
          <div className="header-divider"></div>
          <div className="header-title">
            <div>
              <h1>Report</h1>
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

      {/* ===== REPORT TYPE TABS ===== */}
      <div className="report-tabs">
        <button
          className={`tab-btn ${activeReport === "students" ? "active" : ""}`}
          onClick={() => setActiveReport("students")}
        >
          <Users size={18} />
          Student Report
          <span className="tab-badge">{studentStats.total}</span>
        </button>
        <button
          className={`tab-btn ${activeReport === "finance" ? "active" : ""}`}
          onClick={() => setActiveReport("finance")}
        >
          <DollarSign size={18} />
          Finance Report
          <span className="tab-badge">{formatCurrency(financeStats.totalRevenue)}</span>
        </button>
      </div>

      {/* ===== DATE RANGE FILTER ===== */}
      <div className="date-range-filter">
        <div className="filter-group">
          <label>
            <Calendar size={16} />
            From
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
        </div>
        <div className="filter-group">
          <label>
            <Calendar size={16} />
            To
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/* ===== STUDENT REPORT ===== */}
      {activeReport === "students" && (
        <div className="report-content">
          {/* Student Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-total">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Total Students</span>
                <h3>{studentStats.total}</h3>
              </div>
            </div>
            <div className="stat-card stat-active">
              <div className="stat-icon"><UserCheck size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Active</span>
                <h3>{studentStats.active}</h3>
                <span className="stat-sub">{((studentStats.active / studentStats.total) * 100 || 0).toFixed(1)}%</span>
              </div>
            </div>
            <div className="stat-card stat-inactive">
              <div className="stat-icon"><UserX size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Inactive</span>
                <h3>{studentStats.inactive}</h3>
                <span className="stat-sub">{((studentStats.inactive / studentStats.total) * 100 || 0).toFixed(1)}%</span>
              </div>
            </div>
            <div className="stat-card stat-new">
              <div className="stat-icon"><UserPlus size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">New This Month</span>
                <h3>{studentStats.newThisMonth}</h3>
                <span className="stat-sub">{studentStats.newThisYear} this year</span>
              </div>
            </div>
          </div>

          {/* Student Distribution */}
          <div className="distribution-grid">
            <div className="dist-card">
              <h4>By Department</h4>
              <div className="dist-list">
                {Object.entries(studentStats.byDepartment).map(([name, count]) => (
                  <div key={name} className="dist-item">
                    <span className="dist-label">{name}</span>
                    <div className="dist-bar-wrapper">
                      <div 
                        className="dist-bar" 
                        style={{ width: `${(count / studentStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dist-card">
              <h4>By Level</h4>
              <div className="dist-list">
                {Object.entries(studentStats.byLevel).map(([level, count]) => (
                  <div key={level} className="dist-item">
                    <span className="dist-label">Level {level}</span>
                    <div className="dist-bar-wrapper">
                      <div 
                        className="dist-bar level-bar" 
                        style={{ width: `${(count / studentStats.total) * 100}%` }}
                      ></div>
                    </div>
                    <span className="dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dist-card">
              <h4>By Gender</h4>
              <div className="gender-stats">
                <div className="gender-item">
                  <span className="gender-label">Male</span>
                  <span className="gender-value">{studentStats.byGender.male}</span>
                  <span className="gender-percent">
                    {((studentStats.byGender.male / studentStats.total) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="gender-item">
                  <span className="gender-label">Female</span>
                  <span className="gender-value">{studentStats.byGender.female}</span>
                  <span className="gender-percent">
                    {((studentStats.byGender.female / studentStats.total) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Filters */}
          <div className="report-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={studentFilter.department}
                onChange={(e) => setStudentFilter({ ...studentFilter, department: e.target.value })}
              >
                <option value="">All Departments</option>
                {departments.map(d => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <select
                value={studentFilter.level}
                onChange={(e) => setStudentFilter({ ...studentFilter, level: e.target.value })}
              >
                <option value="">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={studentFilter.status}
                onChange={(e) => setStudentFilter({ ...studentFilter, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button className="btn-export-csv" onClick={exportStudentReport}>
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Student Table */}
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <Users size={40} />
                      <p>No students found</p>
                      <span>Try adjusting your filters</span>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => {
                    const status = getStatusBadge(student.status);
                    const StatusIcon = status.icon;
                    return (
                      <tr key={student._id}>
                        <td>{index + 1}</td>
                        <td><span className="student-id">{student.studentId}</span></td>
                        <td>{student.firstName} {student.fatherName}</td>
                        <td>{student.department?.name || "N/A"}</td>
                        <td>{student.level || "N/A"}</td>
                        <td>
                          <span className={`status-badge ${status.class}`}>
                            <StatusIcon size={14} />
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-btn view-btn"
                            onClick={() => viewStudentDetail(student)}
                          >
                            <Eye size={16} />
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
        </div>
      )}

      {/* ============================================================ */}
      {/* ===== FINANCE REPORT ===== */}
      {activeReport === "finance" && (
        <div className="report-content">
          {/* Finance Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-revenue">
              <div className="stat-icon"><DollarSign size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Total Revenue</span>
                <h3>{formatCurrency(financeStats.totalRevenue)}</h3>
              </div>
            </div>
            <div className="stat-card stat-payments">
              <div className="stat-icon"></div>
              <div className="stat-info">
                <span className="stat-label">Total Payments</span>
                <h3>{financeStats.totalPayments}</h3>
              </div>
            </div>
            <div className="stat-card stat-paid">
              <div className="stat-icon"><TrendingUp size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Paid Students</span>
                <h3>{financeStats.paidStudents}</h3>
                <span className="stat-sub">{((financeStats.paidStudents / (financeStats.paidStudents + financeStats.fundedStudents || 1)) * 100 || 0).toFixed(1)}%</span>
              </div>
            </div>
            <div className="stat-card stat-funded">
              <div className="stat-icon"><Award size={24} /></div>
              <div className="stat-info">
                <span className="stat-label">Funded Students</span>
                <h3>{financeStats.fundedStudents}</h3>
                <span className="stat-sub">{((financeStats.fundedStudents / (financeStats.paidStudents + financeStats.fundedStudents || 1)) * 100 || 0).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Finance Distribution */}
          <div className="distribution-grid">
            <div className="dist-card">
              <h4>By Payment Method</h4>
              <div className="dist-list">
                {Object.entries(financeStats.byPaymentMethod).map(([method, count]) => (
                  <div key={method} className="dist-item">
                    <span className="dist-label">{method}</span>
                    <div className="dist-bar-wrapper">
                      <div 
                        className="dist-bar method-bar" 
                        style={{ width: `${(count / financeStats.totalPayments) * 100}%` }}
                      ></div>
                    </div>
                    <span className="dist-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dist-card">
              <h4>By Payment Type</h4>
              <div className="dist-list">
                {Object.entries(financeStats.byPaymentType).map(([type, count]) => {
                  const badge = getPaymentTypeBadge(type);
                  return (
                    <div key={type} className="dist-item">
                      <span className="dist-label">{type}</span>
                      <div className="dist-bar-wrapper">
                        <div 
                          className={`dist-bar ${badge.class}`} 
                          style={{ width: `${(count / financeStats.totalPayments) * 100}%` }}
                        ></div>
                      </div>
                      <span className="dist-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="dist-card">
              <h4>Monthly Revenue</h4>
              <div className="dist-list">
                {Object.entries(financeStats.monthlyData)
                  .slice(-6)
                  .map(([month, amount]) => (
                    <div key={month} className="dist-item">
                      <span className="dist-label">{month}</span>
                      <div className="dist-bar-wrapper">
                        <div 
                          className="dist-bar revenue-bar" 
                          style={{ 
                            width: `${(amount / Math.max(...Object.values(financeStats.monthlyData)) * 100) || 0}%` 
                          }}
                        ></div>
                      </div>
                      <span className="dist-count">{formatCurrency(amount)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Payment Filters */}
          <div className="report-filters">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search by receipt or student..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <select
                value={paymentFilter.method}
                onChange={(e) => setPaymentFilter({ ...paymentFilter, method: e.target.value })}
              >
                <option value="all">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Telebirr">Telebirr</option>
                <option value="CBE Birr">CBE Birr</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={paymentFilter.type}
                onChange={(e) => setPaymentFilter({ ...paymentFilter, type: e.target.value })}
              >
                <option value="all">All Types</option>
                <option value="Paid">Paid</option>
                <option value="Funded">Funded</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={paymentFilter.status}
                onChange={(e) => setPaymentFilter({ ...paymentFilter, status: e.target.value })}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <button className="btn-export-csv" onClick={exportFinanceReport}>
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Payment Table */}
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Receipt</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <DollarSign size={40} />
                      <p>No payments found</p>
                      <span>Try adjusting your filters</span>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, index) => {
                    const status = getStatusBadge(payment.status);
                    const StatusIcon = status.icon;
                    const typeBadge = getPaymentTypeBadge(payment.paymentType);
                    return (
                      <tr key={payment._id}>
                        <td>{index + 1}</td>
                        <td><span className="receipt-id">{payment.receiptNumber || "N/A"}</span></td>
                        <td>{payment.student?.firstName || "N/A"} {payment.student?.fatherName || ""}</td>
                        <td className="amount-cell">{formatCurrency(payment.amount)}</td>
                        <td>
                          <span className={`type-badge ${typeBadge.class}`}>
                            {typeBadge.label}
                          </span>
                        </td>
                        <td>{payment.paymentMethod || "N/A"}</td>
                        <td>
                          <span className={`status-badge ${status.class}`}>
                            <StatusIcon size={14} />
                            {status.label}
                          </span>
                        </td>
                        <td>
                          <button
                            className="action-btn view-btn"
                            onClick={() => viewPaymentDetail(payment)}
                          >
                            <Eye size={16} />
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
        </div>
      )}

      {/* ============================================================ */}
      {/* ===== STUDENT DETAIL MODAL ===== */}
      {showStudentDetail && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowStudentDetail(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <User size={20} />
                Student Details
              </h2>
              <button className="modal-close" onClick={() => setShowStudentDetail(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Student ID</span>
                  <span className="detail-value">{selectedStudent.studentId}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{selectedStudent.firstName} {selectedStudent.fatherName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{selectedStudent.department?.name || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Level</span>
                  <span className="detail-value">{selectedStudent.level || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{selectedStudent.email || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{selectedStudent.phone || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <span className="detail-value">{selectedStudent.gender || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{selectedStudent.status || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-view-full" 
                onClick={() => {
                  setShowStudentDetail(false);
                  navigate(`/registrar/students/view/${selectedStudent._id}`);
                }}
              >
                <ExternalLink size={16} />
                View Full Profile
              </button>
              <button className="btn-close-modal" onClick={() => setShowStudentDetail(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ===== PAYMENT DETAIL MODAL ===== */}
      {showPaymentDetail && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowPaymentDetail(false)}>
          <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                Payment Details
              </h2>
              <button className="modal-close" onClick={() => setShowPaymentDetail(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Receipt Number</span>
                  <span className="detail-value">{selectedPayment.receiptNumber || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Student</span>
                  <span className="detail-value">{selectedPayment.student?.firstName || "N/A"} {selectedPayment.student?.fatherName || ""}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Amount</span>
                  <span className="detail-value amount">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Type</span>
                  <span className="detail-value">{selectedPayment.paymentType || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">{selectedPayment.paymentMethod || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Transaction ID</span>
                  <span className="detail-value">{selectedPayment.transactionId || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatDate(selectedPayment.createdAt)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{selectedPayment.status || "N/A"}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-view-full" 
                onClick={() => {
                  setShowPaymentDetail(false);
                  navigate(`/registrar/finance`);
                }}
              >
                <ExternalLink size={16} />
                View All Payments
              </button>
              <button className="btn-close-modal" onClick={() => setShowPaymentDetail(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}