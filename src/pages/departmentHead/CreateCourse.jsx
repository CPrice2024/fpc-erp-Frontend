import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  XCircle
} from "lucide-react";
import "./CourseForm.css"

export default function CreateCourse() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    level: "",
    creditHour: 3,
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    } else if (!/^[A-Z]{2,4}[0-9]{3,4}$/.test(formData.courseCode.toUpperCase())) {
      newErrors.courseCode = "Format: 2-4 letters followed by 3-4 numbers (e.g., CS101)";
    }
    
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await api.post("/courses", formData);
      navigate("/department-head/courses");
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to create course" });
    } finally {
      setIsLoading(false);
    }
  };

  const levels = ["Level I", "Level II", "Level III", "Level IV", "Level V"];

  return (
    <div className="course-form-page">
      <div className="page-header">
        <h1>
          <BookOpen size={28} />
          Add Course
        </h1>
        <p className="page-subtitle">Add a new course to the curriculum</p>
      </div>

      <form onSubmit={handleSubmit} className="course-form-card">
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
              <span className="required-star">*</span>
            </label>
            <input
              type="text"
              name="courseCode"
              placeholder="e.g., CS101"
              value={formData.courseCode}
              onChange={handleChange}
              className={errors.courseCode ? "error" : ""}
            />
            <div className="field-hint">
              <Info size={12} />
              2-4 letters followed by 3-4 numbers
            </div>
            {errors.courseCode && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.courseCode}
              </div>
            )}
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
              placeholder="e.g., Introduction to Programming"
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
            <option value="active">
              <CheckCircle size={14} /> Active
            </option>
            <option value="inactive">
              <XCircle size={14} /> Inactive
            </option>
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
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="loading-spinner" style={{ width: 16, height: 16 }}></div>
                Creating...
              </>
            ) : (
              <>
                <Save size={16} />
                Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}