import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  ArrowLeft,
  Save,
  User,
  Mail,
  CheckCircle,
} from "lucide-react";

import "./CreateTeacher.css";

export default function CreateTeacher() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState(null);

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    course: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");

      setCourses(res.data);
    } catch (error) {
      console.error(
        "Failed to load courses:",
        error
      );
    }
  };

  const createTeacher = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.gender ||
      !form.course
    ) {
      return alert(
        "Please fill all required fields"
      );
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/department-teachers",
        form
      );

      setCredentials(
        res.data.loginCredentials
      );

      setForm({
        name: "",
        email: "",
        gender: "",
        course: "",
      });

    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to create teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-teacher-page">

      <div className="create-header">

        <button
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Create Teacher</h1>

      </div>

      {credentials && (
        <div className="success-card">

          <CheckCircle size={60} />

          <h2>
            Teacher Created Successfully
          </h2>

          <div className="credential-item">
            <span>Email</span>
            <strong>
              {credentials.email}
            </strong>
          </div>

          <div className="credential-item">
            <span>Password</span>
            <strong>
              {credentials.password}
            </strong>
          </div>

          <p>
            Save these credentials.
            They will not be shown again.
          </p>

        </div>
      )}

      <div className="form-card">

        <h2>
          Teacher Information
        </h2>

        {/* Name */}

        <div className="input-group">

          <label>
            Full Name
          </label>

          <div className="input-wrapper">
            <User size={18} />

            <input
              type="text"
              value={form.name}
              placeholder="Enter teacher name"
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

        </div>

        {/* Email */}

        <div className="input-group">

          <label>
            Email Address
          </label>

          <div className="input-wrapper">
            <Mail size={18} />

            <input
              type="email"
              value={form.email}
              placeholder="Enter email"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

        </div>

        {/* Gender */}

        <div className="input-group">

          <label>
            Gender
          </label>

          <div className="input-wrapper">

            <select
              value={form.gender}
              onChange={(e) =>
                setForm({
                  ...form,
                  gender: e.target.value,
                })
              }
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

            </select>

          </div>

        </div>

        {/* Course */}

        <div className="input-group">

          <label>
            Course
          </label>

          <div className="input-wrapper">

            <select
              value={form.course}
              onChange={(e) =>
                setForm({
                  ...form,
                  course: e.target.value,
                })
              }
            >
              <option value="">
                Select Course
              </option>

              {courses.map((course) => (
                <option
                  key={course._id}
                  value={course._id}
                >
                  {course.courseName}
                </option>
              ))}

            </select>

          </div>

        </div>

        <button
          className="create-btn"
          onClick={createTeacher}
          disabled={loading}
        >
          <Save size={18} />

          {loading
            ? "Creating..."
            : "Create Teacher"}
        </button>

      </div>

    </div>
  );
}