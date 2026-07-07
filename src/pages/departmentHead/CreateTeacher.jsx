import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { createTeacher } from "../../api/departmentApi";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  BookOpen,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import "./CreateTeacher.css";

export default function CreateTeacher() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    specialization: "",
    experience: "",
    courseId: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!form.gender) {
      newErrors.gender = "Please select a gender";
    }

    if (!form.courseId) {
      newErrors.courseId = "Please select a course";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await createTeacher(form);
      setCredentials(data.loginCredentials);
      setForm({
        name: "",
        email: "",
        gender: "",
        specialization: "",
        experience: "",
        courseId: "",
      });
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || "Failed to create teacher",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-teacher-page">
      <div className="create-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Back
        </button>
        <div>
          <h1>Create Teacher</h1>
          <p>Register a new teacher and assign a course.</p>
        </div>
      </div>

      {credentials && (
        <div className="success-card">
          <CheckCircle size={60} />
          <h2>Teacher Created Successfully</h2>
          <div className="credential-item">
            <span>Email</span>
            <strong>{credentials.email}</strong>
          </div>
          <div className="credential-item">
            <span>Password</span>
            <strong>{credentials.password}</strong>
          </div>
          <p>Save these credentials. They will not be shown again.</p>
        </div>
      )}

      {credentials && (
        <div className="success-actions">
          <button
            className="back-list-btn"
            onClick={() => navigate("/department-head/teachers")}
          >
            Back to Teachers
          </button>
          <button className="create-another-btn" onClick={() => setCredentials(null)}>
            Create Another
          </button>
        </div>
      )}

      {!credentials && (
        <div className="form-card">
          <h2>Teacher Information</h2>

          {/* Global Error */}
          {errors.submit && (
            <div className="error-text" style={{ marginBottom: "16px" }}>
              <AlertCircle size={14} />
              {errors.submit}
            </div>
          )}

          {/* Name */}
          <div className="input-group-place">
            <label>
              Full Name
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.name ? "error" : ""}`}>
              <User size={18} />
              <input
                type="text"
                name="name"
                value={form.name}
                placeholder="Enter teacher name"
                onChange={handleChange}
              />
            </div>
            {errors.name && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="input-group-place">
            <label>
              Email Address
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
              <Mail size={18} />
              <input
                type="email"
                name="email"
                value={form.email}
                placeholder="teacher@FPC.edu"
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.email}
              </span>
            )}
          </div>

          {/* Gender */}
          <div className="input-group-place">
            <label>
              Gender
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.gender ? "error" : ""}`}>
              <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            {errors.gender && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.gender}
              </span>
            )}
          </div>

          {/* Specialization */}
          <div className="input-group-place">
            <label>Specialization</label>
            <div className="input-wrapper">
              <Briefcase size={18} />
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                placeholder="e.g. Computer Science"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Experience */}
          <div className="input-group-place">
            <label>Experience (Years)</label>
            <div className="input-wrapper">
              <GraduationCap size={18} />
              <input
                type="number"
                name="experience"
                placeholder="Years of experience"
                value={form.experience}
                onChange={handleChange}
                min="0"
                max="50"
              />
            </div>
          </div>

          {/* Course */}
          <div className="input-group-place">
            <label>
              Course
              <span className="required-star">*</span>
            </label>
            <div className={`input-wrapper ${errors.courseId ? "error" : ""}`}>
              <BookOpen size={18} />
              <select name="courseId" value={form.courseId} onChange={handleChange}>
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>
            {errors.courseId && (
              <span className="error-text">
                <AlertCircle size={14} />
                {errors.courseId}
              </span>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className={`create-btn ${loading ? "disabled" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              <>
                <Save size={18} />
                Create Teacher
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}