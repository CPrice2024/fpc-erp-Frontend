import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function Profile() {
  const role = localStorage.getItem("role") || "teacher";

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Profile" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">

            <h1>My Profile</h1>

            <div className="cardd">

              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="input"
              />

              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                placeholder="Email"
                className="input"
              />

              <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="input"
              />

              {/* ROLE-BASED FIELDS */}
              {role === "teacher" && (
                <input
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className="input"
                />
              )}

              {role === "admin" && (
                <div>
                  <p><strong>Role:</strong> Administrator</p>
                </div>
              )}

              {role === "support" && (
                <div>
                  <p><strong>Access Level:</strong> Support Staff</p>
                </div>
              )}

              <button className="register-btn">
                Save Profile
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}