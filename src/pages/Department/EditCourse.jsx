import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const teachers = [
    { id: "T001", name: "Dr. Abebe Kebede" },
    { id: "T002", name: "Prof. Tigist Haile" },
  ];

  const courses = [
    {
      id: "C001",
      name: "Intro to Programming",
      code: "CS101",
      teacherId: "T001",
      credit: 3,
    },
  ];

  const [form, setForm] = useState({
    name: "",
    code: "",
    credit: "",
    teacherId: "",
  });

  useEffect(() => {
    const c = courses.find((x) => x.id === id);
    if (c) setForm(c);
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Course:", form);
    alert("Course Updated");
    navigate("/department/courses");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-area">
        <Topbar title="Edit Course" />

        <div className="content-wrapper">
          <div className="card">
            <h2>Edit Course</h2>

            <form onSubmit={handleSubmit} className="form-grid">
              <input name="name" value={form.name} onChange={handleChange} />
              <input name="code" value={form.code} onChange={handleChange} />
              <input name="credit" value={form.credit} onChange={handleChange} />

              <select name="teacherId" value={form.teacherId} onChange={handleChange}>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              <button className="register-btn">Update</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}