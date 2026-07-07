import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import {
  getTeacher,
  updateTeacher,
} from "../../api/departmentAPI";

import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Briefcase,
  GraduationCap,
} from "lucide-react";

import "./CreateTeacher.css";

export default function EditTeacher() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    gender: "",
    specialization: "",
    experience: "",
    courseId: "",
    status: "active",
  });

  useEffect(() => {
    fetchTeacher();
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses");
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTeacher = async () => {

    try {

      const { data } = await getTeacher(id);

      setForm({
        name: data.name || "",
        email: data.email || "",
        gender: data.gender || "",
        specialization: data.specialization || "",
        experience: data.experience || "",
        courseId: data.course?._id || "",
        status: data.status || "active",
      });

    } catch (error) {

      console.error(error);

      alert("Unable to load teacher.");

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async () => {

    if (
      !form.name ||
      !form.email ||
      !form.gender ||
      !form.courseId
    ) {
      return alert("Please fill all required fields.");
    }

    try {

      setLoading(true);

      await updateTeacher(id, form);

      alert("Teacher updated successfully.");

      navigate("/department-head/teachers");

    } catch (error) {

      alert(
        error.response?.data?.message ||
          "Failed to update teacher."
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

        <h1>Edit Teacher</h1>

      </div>

      <div className="form-card">

        <h2>Teacher Information</h2>

        {/* Name */}

        <div className="input-group">

          <label>Full Name</label>

          <div className="input-wrapper">

            <User size={18} />

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Email */}

        <div className="input-group">

          <label>Email</label>

          <div className="input-wrapper">

            <Mail size={18} />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Gender */}

        <div className="input-group">

          <label>Gender</label>

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

        </div>

        {/* Specialization */}

        <div className="input-group">

          <label>Specialization</label>

          <div className="input-wrapper">

            <Briefcase size={18} />

            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Experience */}

        <div className="input-group">

          <label>Experience</label>

          <div className="input-wrapper">

            <GraduationCap size={18} />

            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
            />

          </div>

        </div>

        {/* Course */}

        <div className="input-group">

          <label>Course</label>

          <select
            name="courseId"
            value={form.courseId}
            onChange={handleChange}
          >

            <option value="">
              Select Course
            </option>

            {courses.map((course) => (

              <option
                key={course._id}
                value={course._id}
              >
                {course.courseCode} - {course.courseName}
              </option>

            ))}

          </select>

        </div>

        {/* Status */}

        <div className="input-group">

          <label>Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>

        <button
          className="create-btn"
          onClick={handleSubmit}
          disabled={loading}
        >

          <Save size={18} />

          {loading
            ? "Updating..."
            : "Update Teacher"}

        </button>

      </div>

    </div>
  );
}