import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import {
  BookOpen,
  GraduationCap,
  Clock,
  AlertCircle,
  Save,
  ArrowLeft,
  Info,
  CheckCircle,
} from "lucide-react";
import "./CourseForm.css"

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    level: "",
    creditHour: 3,
    status: "active",
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await api.get(`/courses/${id}`);
      setFormData({
        courseCode: res.data.courseCode || "",
        courseName: res.data.courseName || "",
        level: res.data.level || "",
        creditHour: res.data.creditHour || 3,
        status: res.data.status || "active",
      });
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Failed to load course" });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }
    
    if (!formData.level) {
      newErrors.level = "Please select a level";
    }
    
    if (formData.creditHour < 1 || formData.creditHour > 6) {
      newErrors.creditHour = "Credit hour must be between 1 and 6";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      await api.put(`/courses/${id}`, formData);
      setSuccessMessage("Course updated successfully!");
      setTimeout(() => navigate("/department-head/courses"), 1500);
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to update course" });
    } finally {
      setSaving(false);
    }
  };

  const levels = ["Level I", "Level II", "Level III", "Level IV", "Level V"];

  if (loading) {
    return (
      <div className="course-form-page">
        <div className="page-loader">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-form-page">
      <div className="page-header">
        <h1>
          <BookOpen size={28} />
          Edit Course
        </h1>
        <p className="page-subtitle">Update course information</p>
      </div>

      <form onSubmit={handleSubmit} className="course-form-card">
        {successMessage && (
          <div className="success-banner">
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}
        
        {errors.submit && (
          <div className="error-banner">
            <AlertCircle size={16} />
            {errors.submit}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label>
              <GraduationCap size={16} />
              Course Code
            </label>
            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              disabled
            />
            <div className="field-hint">
              <Info size={12} />
              Course code cannot be changed
            </div>
          </div>

          <div className="form-group">
            <label>
              <BookOpen size={16} />
              Course Name
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              className={errors.courseName ? "error" : ""}
            />
            {errors.courseName && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.courseName}
              </div>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <GraduationCap size={16} />
              Level
              <span className="required-star">*</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className={errors.level ? "error" : ""}
            >
              <option value="">Select Level</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            {errors.level && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.level}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              <Clock size={16} />
              Credit Hour
              <span className="required-star">*</span>
            </label>
            <input
              type="number"
              name="creditHour"
              min="1"
              max="6"
              step="1"
              value={formData.creditHour}
              onChange={handleChange}
              className={errors.creditHour ? "error" : ""}
            />
            <div className="field-hint">
              <Info size={12} />
              Credit hours range from 1 to 6
            </div>
            {errors.creditHour && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.creditHour}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/department-head/courses")}
          >
            <ArrowLeft size={16} />
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? (
              <>
                <div className="loading-spinner" style={{ width: 16, height: 16 }}></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}