import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
  Clock,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  Bell,
  FileText,
  Search,
  RefreshCw,
  UserCircle,
  LayoutDashboard,
  Settings as SettingsIcon,
} from "lucide-react";
import "./RegistrarDashboard.css";

export default function RDashboard() {
  const navigate = useNavigate();
  
  // ===== STATES =====
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    students: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      byDepartment: {},
      byLevel: {},
    },
    finance: {
      totalRevenue: 0,
      totalPayments: 0,
      paidStudents: 0,
      fundedStudents: 0,
      pendingPayments: 0,
      todayRevenue: 0,
      thisMonthRevenue: 0,
    },
    recentActivities: [],
    upcomingDeadlines: [],
    alerts: [],
  });
  
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [selectedChart, setSelectedChart] = useState("students"); // students, finance

  // ===== FETCH DASHBOARD DATA =====
  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      // Fetch students
      const studentsRes = await api.get("/registrars/students");
      const studentData = studentsRes.data || [];
      
      // Fetch departments
      const deptRes = await api.get("/registrars/departments");
      const departments = deptRes.data || [];
      
      // Fetch payments
      const paymentsRes = await api.get("/finance");
      const paymentData = paymentsRes.data || [];
      
      // Calculate student statistics
      const studentStats = calculateStudentStats(studentData);
      
      // Calculate finance statistics
      const financeStats = calculateFinanceStats(paymentData);
      
      // Get recent students (last 5)
      const recent = [...studentData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Get recent payments (last 5)
      const recentPay = [...paymentData]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      // Generate activities
      const activities = generateActivities(studentData, paymentData);
      
      setDashboardData({
        students: studentStats,
        finance: financeStats,
        recentActivities: activities.slice(0, 10),
        upcomingDeadlines: generateDeadlines(),
        alerts: generateAlerts(studentData, paymentData),
      });
      
      setRecentStudents(recent);
      setRecentPayments(recentPay);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ===== CALCULATE STUDENT STATISTICS =====
  const calculateStudentStats = (data) => {
    const total = data.length;
    const active = data.filter(s => s.status === "active").length;
    const inactive = total - active;
    
    const now = new Date();
    const newThisMonth = data.filter(s => {
      const created = new Date(s.createdAt);
      return created.getMonth() === now.getMonth() && 
             created.getFullYear() === now.getFullYear();
    }).length;
    
    const byDepartment = {};
    data.forEach(s => {
      const dept = s.department?.name || "N/A";
      byDepartment[dept] = (byDepartment[dept] || 0) + 1;
    });
    
    const byLevel = {};
    data.forEach(s => {
      const level = s.level || "N/A";
      byLevel[level] = (byLevel[level] || 0) + 1;
    });
    
    return { total, active, inactive, newThisMonth, byDepartment, byLevel };
  };

  // ===== CALCULATE FINANCE STATISTICS =====
  const calculateFinanceStats = (data) => {
    const totalRevenue = data.reduce((sum, p) => sum + (p.amount || 0), 0);
    const totalPayments = data.length;
    const paidStudents = data.filter(p => p.paymentType === "Paid").length;
    const fundedStudents = data.filter(p => p.paymentType === "Funded").length;
    const pendingPayments = data.filter(p => p.status === "pending").length;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayRevenue = data
      .filter(p => {
        const date = new Date(p.createdAt);
        return date >= today;
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    const thisMonthRevenue = data
      .filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === now.getMonth() && 
               date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return { totalRevenue, totalPayments, paidStudents, fundedStudents, pendingPayments, todayRevenue, thisMonthRevenue };
  };

  // ===== GENERATE ACTIVITIES =====
  const generateActivities = (students, payments) => {
    const activities = [];
    
    // Student activities
    students.slice(0, 5).forEach(s => {
      activities.push({
        id: `student-${s._id}`,
        type: "student",
        action: "registered",
        title: `${s.firstName} ${s.fatherName} registered`,
        time: s.createdAt,
        icon: UserPlus,
        color: "#3b82f6",
        link: `/registrar/students/view/${s._id}`,
      });
    });
    
    // Payment activities
    payments.slice(0, 5).forEach(p => {
      activities.push({
        id: `payment-${p._id}`,
        type: "payment",
        action: "payment",
        title: `Payment of ${formatCurrency(p.amount)} from ${p.student?.firstName || 'Student'}`,
        time: p.createdAt,
        icon: DollarSign,
        color: "#22c55e",
        link: `/registrar/finance`,
      });
    });
    
    return activities.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  // ===== GENERATE DEADLINES =====
  const generateDeadlines = () => {
    const now = new Date();
    return [
      {
        id: 1,
        title: "Semester Registration Deadline",
        date: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        type: "registration",
        priority: "high",
      },
      {
        id: 2,
        title: "Fee Payment Deadline",
        date: new Date(now.getFullYear(), now.getMonth() + 1, 30),
        type: "payment",
        priority: "high",
      },
      {
        id: 3,
        title: "Course Add/Drop Period Ends",
        date: new Date(now.getFullYear(), now.getMonth(), 25),
        type: "academic",
        priority: "medium",
      },
      {
        id: 4,
        title: "Midterm Grade Submission",
        date: new Date(now.getFullYear(), now.getMonth() + 2, 10),
        type: "grading",
        priority: "medium",
      },
    ];
  };

  // ===== GENERATE ALERTS =====
  const generateAlerts = (students, payments) => {
    const alerts = [];
    
    // Check pending payments
    const pending = payments.filter(p => p.status === "pending");
    if (pending.length > 0) {
      alerts.push({
        id: 1,
        type: "warning",
        title: `${pending.length} pending payments`,
        description: `${pending.length} payment(s) need to be processed`,
        icon: AlertCircle,
      });
    }
    
    // Check inactive students
    const inactive = students.filter(s => s.status !== "active");
    if (inactive.length > 0) {
      alerts.push({
        id: 2,
        type: "info",
        title: `${inactive.length} inactive students`,
        description: `${inactive.length} student(s) need to be reactivated`,
        icon: UserX,
      });
    }
    
    return alerts;
  };

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
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
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

  const getPriorityBadge = (priority) => {
    if (priority === "high") {
      return { class: "priority-high", label: "High" };
    } else if (priority === "medium") {
      return { class: "priority-medium", label: "Medium" };
    }
    return { class: "priority-low", label: "Low" };
  };

  // ===== INIT =====
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ===== REFRESH =====
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // ===== RENDER =====
  return (
    <div className="registrar-dashboard">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="header-title">
            <div>
              <h1>Dashboard</h1>
            </div>
          </div>
        </div>
        <div className="header-right">
          <button className="btn-refresh" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw size={18} className={refreshing ? "spinning" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* ===== ALERTS ===== */}
      {dashboardData.alerts.length > 0 && (
        <div className="alerts-bar">
          {dashboardData.alerts.map(alert => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <Icon size={18} />
                <div>
                  <strong>{alert.title}</strong>
                  <span>{alert.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== STATS GRID ===== */}
      <section className="stats-grid">
        <div className="stat-card stat-total" onClick={() => navigate("/registrar/student-records")}>
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <h3>{dashboardData.students.total}</h3>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +{dashboardData.students.newThisMonth} this month
            </span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>

        <div className="stat-card stat-active" onClick={() => navigate("/registrar/student-records")}>
          <div className="stat-icon">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Students</span>
            <h3>{dashboardData.students.active}</h3>
            <span className="stat-sub">
              {((dashboardData.students.active / dashboardData.students.total) * 100 || 0).toFixed(1)}% of total
            </span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>

        <div className="stat-card stat-revenue" onClick={() => navigate("/registrar/finance")}>
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <h3>{formatCurrency(dashboardData.finance.totalRevenue)}</h3>
            <span className="stat-change positive">
              <TrendingUp size={14} /> {formatCurrency(dashboardData.finance.todayRevenue)} today
            </span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>

        <div className="stat-card stat-payments" onClick={() => navigate("/registrar/finance")}>
          <div className="stat-icon">
            <CreditCard size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Payments</span>
            <h3>{dashboardData.finance.totalPayments}</h3>
            <span className="stat-sub">
              {dashboardData.finance.pendingPayments} pending
            </span>
          </div>
          <ChevronRight size={18} className="stat-arrow" />
        </div>
      </section>

      {/* ===== SECONDARY STATS ===== */}
      <section className="secondary-stats">
        <div className="secondary-stat">
          <span className="stat-label">Paid Students</span>
          <span className="stat-value">{dashboardData.finance.paidStudents}</span>
          <span className="stat-sub">
            {((dashboardData.finance.paidStudents / (dashboardData.finance.paidStudents + dashboardData.finance.fundedStudents || 1)) * 100 || 0).toFixed(1)}%
          </span>
        </div>
        <div className="secondary-stat">
          <span className="stat-label">Funded Students</span>
          <span className="stat-value">{dashboardData.finance.fundedStudents}</span>
          <span className="stat-sub">
            {((dashboardData.finance.fundedStudents / (dashboardData.finance.paidStudents + dashboardData.finance.fundedStudents || 1)) * 100 || 0).toFixed(1)}%
          </span>
        </div>
        <div className="secondary-stat">
          <span className="stat-label">Month Revenue</span>
          <span className="stat-value">{formatCurrency(dashboardData.finance.thisMonthRevenue)}</span>
        </div>
        <div className="secondary-stat">
          <span className="stat-label">New Students</span>
          <span className="stat-value">{dashboardData.students.newThisMonth}</span>
          <span className="stat-sub">This month</span>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="dashboard-main">
        {/* ===== LEFT COLUMN ===== */}
        <div className="dashboard-left">
          {/* Recent Students */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                Recent Registrations
              </h3>
              <button className="card-action" onClick={() => navigate("/registrar/student-records")}>
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="recent-list">
              {recentStudents.length === 0 ? (
                <div className="empty-state-mini">
                  <Users size={24} />
                  <p>No recent students</p>
                </div>
              ) : (
                recentStudents.map(student => {
                  const status = getStatusBadge(student.status);
                  const StatusIcon = status.icon;
                  return (
                    <div key={student._id} className="recent-item" onClick={() => navigate(`/registrar/students/view/${student._id}`)}>
                      <div className="recent-avatar">
                        <UserCircle size={24} />
                      </div>
                      <div className="recent-info">
                        <span className="recent-name">{student.firstName} {student.fatherName}</span>
                        <span className="recent-detail">{student.studentId} • {student.department?.name || "N/A"}</span>
                      </div>
                      <span className={`status-badge ${status.class}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                      <span className="recent-time">{getTimeAgo(student.createdAt)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <CreditCard size={18} />
                Recent Payments
              </h3>
              <button className="card-action" onClick={() => navigate("/registrar/finance")}>
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="recent-list">
              {recentPayments.length === 0 ? (
                <div className="empty-state-mini">
                  <DollarSign size={24} />
                  <p>No recent payments</p>
                </div>
              ) : (
                recentPayments.map(payment => {
                  const status = getStatusBadge(payment.status);
                  const StatusIcon = status.icon;
                  return (
                    <div key={payment._id} className="recent-item" onClick={() => navigate("/registrar/finance")}>
                      <div className="recent-avatar payment-avatar">
                        <DollarSign size={20} />
                      </div>
                      <div className="recent-info">
                        <span className="recent-name">{formatCurrency(payment.amount)}</span>
                        <span className="recent-detail">
                          {payment.student?.firstName || "Student"} • {payment.paymentMethod || "N/A"}
                        </span>
                      </div>
                      <span className={`status-badge ${status.class}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </span>
                      <span className="recent-time">{getTimeAgo(payment.createdAt)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <div className="dashboard-right">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <Activity size={18} />
                Quick Actions
              </h3>
            </div>
            <div className="quick-actions">
              <button className="quick-action" onClick={() => navigate("/registrar/enrollment")}>
                <UserPlus size={20} />
                <span>New Enrollment</span>
              </button>
              <button className="quick-action" onClick={() => navigate("/registrar/finance/create")}>
                <DollarSign size={20} />
                <span>Record Payment</span>
              </button>
              <button className="quick-action" onClick={() => navigate("/registrar/student-records")}>
                <Search size={20} />
                <span>Find Student</span>
              </button>
              <button className="quick-action" onClick={() => navigate("/registrar/reports")}>
                <FileText size={20} />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <Calendar size={18} />
                Upcoming Deadlines
              </h3>
            </div>
            <div className="deadlines-list">
              {dashboardData.upcomingDeadlines.map(deadline => {
                const priority = getPriorityBadge(deadline.priority);
                const daysLeft = Math.ceil((new Date(deadline.date) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={deadline.id} className="deadline-item">
                    <div className="deadline-info">
                      <span className="deadline-title">{deadline.title}</span>
                      <span className="deadline-date">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Today"}
                      </span>
                    </div>
                    <span className={`priority-badge ${priority.class}`}>
                      {priority.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <Clock size={18} />
                Recent Activity
              </h3>
              <button className="card-action" onClick={() => setShowAllActivities(!showAllActivities)}>
                {showAllActivities ? "Show Less" : "Show All"}
              </button>
            </div>
            <div className="activity-list">
              {(showAllActivities ? dashboardData.recentActivities : dashboardData.recentActivities.slice(0, 5)).map(activity => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="activity-item" onClick={() => navigate(activity.link)}>
                    <div className="activity-icon" style={{ backgroundColor: activity.color + '20', color: activity.color }}>
                      <Icon size={16} />
                    </div>
                    <div className="activity-info">
                      <span className="activity-title">{activity.title}</span>
                      <span className="activity-time">{getTimeAgo(activity.time)}</span>
                    </div>
                  </div>
                );
              })}
              {dashboardData.recentActivities.length === 0 && (
                <div className="empty-state-mini">
                  <Activity size={24} />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATISTICS SECTION ===== */}
      <section className="statistics-section">
        <div className="statistics-header">
          <h3>
            <BarChart3 size={18} />
            Statistics Overview
          </h3>
          <div className="stat-tabs">
            <button
              className={`stat-tab ${selectedChart === "students" ? "active" : ""}`}
              onClick={() => setSelectedChart("students")}
            >
              Students
            </button>
            <button
              className={`stat-tab ${selectedChart === "finance" ? "active" : ""}`}
              onClick={() => setSelectedChart("finance")}
            >
              Finance
            </button>
          </div>
        </div>

        <div className="statistics-content">
          {selectedChart === "students" && (
            <div className="chart-grid">
              <div className="chart-card">
                <h4>Students by Department</h4>
                <div className="chart-bars">
                  {Object.entries(dashboardData.students.byDepartment).map(([name, count]) => (
                    <div key={name} className="chart-bar-item">
                      <span className="chart-label">{name}</span>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar" 
                          style={{ 
                            width: `${(count / dashboardData.students.total) * 100}%`,
                            background: `hsl(${Math.random() * 360}, 70%, 50%)`
                          }}
                        ></div>
                      </div>
                      <span className="chart-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="chart-card">
                <h4>Students by Level</h4>
                <div className="chart-bars">
                  {Object.entries(dashboardData.students.byLevel).map(([level, count]) => (
                    <div key={level} className="chart-bar-item">
                      <span className="chart-label">Level {level}</span>
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar" 
                          style={{ 
                            width: `${(count / dashboardData.students.total) * 100}%`,
                            background: `hsl(${parseInt(level) * 60 + 200}, 70%, 50%)`
                          }}
                        ></div>
                      </div>
                      <span className="chart-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedChart === "finance" && (
            <div className="chart-grid">
              <div className="chart-card">
                <h4>Payment Distribution</h4>
                <div className="pie-chart-simple">
                  <div className="pie-segments">
                    <div className="pie-segment paid">
                      <span className="segment-label">Paid</span>
                      <span className="segment-value">{dashboardData.finance.paidStudents}</span>
                      <span className="segment-percent">
                        {((dashboardData.finance.paidStudents / (dashboardData.finance.paidStudents + dashboardData.finance.fundedStudents || 1)) * 100 || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="pie-segment funded">
                      <span className="segment-label">Funded</span>
                      <span className="segment-value">{dashboardData.finance.fundedStudents}</span>
                      <span className="segment-percent">
                        {((dashboardData.finance.fundedStudents / (dashboardData.finance.paidStudents + dashboardData.finance.fundedStudents || 1)) * 100 || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="chart-card">
                <h4>Revenue Overview</h4>
                <div className="revenue-stats">
                  <div className="revenue-stat-item">
                    <span className="revenue-label">Total</span>
                    <span className="revenue-value">{formatCurrency(dashboardData.finance.totalRevenue)}</span>
                  </div>
                  <div className="revenue-stat-item">
                    <span className="revenue-label">This Month</span>
                    <span className="revenue-value">{formatCurrency(dashboardData.finance.thisMonthRevenue)}</span>
                  </div>
                  <div className="revenue-stat-item">
                    <span className="revenue-label">Today</span>
                    <span className="revenue-value">{formatCurrency(dashboardData.finance.todayRevenue)}</span>
                  </div>
                  <div className="revenue-stat-item">
                    <span className="revenue-label">Pending</span>
                    <span className="revenue-value">{dashboardData.finance.pendingPayments}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}