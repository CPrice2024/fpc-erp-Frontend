import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDepartments } from "../../api/collegeHeadApi";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  User,
  Users,
  BookOpen,
  Briefcase,
  ArrowLeft,
  Edit2,
  Clock,
  Info,
  AlertCircle,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import "./DepartmentForms.css";

const ViewDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDepartment();
  }, [id]);

  const loadDepartment = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      let departmentsData = Array.isArray(res.data) ? res.data : res.data?.departments || [];
      const found = departmentsData.find(d => d._id === id);
      
      if (found) setDepartment(found);
      else setError("Department not found");
    } catch (error) {
      setError("Failed to load department details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="department-form-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading department details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="department-form-page">
        <div className="loading-container">
          <div className="error-banner" style={{ justifyContent: "center" }}>
            <AlertCircle size={20} /> {error}
          </div>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
            <button className="btn-secondary" onClick={() => navigate("/college-head/departments")}>
              <ArrowLeft size={16} /> Back
            </button>
            <button className="btn-primary" onClick={loadDepartment}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!department) return null;

  const stats = {
    students: department.students || 0,
    faculty: department.teachers || department.faculty || 0,
    courses: department.courses || 0,
    labs: department.labs || 0,
  };

  return (
    <div className="department-form-page">
      <div className="form-header-section">
        <h1><Building2 size={28} />Department Overview</h1>
        <p className="form-subtitle">View department details and information</p>
      </div>

      <div className="form-card">
        <div className="form-body">
          {/* Header with Code */}
          <div style={{ marginBottom: "24px" }}>
            <div className="code-badge" style={{ marginBottom: "12px" }}>{department.code}</div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", color: "#1a1f2e" }}>{department.name}</h2>
            {department.description && <p style={{ color: "#6b7280", margin: 0, lineHeight: "1.6" }}>{department.description}</p>}
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon"><Users size={20} /></div>
              <div className="stat-value">{stats.students.toLocaleString()}</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><BookOpen size={20} /></div>
              <div className="stat-value">{stats.faculty.toLocaleString()}</div>
              <div className="stat-label">Faculty</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Briefcase size={20} /></div>
              <div className="stat-value">{stats.courses.toLocaleString()}</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Building2 size={20} /></div>
              <div className="stat-value">{stats.labs.toLocaleString()}</div>
              <div className="stat-label">Labs</div>
            </div>
          </div>

          {/* Two Column Info */}
          <div className="info-grid">
            {/* Contact Information */}
            <div className="info-section">
              <div className="info-label">Contact Information</div>
              <div className="contact-items">
                <div className="contact-item">
                  <div className="contact-icon"><Mail size={18} /></div>
                  <div className="contact-details">
                    <div className="contact-label">Email</div>
                    <div className="contact-value">{department.email || "Not provided"}</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><Phone size={18} /></div>
                  <div className="contact-details">
                    <div className="contact-label">Phone</div>
                    <div className="contact-value">{department.phone || "Not provided"}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Department Head */}
            <div className="info-section">
              <div className="info-label">Leadership</div>
              <div className="hod-card">
                <div className="hod-avatar"><User size={28} /></div>
                <div className="hod-info">
                  <div className="hod-name">{department.departmentHead?.name || department.headName || "Not Assigned"}</div>
                  <div className="hod-email">Head of Department</div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="info-section">
              <div className="info-label">Additional Information</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div><span style={{ color: "#6b7280" }}>Established:</span> {department.established || "Not specified"}</div>
                <div><span style={{ color: "#6b7280" }}>Status:</span> {department.status === "active" ? "Active" : "Inactive"}</div>
                <div><span style={{ color: "#6b7280" }}>Department ID:</span> {department._id?.slice(-8)}</div>
              </div>
            </div>

            {/* Timeline */}
            <div className="info-section">
              <div className="info-label">Timeline</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div><span style={{ color: "#6b7280" }}>Created:</span> {formatDate(department.createdAt)}</div>
                <div><span style={{ color: "#6b7280" }}>Last Updated:</span> {formatDate(department.updatedAt)}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions" style={{ marginTop: "32px" }}>
            <button className="btn-secondary" onClick={() => navigate("/college-head/departments")}>
              <ArrowLeft size={16} /> Back to Departments
            </button>
            <button className="btn-primary" onClick={() => navigate(`/college-head/departments/edit/${department._id}`)}>
              <Edit2 size={16} /> Edit Department
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartment;