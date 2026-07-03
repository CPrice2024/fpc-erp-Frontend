import { Routes, Route } from "react-router-dom";

// Authentication
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Layout
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// Common Pages
import Profile from "../components/common/Profile";
import EditProfile from "../components/common/EditProfile";
import ChangePassword from "../components/common/ChangePassword";
import Settings from "../components/common/Settings";
import Appearance from "../components/common/Appearance";

// College Head
import CHDashboard from "../pages/collegeHead/CHDashboard";
import Departments from "../pages/collegeHead/Departments";
import Reports from "../pages/collegeHead/Reports";
import CreateDepartment from "../pages/collegeHead/CreateDepartment";
import EditDepartment from "../pages/collegeHead/EditDepartment";
import ViewDepartment from "../pages/collegeHead/ViewDepartment";
import DepartmentMessages from "../pages/collegeHead/DepartmentMessages";
import Registrars from "../pages/collegeHead/Registrars";
import CreateRegistrar from "../pages/collegeHead/CreateRegistrar";
import EditRegistrar from "../pages/collegeHead/EditRegistrar";
import ViewRegistrar from "../pages/collegeHead/ViewRegistrar";

// Department Head
import DHDashboard from "../pages/departmentHead/DHDashboard";
import Teachers from "../pages/departmentHead/Teachers";
import Students from "../pages/departmentHead/Students";
import Attendance from "../pages/departmentHead/Attendance";
import Report from "../pages/departmentHead/Report";
import Courses from "../pages/departmentHead/Courses";
import CreateCourse from "../pages/departmentHead/CreateCourse";
import EditCourse from "../pages/departmentHead/EditCourse";
import ViewCourse from "../pages/departmentHead/ViewCourse";
import CreateTeacher from "../pages/departmentHead/CreateTeacher";

// Registrar
import RDashboard from "../pages/registrar/RDashboard";
import Enrollment from "../pages/registrar/Enrollment";
import StudentRecords from "../pages/registrar/StudentRecords";
import GradeReport from "../pages/registrar/GradeReport";
import ViewStudentPage from "../pages/registrar/ViewStudentPage";
import Finance from "../pages/registrar/Finance";
import RegistrarReports from "../pages/registrar/RegistrarReports";
import EditStudent from "../pages/registrar/EditStudent";
import CreatePayment from "../pages/registrar/CreatePayment";

// Teacher
import TDashboard from "../pages/teacher/TDashboard";
import MyClass from "../pages/teacher/MyClass";
import StudentAttendance from "../pages/teacher/StudentAttendance";
import GradeEntry from "../pages/teacher/GradeEntry";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ================= COMMON ROUTES (ALL LOGGED-IN USERS) ================= */}

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>

          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/appearance" element={<Appearance />} />

        </Route>
      </Route>

      {/* ================= COLLEGE HEAD ================= */}

      <Route
        path="/college-head"
        element={<ProtectedRoute allowedRoles={["college_head"]} />}
      >
        <Route element={<MainLayout />}>

          <Route index element={<CHDashboard />} />

          <Route path="departments" element={<Departments />} />
          <Route path="departments/create" element={<CreateDepartment />} />
          <Route path="departments/edit/:id" element={<EditDepartment />} />
          <Route path="departments/view/:id" element={<ViewDepartment />} />
          <Route path="departments/messages/:id" element={<DepartmentMessages />} />

          <Route path="registrars" element={<Registrars />} />
          <Route path="registrars/create" element={<CreateRegistrar />} />
          <Route path="registrars/edit/:id" element={<EditRegistrar />} />
          <Route path="registrars/view/:id" element={<ViewRegistrar />} />

          <Route path="reports" element={<Reports />} />

        </Route>
      </Route>

      {/* ================= DEPARTMENT HEAD ================= */}

      <Route
        path="/department-head"
        element={<ProtectedRoute allowedRoles={["department_head"]} />}
      >
        <Route element={<MainLayout />}>

          <Route index element={<DHDashboard />} />

          <Route path="teachers" element={<Teachers />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="report" element={<Report />} />

          <Route path="courses" element={<Courses />} />
          <Route path="courses/create" element={<CreateCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />
          <Route path="courses/view/:id" element={<ViewCourse />} />

          <Route path="create-teacher" element={<CreateTeacher />} />

        </Route>
      </Route>

      {/* ================= REGISTRAR ================= */}

      <Route
        path="/registrar"
        element={<ProtectedRoute allowedRoles={["registrar"]} />}
      >
        <Route element={<MainLayout />}>

          <Route index element={<RDashboard />} />

          <Route path="enrollment" element={<Enrollment />} />
          <Route path="enrollment/:id" element={<Enrollment />} />

          <Route path="studentRecords" element={<StudentRecords />} />
          <Route path="student-records" element={<StudentRecords />} />
          <Route path="records" element={<StudentRecords />} />

          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route path="students/view/:id" element={<ViewStudentPage />} />

          <Route path="grade-report" element={<GradeReport />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reports" element={<RegistrarReports />} />
          <Route path="createPayment" element={<CreatePayment />} />

        </Route>
      </Route>

      {/* ================= TEACHER ================= */}

      <Route
        path="/teacher"
        element={<ProtectedRoute allowedRoles={["teacher"]} />}
      >
        <Route element={<MainLayout />}>

          <Route index element={<TDashboard />} />

          <Route path="classes" element={<MyClass />} />
          <Route path="student-attendance" element={<StudentAttendance />} />
          <Route path="grades" element={<GradeEntry />} />

        </Route>
      </Route>

    </Routes>
  );
}