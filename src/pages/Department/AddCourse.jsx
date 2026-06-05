import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import { useNavigate } from "react-router-dom";

export default function AddCourse() {
  const navigate = useNavigate();

  const teachers = [
    { id: "T001", name: "Dr. Abebe Kebede" },
    { id: "T002", name: "Prof. Tigist Haile" },
  ];

  const [form, setForm] = useState({
    name: "",
    code: "",
    credit: "",
    semester: "",
    teacherId: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Required";
    if (!form.code) err.code = "Required";
    if (!form.credit) err.credit = "Required";
    if (!form.teacherId) err.teacherId = "Assign teacher";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Course:", form);

    alert("Course Created Successfully");
    navigate("/department/courses");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-area">
        <Topbar title="Add Course" />

        <div className="content-wrapper">
          <div className="card">
            <h2>Create Course</h2>

            <form onSubmit={handleSubmit} className="form-grid">

              <div>
                <input
                  name="name"
                  placeholder="Course Name"
                  onChange={handleChange}
                />
                <p className="error">{errors.name}</p>
              </div>

              <div>
                <input
                  name="code"
                  placeholder="Course Code"
                  onChange={handleChange}
                />
                <p className="error">{errors.code}</p>
              </div>

              <div>
                <input
                  name="credit"
                  placeholder="Credit Hours"
                  onChange={handleChange}
                />
                <p className="error">{errors.credit}</p>
              </div>

              <div>
                <input
                  name="semester"
                  placeholder="Semester"
                  onChange={handleChange}
                />
              </div>

              {/* Assign Teacher */}
              <div>
                <select name="teacherId" onChange={handleChange}>
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <p className="error">{errors.teacherId}</p>
              </div>

              <button className="register-btn">Save Course</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}