import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCourse,
  updateCourse,
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
  XCircle,
} from "lucide-react";

import "./CourseForm.css";

export default function EditCourse() {
  const navigate = useNavigate();

const { id } = useParams();

const [loading, setLoading] = useState(true);

const [saving, setSaving] = useState(false);

const [errors, setErrors] = useState({});

const [formData, setFormData] = useState({
  courseCode: "",
  courseName: "",
  level: "",
  semester: "",
  section: "",
  creditHour: 3,
  status: "active",
});

useEffect(() => {
  fetchCourse();
}, []);

const fetchCourse = async () => {
  try {

    const { data } = await getCourse(id);

    setFormData({
      courseCode: data.courseCode || "",
      courseName: data.courseName || "",
      level: data.level || "",
      semester: data.semester || "",
      section: data.section || "",
      creditHour: data.creditHour || 3,
      status: data.status || "active",
    });

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to load course"
    );

  } finally {

    setLoading(false);

  }
};

const handleChange = (e) => {

  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (errors[name]) {
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

};

const validateForm = () => {

  const newErrors = {};

  if (!formData.courseCode.trim()) {
    newErrors.courseCode = "Course code is required";
  }

  if (!formData.courseName.trim()) {
    newErrors.courseName = "Course name is required";
  }

  if (!formData.level) {
    newErrors.level = "Level is required";
  }

  if (!formData.semester) {
    newErrors.semester = "Semester is required";
  }

  if (!formData.section) {
    newErrors.section = "Section is required";
  }

  if (
    formData.creditHour < 1 ||
    formData.creditHour > 6
  ) {
    newErrors.creditHour =
      "Credit hour must be between 1 and 6";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;

};
const handleSubmit = async (e) => {

  e.preventDefault();

  if (!validateForm()) return;

  try {

    setSaving(true);

    await updateCourse(id, formData);

    alert("Course updated successfully");

    navigate("/department-head/courses");

  } catch (error) {

    setErrors({
      submit:
        error.response?.data?.message ||
        "Update failed",
    });

  } finally {

    setSaving(false);

  }

};
const levels = [
  "Level I",
  "Level II",
  "Level III",
  "Level IV",
  "Level V",
];


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
            value={formData.courseCode}
            readOnly
            className="readonly-input"/>
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
    <option value="1">Semester 1</option>
    <option value="2">Semester 2</option>
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
          <button
  type="submit"
  className="submit-btn"
  disabled={saving}
>
  {saving ? (
    <>
      <div
        className="loading-spinner"
        style={{ width: 16, height: 16 }}
      />
      Updating...
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