// AppRoutes.jsx
import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

import CHDashboard from "../pages/collegeHead/CHDashboard";
import Departments from "../pages/collegeHead/Departments";
import Reports from "../pages/collegeHead/Reports";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import DHDashboard from "../pages/departmentHead/DHDashboard";
import Teachers from "../pages/departmentHead/Teachers";
import Students from "../pages/departmentHead/Students";
import Courses from "../pages/departmentHead/Courses";
import Attendance from "../pages/departmentHead/Attendance";
import Report from "../pages/departmentHead/Report";
import CreateTeacher from "../pages/departmentHead/CreateTeacher";

import RDashboard from "../pages/registrar/RDashboard";
import Enrollment from "../pages/registrar/Enrollment";
import StudentRecords from "../pages/registrar/StudentRecords";
import GradeReport from "../pages/registrar/GradeReport";
import Finance from "../pages/registrar/Finance";
import RegistrarReports from "../pages/registrar/RegistrarReports";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* PROTECTED COLLEGE HEAD */}
      <Route
        path="/college-head"
        element={<ProtectedRoute allowedRoles={["college_head"]} />}
      >
        <Route element={<MainLayout />}>
          <Route index element={<CHDashboard />} />
          <Route path="departments" element={<Departments />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      {/* PROTECTED DEPARTMENT HEAD */}
      <Route
        path="/department-head"
        element={<ProtectedRoute allowedRoles={["department_head"]} />}
      >
        <Route element={<MainLayout />}>
          <Route index element={<DHDashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<Courses />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="report" element={<Report />} />
          <Route path="create-teacher" element={<CreateTeacher />} />
        </Route>
      </Route>

      {/* PROTECTED REGISTRAR */}
      <Route
        path="/registrar"
        element={<ProtectedRoute allowedRoles={["registrar"]} />}
      >
        <Route element={<MainLayout />}>
          <Route index element={<RDashboard />} />
          <Route path="enrollment" element={<Enrollment />} />
          
          {/* Add both route variations for flexibility */}
          <Route path="studentRecords" element={<StudentRecords />} />
          <Route path="records" element={<StudentRecords />} />  {/* Added this line */}
          <Route path="student-records" element={<StudentRecords />} />  {/* Also add kebab-case */}
          <Route path="reports" element={<RegistrarReports />} />
          <Route path="grade-report" element={<GradeReport />} />
          <Route path="finance" element={<Finance />} />
        </Route>
      </Route>
    </Routes>
  );
}