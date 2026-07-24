import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createCourse,
} from "../../api/departmentApi";

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
  semester: "",
  section: "",
  nominalDuration: 30,
  status: "active",
});

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = "Course code is required";
    } else if (!/^[A-Z]{2,10}[0-9]{2,10}$/.test(formData.courseCode.toUpperCase())) {
      newErrors.courseCode = "Format: 2-10 letters followed by 2-10 numbers (e.g., CS101)";
    }
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }
    
    if (!formData.level) {
      newErrors.level = "Please select a level";
    }
    
    if (formData.nominalDuration < 30 || formData.nominalDuration > 200) {
      newErrors.nominalDuration = "Nominal duration must be between 30 and 200 Hour";
    }
    if (!formData.semester) {
  newErrors.semester = "Please select a semester";
}

if (!formData.section) {
  newErrors.section = "Please select a section";
}
if (!formData.level) {
  newErrors.level = "Please select a level";
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
      await createCourse(formData);
      alert("Course created successfully!");

     navigate("/department-head/courses");

    } catch (error) {
      setErrors({ submit: error.response?.data?.message || "Failed to create course" });
    } finally {
      setIsLoading(false);
    }
  };

  const levels = ["Short Term", "Level I", "Level II", "Level III", "Level IV", "Level V"];

  return (
    <div className="course-form-page">
      <div className="page-header">
        <h1>
          <BookOpen size={25} />
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
  <label>Semester</label>

  <select
    name="semester"
    value={formData.semester}
    onChange={handleChange}
  >
    <option value="">Select Semester</option>
<option value="Semester I">Semester I</option>
<option value="Semester II">Semester II</option>
  </select>
  {errors.semester && (
  <div className="error-message">
    <AlertCircle size={12} />
    {errors.semester}
  </div>
)}
</div>

<div className="form-group">
  <label>Section</label>

  <select
    name="section"
    value={formData.section}
    onChange={handleChange}
  >
    <option value="">Select Section</option>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
    <option value="D">D</option>
  </select>
  {errors.section && (
  <div className="error-message">
    <AlertCircle size={12} />
    {errors.section}
  </div>
)}
  
</div>

          <div className="form-group">
            <label>
              <Clock size={16} />
                            Nominal duration range from 30 to 200 Total Hour

              <span className="required-star">*</span>
            </label>
            <input
              type="number"
              name="nominalDuration"
              min="30"
              max="200"
              step="1"
              value={formData.nominalDuration}
              onChange={handleChange}
              className={errors.nominalDuration ? "error" : ""}
            />
            <div className="field-hint">
              <Info size={12} />
              Nominal duration range from 30 to 200 Hour
            </div>
            {errors.nominalDuration && (
              <div className="error-message">
                <AlertCircle size={12} />
                {errors.nominalDuration}
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
            className="upload-btnn"
            onClick={() => navigate("/department-head/courses")}
          >
            <ArrowLeft size={16} />
            Cancel
          </button>
          <button type="submit" className="upload-btnn" disabled={isLoading}>
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