import { useState } from "react";
import axios from "axios";

import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import { useNavigate } from "react-router-dom";

export default function AddTeacher() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!form.name) newErrors.name = "Name is required";

    if (!form.email.includes("@"))
      newErrors.email = "Valid email required";

    if (!form.specialization)
      newErrors.specialization = "Required";

    if (!form.experience)
      newErrors.experience = "Required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/teachers/register",
        form
      );

      alert(res.data.message);

      navigate("/department/teachers");

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to add teacher"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Add Teacher" />

        <div className="content-wrapper">
          <div className="card">
            <h2>Add New Teacher</h2>

            <form onSubmit={handleSubmit} className="form-grid">

              <div>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />
                <p className="error">{errors.name}</p>
              </div>

              <div>
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />
                <p className="error">{errors.email}</p>
              </div>

              <div>
                <input
                  name="specialization"
                  placeholder="Specialization"
                  value={form.specialization}
                  onChange={handleChange}
                />
                <p className="error">{errors.specialization}</p>
              </div>

              <div>
                <input
                  name="experience"
                  placeholder="Experience (years)"
                  value={form.experience}
                  onChange={handleChange}
                />
                <p className="error">{errors.experience}</p>
              </div>

              <button
                className="register-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Teacher"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}