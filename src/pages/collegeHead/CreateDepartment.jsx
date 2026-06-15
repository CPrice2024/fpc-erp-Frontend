import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createDepartment } from "../../api/collegeHeadApi";
import {
  Building2,
  Hash,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  ArrowLeft,
  Save,
  AlertCircle,
  Info,
} from "lucide-react";
import "./DepartmentForms.css";

const CreateDepartment = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    email: "",
    phone: "",
    established: "",
    headName: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Department name is required";
    if (!formData.code.trim()) newErrors.code = "Department code is required";
    if (!formData.headName.trim()) newErrors.headName = "Department head is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createDepartment(formData);
      navigate("/college-head/departments");
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to create department" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="department-form-page">
      <div className="form-header-section">
        <h1>
          <Building2 size={28} />
          Create Department
        </h1>
        <p className="form-subtitle">Add a new academic department to your institution</p>
      </div>

      <div className="form-card">
        <div className="form-body">
          {errors.submit && (
            <div className="error-banner">
              <AlertCircle size={16} />
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <Building2 size={16} />
                  Department Name
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "error" : ""}`}
                  placeholder="e.g., Computer Science Engineering"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="error-message"><AlertCircle size={12} />{errors.name}</div>}
              </div>

              <div className="form-group">
                <label>
                  <Hash size={16} />
                  Department Code
                  <span className="required-star">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  className={`form-control ${errors.code ? "error" : ""}`}
                  placeholder="e.g., CSE"
                  value={formData.code}
                  onChange={handleChange}
                />
                <div className="field-hint"><Info size={12} />2-10 alphanumeric characters</div>
                {errors.code && <div className="error-message"><AlertCircle size={12} />{errors.code}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>
                <User size={16} />
                Department Head
                <span className="required-star">*</span>
              </label>
              <input
                type="text"
                name="headName"
                className={`form-control ${errors.headName ? "error" : ""}`}
                placeholder="Full name of department head"
                value={formData.headName}
                onChange={handleChange}
              />
              {errors.headName && <div className="error-message"><AlertCircle size={12} />{errors.headName}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Mail size={16} />
                  Email Address
                  <span className="required-star">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "error" : ""}`}
                  placeholder="department@college.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="error-message"><AlertCircle size={12} />{errors.email}</div>}
              </div>

              <div className="form-group">
                <label><Phone size={16} />Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="+1 234 567 8900"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label><FileText size={16} />Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Brief description of the department..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate("/college-head/departments")}>
                <ArrowLeft size={16} /> Cancel
              </button>
              <button type="submit" className={`btn-primary ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                {isLoading ? <><div className="spinner"></div>Creating...</> : <><Save size={16} />Create Department</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartment;