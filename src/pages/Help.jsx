import React from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";

export default function Help() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Help & Support" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">

            <h1>Help Center</h1>

            <div className="card">
              <h3>📌 How to Register Student?</h3>
              <p>Go to Students → Click Register → Fill form → Save</p>
            </div>

            <div className="card">
              <h3>📌 How to Take Attendance?</h3>
              <p>Select class → Mark status → Click Save</p>
            </div>

            <div className="card">
              <h3>📌 Contact Support</h3>
              <p>Email: support@system.com</p>
              <p>Phone: +251 900 000000</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}