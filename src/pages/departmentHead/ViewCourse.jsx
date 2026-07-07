import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getCourse,
} from "../../api/departmentApi";

import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  User,
  Building2,
  Clock,
  Layers,
} from "lucide-react";

import "./ViewCourse.css";

export default function ViewCourse() {
  const navigate = useNavigate();

const { id } = useParams();

const [course, setCourse] = useState(null);

const [loading, setLoading] =
useState(true);

 useEffect(() => {

  fetchCourse();

}, []);

const fetchCourse = async () => {

  try {

    const { data } =
      await getCourse(id);

    setCourse(data);

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to load course"
    );

  } finally {

    setLoading(false);

  }

};



  if (loading) {
    return (
      <div className="view-course-page">
        <div className="page-loader">
          <div className="loading-spinner"></div>
          <p>Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="view-course-page">
        <div className="page-loader">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (

<div className="view-course-page">

<div className="page-header">

<button
className="back-btn"
onClick={() => navigate(-1)}
>

<ArrowLeft size={18}/>

Back

</button>

<div>
  <h1>Course Details</h1>
  <p>View complete information about this course.</p>
</div>

</div>
<div className="course-card">

<div className="course-title">

<div className="course-avatar">
  <BookOpen size={40} />
</div>

<div>

<h2>

{course.courseName}

</h2>

<p>

{course.courseCode}

</p>

</div>

</div>
<div className="details-grid">
  <div className="detail-item">

<Building2 size={18} />

<div>

<label>Department</label>

<p>

{course.department?.name || "N/A"}

</p>

</div>

</div>
<div className="detail-item">

<User size={18} />

<div>

<label>Teacher</label>

<div>
  <label>Teacher</label>

  {course.teacher ? (
    <>
      <p>{course.teacher.name}</p>
      <small>{course.teacher.email}</small>
    </>
  ) : (
    <p>Not Assigned</p>
  )}
</div>

</div>

</div>
<div className="detail-item">

<Layers size={18} />

<div>

<label>Level</label>

<p>

{course.level}

</p>

</div>

</div>
<div className="detail-item">

<GraduationCap size={18} />

<div>

<label>Semester</label>

<p>

{course.semester}

</p>

</div>

</div>
<div className="detail-item">

<BookOpen size={18} />

<div>

<label>Section</label>

<p>

{course.section}

</p>

</div>

</div>
<div className="detail-item">

<Clock size={18} />

<div>

<label>Credit Hour</label>

<p>

{course.creditHour}

</p>

</div>

</div>
<div className="detail-item">

<label>Status</label>

<p>

<span
  className={`status-badge ${
    course.status === "active"
      ? "active"
      : "inactive"
  }`}
>
  {course.status === "active"
    ? "Active"
    : "Inactive"}
</span>

</p>

</div>
<div className="detail-item">

<label>Created</label>

<p>

{course.createdAt
  ? new Date(course.createdAt).toLocaleDateString()
  : "N/A"}

</p>

</div>
</div>

</div>
<div className="page-actions">

  <button
    className="edit-btn"
    onClick={() =>
      navigate(
        `/department-head/courses/edit/${course._id}`
      )
    }
  >
    Edit Course
  </button>

</div>

</div>

);
}