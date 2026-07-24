import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  DollarSign,
  Users,
  Search,
  Filter,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Printer,
  FileText,
  Eye,
  Download,
  Plus,
} from "lucide-react";
import "./Finance.css";

export default function FinanceDashboard() {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    paidStudents: 0,
    fundedStudents: 0,
    pendingPayments: 0,
    monthlyRevenue: 0,
    growthPercentage: 0,
  });

  // ===== FETCH FUNCTIONS =====
  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/registrars/students");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await api.get("/registrars/departments");
      setDepartments(data);
    } catch (error) {
      console.error("Department Error:", error);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/finance");
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get("/finance/dashboard");
      setDashboard(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    }
  };

  // ===== INIT =====
  useEffect(() => {
    fetchStudents();
    fetchDepartments();
    fetchPayments();
    fetchDashboard();
  }, []);

  // ===== SEARCH & FILTER =====
  useEffect(() => {
    let filtered = payments;

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.student?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.student?.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by payment type
    if (filterType !== "all") {
      filtered = filtered.filter((p) => p.paymentType === filterType);
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.student?.department?._id === departmentFilter
      );
    }

    setFilteredPayments(filtered);
  }, [searchTerm, filterType, departmentFilter, payments]);

  // ===== HELPER FUNCTIONS =====
  const getStatusBadge = (status) => {
    const statusMap = {
      Paid: { icon: CheckCircle, class: "status-paid", label: "Paid" },
      Pending: { icon: Clock, class: "status-pending", label: "Pending" },
      Failed: { icon: AlertCircle, class: "status-failed", label: "Failed" },
      Funded: { icon: TrendingUp, class: "status-funded", label: "Funded" },
    };
    const s = statusMap[status] || statusMap.Pending;
    return { Icon: s.icon, className: s.class, label: s.label };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ===== RENDER =====
  return (
    <div className="finance-page">
      {/* ===== HEADER ===== */}
      <header className="finance-header">
        <div className="header-left">
          <div className="logo-wrapper">
            <div>
              <h1>Finance</h1>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button 
            className="btn-print" 
            onClick={() => navigate("/registrar/CreatePayment")}
          >
            <Plus size={18} />
              Add
          </button>
          <button className="btn-print" onClick={() => window.print()}>
            <Printer size={18} />
            Print
          </button>
        </div>
      </header>

      {/* ===== STATS CARDS ===== */}
      <section className="stats-grid">
        <div className="stat-card stat-revenue">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <h3>{formatCurrency(dashboard.totalRevenue || 0)}</h3>
            <span className="stat-change positive">
              <TrendingUp size={14} /> +{dashboard.growthPercentage || 0}%
            </span>
          </div>
        </div>

        <div className="stat-card stat-students">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Students</span>
            <h3>{students.length}</h3>
            <span className="stat-sub">{dashboard.paidStudents || 0} paid</span>
          </div>
        </div>

        <div className="stat-card stat-funded">
          <div className="stat-icon">
          </div>
          <div className="stat-info">
            <span className="stat-label">Funded Students</span>
            <h3>{dashboard.fundedStudents || 0}</h3>
            <span className="stat-sub">Scholarship/Sponsorship</span>
          </div>
        </div>

        <div className="stat-card stat-monthly">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">This Month</span>
            <h3>{formatCurrency(dashboard.monthlyRevenue || 0)}</h3>
            <span className="stat-sub">Revenue</span>
          </div>
        </div>
      </section>

      {/* ===== PAYMENT HISTORY ===== */}
      <section className="history-section">
        <div className="history-header">
          <div className="history-title">
            <h2>Payment History</h2>
            <span className="payment-count">{filteredPayments.length} entries</span>
          </div>

          <div className="history-controls">
            <div className="search-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="filter-wrapper">
              <Filter size={18} />
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="Paid">Paid</option>
                <option value="Funded">Funded</option>
              </select>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading payments...</p>
            </div>
          ) : (
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Receipt</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="empty-state">
                      <FileText size={40} />
                      <p>No payments found</p>
                      <span>Start by registering a new payment</span>
                      <button 
                        className="btn-primary empty-btn"
                        onClick={() => navigate("/finance/create")}
                      >
                        <Plus size={18} />
                        Create Payment
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => {
                    const { Icon, className, label } = getStatusBadge(p.status || "Pending");
                    return (
                      <tr key={p._id}>
                        <td>
                          <div className="student-cell">
                            <span className="student-id">{p.student?.studentId}</span>
                            <span className="student-name">
                              {p.student?.firstName} {p.student?.fatherName}
                            </span>
                          </div>
                        </td>
                        <td>{p.student?.department?.name}</td>
                        <td>
                          <span className={`type-badge ${p.paymentType?.toLowerCase()}`}>
                            {p.paymentType}
                          </span>
                        </td>
                        <td className="amount-cell">{formatCurrency(p.amount)}</td>
                        <td>{p.paymentMethod}</td>
                        <td>
                          <span className="receipt-number">{p.receiptNumber || "N/A"}</span>
                        </td>
                        <td>{formatDate(p.createdAt)}</td>
                        <td>
                          <span className={`status-badge ${className}`}>
                            <Icon size={14} />
                            {label}
                          </span>
                        </td>
                        <td>
                          <div className="separate">
                          <button
                            className="action-btn view-btn"
                            onClick={() => {
                              setSelectedPayment(p);
                              setShowReceiptModal(true);
                            }}
                            title="View Details"
                          >
                            <Eye size={12} />
                            View
                          </button>
                          <button
                            className="action-btn download-btn"
                            onClick={() => alert(`Downloading receipt: ${p.receiptNumber}`)}
                            title="Download Receipt"
                          >
                            <Download size={16} />
                            Download
                          </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ===== RECEIPT MODAL ===== */}
      {showReceiptModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-content receipt-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FileText size={20} />
                Payment Receipt
              </h2>
              <button className="modal-close" onClick={() => setShowReceiptModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="receipt-content">
              <div className="receipt-header">
                <div className="receipt-logo">
                  <img src="/logo.svg" alt="Logo" />
                </div>
                <div className="receipt-title">
                  <h3>PAYMENT RECEIPT</h3>
                  <span>#{selectedPayment.receiptNumber}</span>
                </div>
              </div>

              <div className="receipt-body">
                <div className="receipt-row">
                  <span className="receipt-label">Student</span>
                  <span className="receipt-value">
                    {selectedPayment.student?.firstName} {selectedPayment.student?.lastName}
                  </span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Student ID</span>
                  <span className="receipt-value">{selectedPayment.student?.studentId}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Department</span>
                  <span className="receipt-value">{selectedPayment.student?.department?.name}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Payment Type</span>
                  <span className="receipt-value">{selectedPayment.paymentType}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Amount</span>
                  <span className="receipt-value amount">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Method</span>
                  <span className="receipt-value">{selectedPayment.paymentMethod}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Transaction ID</span>
                  <span className="receipt-value">{selectedPayment.transactionId || "N/A"}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Date</span>
                  <span className="receipt-value">{formatDate(selectedPayment.createdAt)}</span>
                </div>
                <div className="receipt-row">
                  <span className="receipt-label">Status</span>
                  <span className={`receipt-status ${selectedPayment.status?.toLowerCase()}`}>
                    {selectedPayment.status || "Pending"}
                  </span>
                </div>
                {selectedPayment.remarks && (
                  <div className="receipt-row">
                    <span className="receipt-label">Remarks</span>
                    <span className="receipt-value">{selectedPayment.remarks}</span>
                  </div>
                )}
              </div>

              <div className="receipt-footer">
                <button className="btn-download" onClick={() => alert("Downloading receipt...")}>
                  <Download size={18} />
                  Download Receipt
                </button>
                <button className="btn-print" onClick={() => window.print()}>
                  <Printer size={18} />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}