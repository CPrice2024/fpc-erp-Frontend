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
import CreateDepartment from "../pages/collegeHead/CreateDepartment";
import EditDepartment from "../pages/collegeHead/EditDepartment";
import ViewDepartment from "../pages/collegeHead/ViewDepartment";
import DepartmentMessages from "../pages/collegeHead/DepartmentMessages";
import Registrars from "../pages/collegeHead/Registrars";
import CreateRegistrar from "../pages/collegeHead/CreateRegistrar";
import EditRegistrar from "../pages/collegeHead/EditRegistrar";
import ViewRegistrar from "../pages/collegeHead/ViewRegistrar";

import DHDashboard from "../pages/departmentHead/DHDashboard";
import Teachers from "../pages/departmentHead/Teachers";
import Students from "../pages/departmentHead/Students";
import Attendance from "../pages/departmentHead/Attendance";
import Report from "../pages/departmentHead/Report";
import CreateTeacher from "../pages/departmentHead/CreateTeacher";
import Courses from "../pages/departmentHead/Courses";
import CreateCourse from "../pages/departmentHead/CreateCourse";
import EditCourse from "../pages/departmentHead/EditCourse";
import ViewCourse from "../pages/departmentHead/ViewCourse";

import RDashboard from "../pages/registrar/RDashboard";
import Enrollment from "../pages/registrar/Enrollment";
import StudentRecords from "../pages/registrar/StudentRecords";
import GradeReport from "../pages/registrar/GradeReport";
import ViewStudentPage from "../pages/registrar/ViewStudentPage";
import Finance from "../pages/registrar/Finance";
import RegistrarReports from "../pages/registrar/RegistrarReports";
import ViewStudent from "../pages/registrar/ViewStudent";
import EditStudent from "../pages/registrar/EditStudent";
import CreatePayment from "../pages/registrar/CreatePayment";


import TDashboard from "../pages/teacher/TDashboard";
import MyClass from "../pages/teacher/MyClass";
import StudentAttendance from "../pages/teacher/StudentAttendance";
import GradeEntry from "../pages/teacher/GradeEntry";


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

    {/* Departments */}
    <Route
      path="departments"
      element={<Departments />}
    />

    <Route
      path="departments/create"
      element={<CreateDepartment />}
    />

    <Route
      path="departments/edit/:id"
      element={<EditDepartment />}
    />

    <Route
      path="departments/view/:id"
      element={<ViewDepartment />}
    />

    <Route
      path="departments/messages/:id"
      element={<DepartmentMessages />}
    />

    <Route
      path="reports"
      element={<Reports />}
    />
    <Route
  path="registrars"
  element={<Registrars />}
/>

<Route
  path="registrars/create"
  element={<CreateRegistrar />}
/>

<Route
  path="registrars/edit/:id"
  element={<EditRegistrar />}
/>

<Route
  path="registrars/view/:id"
  element={<ViewRegistrar />}
/>
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
          <Route path="courses" element={<Courses />} /><Route
  path="courses/create"
  element={<CreateCourse />}
/>

<Route
  path="courses/edit/:id"
  element={<EditCourse />}
/>

<Route
  path="courses/view/:id"
  element={<ViewCourse />}
/>
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
          <Route path="enrollment" element={<Enrollment />}/>

<Route
  path="enrollment/:id"
  element={<Enrollment />}
/>
          
          {/* Add both route variations for flexibility */}
          <Route path="studentRecords" element={<StudentRecords />} />
          <Route path="records" element={<StudentRecords />} />  
          <Route path="student-records" element={<StudentRecords />} />  
          <Route path="reports" element={<RegistrarReports />} />
          <Route path="students/Edit/:id" element={<EditStudent />}/>
          <Route path="createPayment" element={<CreatePayment />}/>
          <Route path="create-teacher" element={<CreateTeacher />} />
          <Route path="grade-report" element={<GradeReport />} />
          <Route path="students/view/:id" element={<ViewStudentPage />} />
          <Route path="finance" element={<Finance />} />
        </Route>
      </Route>

      {/* PROTECTED TEACHER */}
      <Route
        path="/teacher"
        element={<ProtectedRoute allowedRoles={["teacher"]} />} 
      >
        <Route element={<MainLayout />}>
          <Route index element={<TDashboard />} />
          {/* Teacher-specific routes can be added here */}
        </Route>
        <Route
  path="/teacher"
  element={<ProtectedRoute allowedRoles={["teacher"]} />}
>
  <Route element={<MainLayout />}>
    <Route index element={<TDashboard />} />

    <Route
      path="classes"
      element={<MyClass />}
    />

    <Route
      path="student-attendance"
      element={< StudentAttendance/>}
    />

    <Route
      path="grades"
      element={<GradeEntry />}
    />
  </Route>
</Route>
      </Route>    
    </Routes>
  );
}