import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

export default function RegisterStudent() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ===============================
     Detect Mode
     /students/register        => Add New
     /students/edit/:id        => Edit
     /students/view/:id        => View
  =============================== */

  const pathname = location.pathname;

  const isEdit = pathname.includes("/students/edit/");
  const isView = pathname.includes("/students/view/");

  const pageTitle = isView
    ? "View Student"
    : isEdit
    ? "Edit Student"
    : "Register Student";

  const buttonTitle = isView
    ? "Back"
    : isEdit
    ? "Update"
    : "Save";

  /* ===============================
     Form State
  =============================== */

  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    studentName: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dob: "",
    nationality: "",

    institution: "",
    academicYear: "",
    department: "",
    batch: "",

    phone: "",
    email: "",
    region: "",
    city: "",

    prison: "",
    cell: "",
    sentence: "",
  });

  const [photo, setPhoto] = useState(null);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (isView) {
      navigate("/students");
      return;
    }

    if (isEdit) {
      alert("Student Updated Successfully");
      navigate("/students");
      return;
    }

    alert("Student Saved Successfully");
    navigate("/students");
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title={pageTitle} />

        <div className="teacher-dashboard">
          {/* Header */}
          <div className="dashboard-header">
            <h1>{pageTitle}</h1>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="register-btn"
                style={{ background: "#ef4444" }}
                onClick={() => navigate("/teacher/students")}
              >
                Cancel
              </button>

              <button className="register-btn" onClick={handleSubmit}>
                {buttonTitle}
              </button>
            </div>
          </div>

          {/* Form Card */}
          <div className="card">
            {/* Tabs */}
            <div className="tabs">
              <button
                onClick={() => setActiveTab("personal")}
                className={activeTab === "personal" ? "active" : ""}
              >
                Personal Information
              </button>

              <button
                onClick={() => setActiveTab("education")}
                className={activeTab === "education" ? "active" : ""}
              >
                Education Details
              </button>

              <button
                onClick={() => setActiveTab("contact")}
                className={activeTab === "contact" ? "active" : ""}
              >
                Contact Information
              </button>

              <button
                onClick={() => setActiveTab("inmate")}
                className={activeTab === "inmate" ? "active" : ""}
              >
                Inmate Details
              </button>
            </div>

            {/* Photo */}
            <div className="photo-section">
              <label className="photo-box">
                {photo ? (
                  <img src={photo} alt="student" />
                ) : (
                  <span>Upload Photo</span>
                )}

                {!isView && (
                  <input type="file" hidden onChange={handlePhoto} />
                )}
              </label>
            </div>

            {/* PERSONAL */}
            {activeTab === "personal" && (
              <div className="form-grid">
                <input
                  name="studentName"
                  placeholder="Student Name"
                  value={formData.studentName}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="fatherName"
                  placeholder="Father Name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="motherName"
                  placeholder="Mother Name"
                  value={formData.motherName}
                  onChange={handleChange}
                  disabled={isView}
                />

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={isView}
                >
                  <option value="">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>

                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="nationality"
                  placeholder="Nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  disabled={isView}
                />
              </div>
            )}

            {/* EDUCATION */}
            {activeTab === "education" && (
              <div className="form-grid">
                <input
                  name="institution"
                  placeholder="Institution Name"
                  value={formData.institution}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="academicYear"
                  placeholder="Academic Year"
                  value={formData.academicYear}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="department"
                  placeholder="Department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="batch"
                  placeholder="Batch Number"
                  value={formData.batch}
                  onChange={handleChange}
                  disabled={isView}
                />
              </div>
            )}

            {/* CONTACT */}
            {activeTab === "contact" && (
              <div className="form-grid">
                <input
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="region"
                  placeholder="Region"
                  value={formData.region}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isView}
                />
              </div>
            )}

            {/* INMATE */}
            {activeTab === "inmate" && (
              <div className="form-grid">
                <input
                  name="prison"
                  placeholder="Prison Name"
                  value={formData.prison}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="cell"
                  placeholder="Cell Number"
                  value={formData.cell}
                  onChange={handleChange}
                  disabled={isView}
                />

                <input
                  name="sentence"
                  placeholder="Sentence Years"
                  value={formData.sentence}
                  onChange={handleChange}
                  disabled={isView}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}