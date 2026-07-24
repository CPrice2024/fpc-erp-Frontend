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
import Students from "../pages/departmentHead/Students";
import Attendance from "../pages/departmentHead/Attendance";
import Report from "../pages/departmentHead/Report";
import Courses from "../pages/departmentHead/Courses";
import ViewStudent from "../pages/departmentHead/ViewStudent";
import CreateCourse from "../pages/departmentHead/CreateCourse";
import EditCourse from "../pages/departmentHead/EditCourse";
import ViewCourse from "../pages/departmentHead/ViewCourse";
import Teachers from "../pages/departmentHead/Teachers";
import CreateTeacher from "../pages/departmentHead/CreateTeacher";
import EditTeacher from "../pages/departmentHead/EditTeacher";
import ViewTeacher from "../pages/departmentHead/ViewTeacher";

// Registrar
import RDashboard from "../pages/registrar/RDashboard";
import Enrollment from "../pages/registrar/Enrollment";
import StudentRecords from "../pages/registrar/StudentRecords";
import InactiveStudents from "../pages/registrar/InactiveStudents";
import GradeReport from "../pages/registrar/GradeReport";
import ViewStudentPage from "../pages/registrar/ViewStudentPage";
import Finance from "../pages/registrar/Finance";
import RegistrarReports from "../pages/registrar/RegistrarReports";
import EditStudent from "../pages/registrar/EditStudent";
import CreatePayment from "../pages/registrar/CreatePayment";

// Teacher
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import MyCourse from "../pages/teacher/MyCourse";
import MyStudents from "../pages/teacher/MyStudents";
import StudentProfile from "../pages/teacher/StudentProfile";
import GradeEntry from "../pages/teacher/GradeEntry";
import StudentAttendance from "../pages/teacher/Attendance";
import ExamList from "../pages/teacher/exams/ExamList";
import CreateExam from "../pages/teacher/exams/CreateExam";
import EditExam from "../pages/teacher/exams/EditExam";
import QuestionList from "../pages/teacher/exams/QuestionList";
import ExamResults from "../pages/teacher/exams/ExamResults";
import PreviewQuestion from "../pages/teacher/exams/PreviewQuestion";
import PublishExam from "../pages/teacher/exams/PublishExam";
import CreateQuestion from "../pages/teacher/exams/CreateQuestion";
import EditQuestion from "../pages/teacher/exams/EditQuestion";
import ViewExamResult from "../pages/teacher/exams/ViewExamResult";


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

{/* ================= Teachers ================= */}

<Route path="teachers" element={<Teachers />} />

<Route
    path="teachers/create"
    element={<CreateTeacher />}
/>

<Route
    path="teachers/edit/:id"
    element={<EditTeacher />}
/>

<Route
    path="teachers/view/:id"
    element={<ViewTeacher />}
/>

{/* ================= Students ================= */}

<Route path="students" element={<Students />} />

<Route
    path="attendance"
    element={<Attendance />}
/>

{/* ================= Courses ================= */}

<Route
    path="courses"
    element={<Courses />}
/>

<Route
    path="courses/create"
    element={<CreateCourse />}
/>

<Route
    path="courses/edit/:id"
    element={<EditCourse />}
/>

<Route path="students/view/:id" element={<ViewStudent />} />

<Route
    path="courses/view/:id"
    element={<ViewCourse />}
/>

{/* ================= Reports ================= */}

<Route
    path="report"
    element={<Report />}
/>
<Route path="profile" element={<Profile />} />

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
          <Route path="inactive-students" element={<InactiveStudents />}/>
          <Route path="students/edit/:id" element={<EditStudent />} />
          <Route path="students/view/:id" element={<ViewStudentPage />} />
          <Route path="grade-report" element={<GradeReport />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reports" element={<RegistrarReports />} />
          <Route path="createPayment" element={<CreatePayment />} />
          <Route path="profile" element={<Profile />} />

        </Route>
      </Route>

      {/* ================= TEACHER ================= */}

      <Route path="/teacher"element={<ProtectedRoute allowedRoles={["teacher"]} />}>
      <Route element={<MainLayout />}>

    {/* Dashboard */}
    <Route index element={<TeacherDashboard />} />

    {/* Teacher Pages */}
    <Route path="my-course" element={<MyCourse />} />
    <Route path="my-students" element={<MyStudents />} />
    <Route path="attendance" element={<StudentAttendance />} />
    <Route path="reports" element={<Reports />} />
    <Route path="profile" element={<Profile />} />

    {/* Student */}
    <Route path="student/:id" element={<StudentProfile />} />
    <Route path="grades" element={<GradeEntry />} />
    <Route path="exams" element={<ExamList />} />

<Route path="exams/create" element={<CreateExam />} />

<Route path="exams/edit/:id" element={<EditExam />} />

<Route
  path="exams/:examId/questions"
  element={<QuestionList />}
/>

<Route
  path="exams/results"
  element={<ExamResults />}
/>
<Route
  path="questions/:id/preview"
  element={<PreviewQuestion />}
/>

<Route
  path="exams/:examId/publish"
  element={<PublishExam />}
/>
<Route
  path="exams/:examId/questions/create"
  element={<CreateQuestion />}
/>
<Route
  path="questions/edit/:id"
  element={<EditQuestion />}
/>
<Route
  path="exams/results/:id"
  element={<ViewExamResult />}
/>

  </Route>
</Route>

    </Routes>
  );
}