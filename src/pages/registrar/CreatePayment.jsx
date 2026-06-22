import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  ArrowLeft,
  User,
  Users,
  Upload,
  FileText,
  CreditCard,
  DollarSign,
  Calendar,
  Hash,
  Building,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Save,
} from "lucide-react";
import "./Finance.css";

export default function CreatePayment() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ===== STATES =====
  const [departments, setDepartments] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    student: "",
    paymentType: "Paid",
    paymentMethod: "Cash",
    amount: "",
    transactionId: "",
    slip: null,
    semester: "",
    academicYear: "",
    paidBy: "",
    remarks: "",
  });

  // ===== FETCH FUNCTIONS =====
  const fetchDepartments = async () => {
    try {
      const { data } = await api.get("/registrars/departments");
      setDepartments(data);
    } catch (error) {
      console.error("Department Error:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/registrars/students");
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // ===== INIT =====
  useEffect(() => {
    fetchDepartments();
    fetchStudents();
  }, []);

  // ===== FILTER STUDENTS =====
  useEffect(() => {
    let filtered = students;

    // Filter by department
    if (selectedDepartment) {
      filtered = filtered.filter((s) => {
        const deptId = typeof s.department === "object" ? s.department?._id : s.department;
        return deptId === selectedDepartment;
      });
    }

    // Filter by search
    if (studentSearch) {
      filtered = filtered.filter(
        (s) =>
          s.studentId?.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.firstName?.toLowerCase().includes(studentSearch.toLowerCase()) ||
          s.fatherName?.toLowerCase().includes(studentSearch.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [selectedDepartment, studentSearch, students]);

  // ===== HANDLERS =====
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        slip: file,
      });
    }
  };

  const handleStudentSelect = (studentId) => {
    const student = students.find((s) => s._id === studentId);
    setSelectedStudent(student);
    setFormData({
      ...formData,
      student: studentId,
    });
    // Clear search after selection
    setStudentSearch("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student) {
      alert("Please select a student");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(
  "/finance",
  {
    student: formData.student,
    paymentType:
      formData.paymentType,
    paymentMethod:
      formData.paymentMethod,
    amount:
      Number(formData.amount),
    transactionId:
      formData.transactionId,
    semester:
      formData.semester,
    academicYear:
      formData.academicYear,
    paidBy:
      formData.paidBy,
    remarks:
      formData.remarks,
  }
);

      alert("✅ Payment saved successfully!");
      navigate("/registrar/Finance");
    } catch (error) {
      alert(error.response?.data?.message || "Error saving payment");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      student: "",
      paymentType: "Paid",
      paymentMethod: "Cash",
      amount: "",
      transactionId: "",
      slip: null,
      semester: "",
      academicYear: "",
      paidBy: "",
      remarks: "",
    });
    setSelectedStudent(null);
    setSelectedDepartment("");
    setStudentSearch("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-ET", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // ===== RENDER =====
  return (
    <div className="create-payment-page">
      {/* ===== HEADER ===== */}
      <header className="create-payment-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/registrar/Finance")}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="header-divider"></div>
          <h1>Create New Payment</h1>
        </div>
        <div className="header-right">
          <button className="btn-outline" onClick={resetForm}>
            Reset Form
          </button>
        </div>
      </header>

      <div className="create-payment-grid">
        {/* ===== LEFT COLUMN - Student Selection ===== */}
        <div className="student-selection-card">
          <h3>
            <Users size={18} />
            Student Selection
          </h3>

          {/* Department Dropdown */}
          <div className="form-group">
            <label>
              <Building size={16} />
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedStudent(null);
                setFormData({ ...formData, student: "" });
              }}
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Student Search */}
          <div className="form-group">
            <label>
              <Search size={16} />
              Search Student
            </label>
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search by ID or Name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
              {studentSearch && (
                <button className="clear-btn" onClick={() => setStudentSearch("")}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Student List */}
          <div className="student-list">
            {filteredStudents.length === 0 ? (
              <div className="no-students">
                <Users size={32} />
                <p>No students found</p>
                <span>Try adjusting your search or department filter</span>
              </div>
            ) : (
              filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className={`student-item ${selectedStudent?._id === s._id ? "selected" : ""}`}
                  onClick={() => handleStudentSelect(s._id)}
                >
                  <div className="student-avatar">
                    <User size={20} />
                  </div>
                  <div className="student-info">
                    <span className="student-name">
                      {s.firstName} {s.fatherName}
                    </span>
                    <span className="student-id">{s.studentId}</span>
                  </div>
                  {selectedStudent?._id === s._id && (
                    <CheckCircle size={18} className="check-icon" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ===== RIGHT COLUMN - Payment Form ===== */}
        <div className="payment-form-card">
          <h3>
            <CreditCard size={18} />
            Payment Details
          </h3>

          {/* Student Preview */}
          {selectedStudent ? (
            <div className="student-preview">
              <div className="preview-avatar">
                <User size={28} />
              </div>
              <div className="preview-info">
                <h4>{selectedStudent.firstName} {selectedStudent.fatherName}</h4>
                <span className="preview-id">{selectedStudent.studentId}</span>
                <span className="preview-dept">{selectedStudent.department?.name}</span>
              </div>
            </div>
          ) : (
            <div className="student-preview empty">
              <AlertCircle size={24} />
              <p>Please select a student from the list</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FileText size={16} />
                  Payment Type *
                </label>
                <select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  required
                >
                  <option value="Paid">Paid</option>
                  <option value="Funded">Funded</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <DollarSign size={16} />
                  Amount (ETB) *
                </label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <CreditCard size={16} />
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank Transfer</option>
                  <option value="Telebirr">Telebirr</option>
                  <option value="CBE Birr">CBE Birr</option>
                </select>
              </div>

              <div className="form-group">
                <label>
                  <Hash size={16} />
                  Transaction ID
                </label>
                <input
                  type="text"
                  name="transactionId"
                  placeholder="Enter transaction ID"
                  value={formData.transactionId}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Semester
                </label>
                <input
                  type="text"
                  name="semester"
                  placeholder="e.g. Fall 2024"
                  value={formData.semester}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={16} />
                  Academic Year
                </label>
                <input
                  type="text"
                  name="academicYear"
                  placeholder="e.g. 2024-2025"
                  value={formData.academicYear}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <User size={16} />
                  Paid By
                </label>
                <input
                  type="text"
                  name="paidBy"
                  placeholder="Name of payer"
                  value={formData.paidBy}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Remarks</label>
                <textarea
                  name="remarks"
                  placeholder="Additional notes..."
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Payment Slip</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <Upload size={20} />
                  <span>
                    {formData.slip ? formData.slip.name : "Upload receipt or slip"}
                  </span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/registrar/Finance")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={submitting || !selectedStudent}
              >
                <Save size={18} />
                {submitting ? "Saving..." : "Save Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}