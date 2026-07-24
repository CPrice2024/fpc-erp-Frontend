import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCourses,
  getCourseStats,
  deleteCourse,
} from "../../api/departmentApi";

import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  BookOpen,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import "./Courses.css";

const Courses = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);

const [courses, setCourses] = useState([]);

const [stats, setStats] = useState({
  totalCourses: 0,
  assignedCourses: 0,
  unassignedCourses: 0,
});

const [search, setSearch] = useState("");
  


useEffect(() => {
  fetchCourses();
}, []);

const fetchCourses = async () => {
  try {

    const [
      coursesRes,
      statsRes,
    ] = await Promise.all([
      getCourses(),
      getCourseStats(),
    ]);

    setCourses(coursesRes.data);
    setStats(statsRes.data);

  } catch (error) {

    console.error(error);

    alert("Failed to load courses");

  }
};
const handleDeleteCourse = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this course?"
  );

  if (!confirmDelete) return;

  try {

    await deleteCourse(id);

    fetchCourses();

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Delete failed"
    );

  }

};
const filteredCourses = courses.filter((course) => {
  const keyword = search.toLowerCase();

  return (
    course.courseCode?.toLowerCase().includes(keyword) ||
    course.courseName?.toLowerCase().includes(keyword) ||
    course.teacher?.name?.toLowerCase().includes(keyword)
  );
});



  return (
    <div className="course-management">
      {/* Header */}
      <div className="course-top">

  <div>

    <h1>Department Courses</h1>

    <p>
      Manage all courses in your department
    </p>

  </div>

  <button
    className="upload-btnn"
    onClick={() =>
      navigate("/department-head/courses/create")
    }
  >

    <Plus size={18} />

    Add Course

  </button>

</div>

      {/* Analytics Cards */}
      <div className="stats-grid">

  <div className="stat-card">

    <BookOpen size={26} />

    <h2>{stats.totalCourses}</h2>

    <p>Total Courses</p>

  </div>

  <div className="stat-card">

    <CheckCircle size={26} />

    <h2>{stats.assignedCourses}</h2>

    <p>Assigned</p>

  </div>

  <div className="stat-card">

    <AlertCircle size={26} />

    <h2>{stats.unassignedCourses}</h2>

    <p>Unassigned</p>

  </div>

</div>


      {/* Search and Filters */}
      <div className="table-header">

  <div className="search-box">

    <Search size={18} />

    <input
      type="text"
      placeholder="Search course..."
      value={search}
      onChange={(e) =>
        setSearch(e.target.value)
      }
    />

  </div>

</div>
<div className="table-container-course">

  <table className="courses-table">

    <thead>
      <tr>
        <th>Code</th>
        <th>Course</th>
        <th>Teacher</th>
        <th>Level</th>
        <th>Semester</th>
        <th>Section</th>
        <th>nominalDuration</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>

      {filteredCourses.length > 0 ? (

        filteredCourses.map((course) => (

          <tr key={course._id}>

            <td>{course.courseCode}</td>

            <td>{course.courseName}</td>

            <td>
              {course.teacher?.name || "Unassigned"}
            </td>

            <td>{course.level}</td>

            <td>{course.semester}</td>

            <td>{course.section}</td>

            <td>{course.nominalDuration}</td>

            <td className="action-cell">

  <button
    className="menu-btn"
    onClick={() =>
      setActiveMenu(
        activeMenu === course._id
          ? null
          : course._id
      )
    }
  >
    <MoreVertical size={18} />
  </button>

  {activeMenu === course._id && (

    <div className="action-menu">

      <button
        onClick={() => {
          navigate(
            `/department-head/courses/view/${course._id}`
          );
          setActiveMenu(null);
        }}
      >
        <Eye size={16} />
        View
      </button>

      <button
        onClick={() => {
          navigate(
            `/department-head/courses/edit/${course._id}`
          );
          setActiveMenu(null);
        }}
      >
        <Edit size={16} />
        Edit
      </button>

      <button
        className="delete-action"
        onClick={() => {
          handleDeleteCourse(course._id);
          setActiveMenu(null);
        }}
      >
        <Trash2 size={16} />
        Delete
      </button>

    </div>

  )}

</td>

          </tr>

        ))

      ) : (

        <tr>

          <td colSpan="8" className="empty-row">
            No courses found
          </td>

        </tr>

      )}

    </tbody>

  </table>

</div>
    </div>
  );
};

export default Courses;