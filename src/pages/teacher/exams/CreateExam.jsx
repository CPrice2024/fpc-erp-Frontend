import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  FileText,
  Settings,
  Calendar,
} from "lucide-react";

import { createExam } from "../../../api/examAPI";
import api from "../../../api/axios";

import "../../../styles/exams/CreateExam.css";

export default function CreateExam() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [course, setCourse] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",

    course: "",
    department: "",

    examType: "Mid",

    duration: 90,

    totalMarks: 100,

    passMark: 50,

    startTime: "",

    endTime: "",

    instruction: "",

    shuffleQuestions: true,

    shuffleOptions: true,

    showResult: false,

    allowReview: true,

    allowNavigation: true,

    negativeMarking: false,

    negativeValue: 0,

    status: "Draft",
  });

  useEffect(() => {
    loadTeacherCourse();
  }, []);

const loadTeacherCourse = async () => {
  try {
    const { data } = await api.get("/teacher/my-course");

    setCourse(data);

    setForm((prev) => ({
      ...prev,
      course: data._id,
      department: data.department,
    }));
  } catch (error) {
    console.error(error);
  }
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.title.trim()) {
    return alert("Exam title is required.");
  }

  if (Number(form.passMark) > Number(form.totalMarks)) {
    return alert("Pass mark cannot exceed total marks.");
  }

  if (new Date(form.startTime) >= new Date(form.endTime)) {
    return alert("End time must be after start time.");
  }

  try {
    setLoading(true);

    const exam = await createExam(form);

    alert("Exam created successfully.");

    navigate(`/teacher/exams/${exam._id}/questions`);

  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Unable to create exam."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="create-exam-page">

      <div className="page-header">

        <button
          className="upload-btnn"
          onClick={() =>
            navigate("/teacher/exams")
          }
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1>Create Digital Examination</h1>

      </div>

      <form
        className="exam-form"
        onSubmit={handleSubmit}
      >

        {/* Exam Information */}

        <div className="form-card">

          <h2>
            <FileText size={18} />
            Exam Information
          </h2>

          <div className="grid">

            <div>

              <label>Exam Title</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />

            </div>

            <div>

              <label>Exam Type</label>

              <select
                name="examType"
                value={form.examType}
                onChange={handleChange}
              >
                <option>Quiz</option>
                <option>Mid</option>
                <option>Final</option>
              </select>

            </div>

            <div className="full">

              <label>Description</label>

              <textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />

            </div>

            <div>

              <label>Course</label>

              <input
                value={
                  course
                    ? `${course.courseCode} - ${course.courseName}`
                    : ""
                }
                readOnly
              />

            </div>

            <div>

              <label>Duration (Minutes)</label>

              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
              />

            </div>

            <div>

              <label>Total Marks</label>

              <input
                type="number"
                name="totalMarks"
                value={form.totalMarks}
                onChange={handleChange}
              />

            </div>

            <div>

              <label>Pass Mark</label>

              <input
                type="number"
                name="passMark"
                value={form.passMark}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* Schedule */}

        <div className="form-card">

          <h2>
            <Calendar size={18} />
            Schedule
          </h2>

          <div className="grid">

            <div>

              <label>Start Time</label>

              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
              />

            </div>

            <div>

              <label>End Time</label>

              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
              />

            </div>

            <div className="full">

              <label>Instructions</label>

              <textarea
                rows={4}
                name="instruction"
                value={form.instruction}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* Settings */}

        <div className="form-card">

          <h2>
            <Settings size={18} />
            Settings
          </h2>

          <div className="checkbox-grid">

            <label>
              <input
                type="checkbox"
                name="shuffleQuestions"
                checked={form.shuffleQuestions}
                onChange={handleChange}
              />
              Shuffle Questions
            </label>

            <label>
              <input
                type="checkbox"
                name="shuffleOptions"
                checked={form.shuffleOptions}
                onChange={handleChange}
              />
              Shuffle Options
            </label>

            <label>
              <input
                type="checkbox"
                name="allowReview"
                checked={form.allowReview}
                onChange={handleChange}
              />
              Allow Review
            </label>

            <label>
              <input
                type="checkbox"
                name="allowNavigation"
                checked={form.allowNavigation}
                onChange={handleChange}
              />
              Allow Navigation
            </label>

            <label>
              <input
                type="checkbox"
                name="showResult"
                checked={form.showResult}
                onChange={handleChange}
              />
              Show Result Immediately
            </label>

            <label>
              <input
                type="checkbox"
                name="negativeMarking"
                checked={form.negativeMarking}
                onChange={handleChange}
              />
              Negative Marking
            </label>

          </div>

          {form.negativeMarking && (
            <div style={{ marginTop: 20 }}>

              <label>Negative Value</label>

              <input
                type="number"
                name="negativeValue"
                value={form.negativeValue}
                onChange={handleChange}
              />

            </div>
          )}

        </div>

        {/* Status */}

        <div className="form-card">

          <h2>Status</h2>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Draft</option>
            <option>Published</option>
          </select>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="upload-btnn"
            onClick={() =>
              navigate("/teacher/exams")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="upload-btnn"
            disabled={loading}
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : "Save & Continue"}
          </button>

        </div>

      </form>
    </div>
  );
}