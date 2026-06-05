import React from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function Settings() {
  const role = localStorage.getItem("role") || "teacher";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Settings" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">

            <h1>System Settings</h1>
            <p>Manage system configuration</p>

            {/* COMMON SETTINGS */}
            <div className="card">
              <h3>General Settings</h3>
              <input placeholder="System Name" />
              <input placeholder="Organization Name" />
            </div>

            {/* ADMIN ONLY */}
            {role === "admin" && (
              <div className="card">
                <h3>Admin Controls</h3>
                <label>
                  <input type="checkbox" /> Enable User Registration
                </label>
                <label>
                  <input type="checkbox" /> Enable Reports Access
                </label>
              </div>
            )}

            {/* TEACHER SETTINGS */}
            {role === "teacher" && (
              <div className="card">
                <h3>Teacher Preferences</h3>
                <label>
                  <input type="checkbox" /> Auto Attendance Save
                </label>
                <label>
                  <input type="checkbox" /> Show Notifications
                </label>
              </div>
            )}

            {/* SUPPORT ROLE */}
            {role === "support" && (
              <div className="card">
                <h3>Support Settings</h3>
                <label>
                  <input type="checkbox" /> Enable Offline Mode
                </label>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}