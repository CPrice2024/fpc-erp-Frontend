import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();

  const teachers = [
    {
      id: "T001",
      name: "Dr. Abebe Kebede",
      email: "abebe@example.com",
      specialization: "AI",
      experience: "10 years",
    },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
  });

  useEffect(() => {
    const t = teachers.find((x) => x.id === id);
    if (t) setForm(t);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Teacher:", form);
    alert("Teacher Updated");
    navigate("/department/teachers");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-area">
        <Topbar title="Edit Teacher" />

        <div className="content-wrapper">
          <div className="card">
            <h2>Edit Teacher</h2>

            <form onSubmit={handleSubmit} className="form-grid">
              <input name="name" value={form.name} onChange={handleChange} />
              <input name="email" value={form.email} onChange={handleChange} />
              <input name="specialization" value={form.specialization} onChange={handleChange} />
              <input name="experience" value={form.experience} onChange={handleChange} />

              <button className="register-btn">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}