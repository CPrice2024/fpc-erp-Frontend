import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTeachers,
  deleteTeacher,
} from "../../api/departmentAPI";

import {
  Plus,
  Trash2,
  Eye,
  Edit,
  Search,
  MoreVertical,
} from "lucide-react";

import "./Teachers.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data } = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      alert("Failed to load teachers");
    }
  };


  const filteredTeachers = teachers.filter(
  (teacher) =>
    teacher.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    teacher.email
      .toLowerCase()
      .includes(search.toLowerCase())
);
const handleDeleteTeacher = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this teacher?"
  );

  if (!confirmDelete) return;

  try {
    await deleteTeacher(id);

    fetchTeachers();

    alert("Teacher deleted successfully");
  } catch (error) {
    console.error("Delete teacher error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to delete teacher"
    );
  }
};

  return (
    <>
      <div className="teacher-page">

  <div className="teacher-top">

    <div>
      <h1>Department Teachers</h1>
      <p>
        Manage teachers assigned
        to your department
      </p>
    </div>

<button
  className="add-btn"
  onClick={() => navigate("/department-head/teachers/create")}
>
  <Plus size={18} />
  Add Teacher
</button>

  </div>

  <div className="stats-grid">

    <div className="stat-card">
      <h2>{teachers.length}</h2>
      <p>Total Teachers</p>
    </div>

    <div className="stat-card">
      <h2>
        {
          teachers.filter(
            (t) => t.status === "active"
          ).length
        }
      </h2>
      <p>Active Teachers</p>
    </div>

  </div>

  <div className="table-card">

    <div className="table-header">
      <div className="search-box">

    <Search size={18} />

    <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
    />

</div>

    </div>

    <table>

      <thead>
  <tr>
    <th>Name</th>
    <th>Email</th>
    <th>Gender</th>
    <th>Specialization</th>
    <th>Experience</th>
    <th>Course</th>
    <th>Department</th>
    <th>Status</th>
    <th>Action</th>
  </tr>
</thead>

      <tbody>

        {filteredTeachers.length > 0 ? (

          filteredTeachers.map(
            (teacher) => (
              <tr key={teacher._id}>
  <td>{teacher.name}</td>

  <td>{teacher.email}</td>

  <td>
    <span className="gender-badge">
      {teacher.gender || "N/A"}
    </span>
  </td>
  <td>
  {teacher.specialization || "-"}
</td>
<td>
  {teacher.experience || 0} Years
</td>

  <td>
        {teacher.course
    ? `${teacher.course.courseCode} - ${teacher.course.courseName}`
    : "Not Assigned"}
  </td>

  <td>
    <span className="dept-badge">
      {teacher.department?.name ||
        "N/A"}
    </span>
  </td>

  <td>
    <span
      className={`status-badge ${
        teacher.status || "active"
      }`}
    >
      {teacher.status || "active"}
    </span>
  </td>

<td className="action-cell">

  <button
    className="menu-btn"
    onClick={() =>
      setActiveMenu(
        activeMenu === teacher._id
          ? null
          : teacher._id
      )
    }
  >
    <MoreVertical size={18} />
  </button>

  {activeMenu === teacher._id && (

    <div className="action-menu">

      <button
        className="view-action"
        onClick={() => {
          navigate(
            `/department-head/teachers/view/${teacher._id}`
          );
          setActiveMenu(null);
        }}
      >
        <Eye size={16}/>
        View Teacher
      </button>

      <button
        className="edit-action"
        onClick={() => {
          navigate(
            `/department-head/teachers/edit/${teacher._id}`
          );
          setActiveMenu(null);
        }}
      >
        <Edit size={16}/>
        Edit Teacher
      </button>

      <button
        className="delete-action"
        onClick={() => {
          handleDeleteTeacher(teacher._id);
          setActiveMenu(null);
        }}
      >
        <Trash2 size={16}/>
        Delete Teacher
      </button>

    </div>

  )}

</td>
</tr>
            )
          )

        ) : (

          <tr>
           <td
  colSpan="9"
  className="empty-row"
>
              No teachers found
            </td>
          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>
    </>
  );
}