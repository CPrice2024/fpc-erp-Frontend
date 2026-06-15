import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDepartments, updateDepartment } from "../../api/collegeHeadApi";
import {
  Building2,
  Hash,
  User,
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  Save,
  AlertCircle,
  Info,
} from "lucide-react";
import "./DepartmentForms.css";

const EditDepartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    email: "",
    phone: "",
    established: "",
    headName: "",
  });

  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    loadDepartment();
  }, [id]);

  const loadDepartment = async () => {
    try {
      setLoading(true);
      const res = await getDepartments();
      let departmentsData = Array.isArray(res.data) ? res.data : res.data?.departments || [];
      const department = departmentsData.find(d => d._id === id);

      if (department) {
        setFormData({
          name: department.name || "",
          code: department.code || "",
          description: department.description || "",
          email: department.email || "",
          phone: department.phone || "",
          established: department.established || "",
          headName: department.headName || department.departmentHead?.name || "",
        });
        setOriginalData(department);
      } else {
        setErrors({ submit: "Department not found" });
      }
    } catch (error) {
      setErrors({ submit: "Failed to load department" });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Department name is required";
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
    if (successMessage) setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      await updateDepartment(id, formData);
      setSuccessMessage("Department updated successfully!");
      setTimeout(() => navigate("/college-head/departments"), 1500);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to update department" });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = () => JSON.stringify(formData) !== JSON.stringify({
    name: originalData.name || "",
    code: originalData.code || "",
    description: originalData.description || "",
    email: originalData.email || "",
    phone: originalData.phone || "",
    established: originalData.established || "",
    headName: originalData.headName || originalData.departmentHead?.name || "",
  });

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

  return (
    <div className="department-form-page">
      <div className="form-header-section">
        <h1><Building2 size={28} />Edit Department</h1>
        <p className="form-subtitle">Update department information</p>
      </div>

      <div className="form-card">
        <div className="form-body">
          {successMessage && <div className="success-banner"><Info size={16} />{successMessage}</div>}
          {errors.submit && <div className="error-banner"><AlertCircle size={16} />{errors.submit}</div>}

          <div className="warning-banner">
            <Info size={16} />
            <p>Department code cannot be changed after creation as it's used as a unique identifier.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label><Building2 size={16} />Department Name<span className="required-star">*</span></label>
                <input type="text" name="name" className={`form-control ${errors.name ? "error" : ""}`}
                  value={formData.name} onChange={handleChange} />
                {errors.name && <div className="error-message"><AlertCircle size={12} />{errors.name}</div>}
              </div>

              <div className="form-group">
                <label><Hash size={16} />Department Code</label>
                <input type="text" className="form-control" value={formData.code} disabled />
                <div className="field-hint"><Info size={12} />Code cannot be changed</div>
              </div>
            </div>

            <div className="form-group">
              <label><User size={16} />Department Head<span className="required-star">*</span></label>
              <input type="text" name="headName" className={`form-control ${errors.headName ? "error" : ""}`}
                value={formData.headName} onChange={handleChange} />
              {errors.headName && <div className="error-message"><AlertCircle size={12} />{errors.headName}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><Mail size={16} />Email Address<span className="required-star">*</span></label>
                <input type="email" name="email" className={`form-control ${errors.email ? "error" : ""}`}
                  value={formData.email} onChange={handleChange} />
                {errors.email && <div className="error-message"><AlertCircle size={12} />{errors.email}</div>}
              </div>

              <div className="form-group">
                <label><Phone size={16} />Phone Number</label>
                <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label><FileText size={16} />Description</label>
              <textarea name="description" className="form-control" value={formData.description}
                onChange={handleChange} rows="4" />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={() => navigate("/college-head/departments")}>
                <ArrowLeft size={16} /> Cancel
              </button>
              <button type="submit" className={`btn-primary ${saving ? "loading" : ""}`} disabled={saving || !hasChanges()}>
                {saving ? <><div className="spinner"></div>Saving...</> : <><Save size={16} />Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;