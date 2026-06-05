import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import {
  ArrowLeft,
  Save,
  User,
  Mail,
  CheckCircle
} from "lucide-react";

import "./CreateTeacher.css";

export default function CreateTeacher() {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [credentials,
    setCredentials] =
    useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const createTeacher = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim()
    ) {
      return alert(
        "Please fill all fields"
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