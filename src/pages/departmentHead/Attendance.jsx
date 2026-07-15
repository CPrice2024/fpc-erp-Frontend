import { useEffect, useState } from "react";
import {
  Search,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
} from "lucide-react";

import {
  getTeacherAttendance,
  getTeacherAttendanceStats,
  saveTeacherAttendance,
} from "../../api/departmentApi";

import "./attendance.css";

export default function Attendance() {

  const [teachers, setTeachers] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const [stats, setStats] = useState({
    totalTeachers: 0,
    present: 0,
    absent: 0,
    late: 0,
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {

    try {

      const [
        teacherRes,
        statsRes,
      ] = await Promise.all([
        getTeacherAttendance(),
        getTeacherAttendanceStats(),
      ]);

      setTeachers(teacherRes.data);

      setStats(statsRes.data);

    } catch (error) {

      console.error(error);

      alert("Failed to load attendance.");

    } finally {

      setLoading(false);

    }

  };

  const handleAttendance = async (teacherId, status) => {
  try {
    await saveTeacherAttendance({
      teacherId,
      status,
    });

    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher._id === teacherId
          ? {
              ...teacher,
              attendanceStatus: status,
            }
          : teacher
      )
    );

    setStats((prev) => {
      const teachersUpdated = teachers.map((teacher) =>
        teacher._id === teacherId
          ? {
              ...teacher,
              attendanceStatus: status,
            }
          : teacher
      );

      return {
        totalTeachers: teachersUpdated.length,
        present: teachersUpdated.filter(
          (t) => t.attendanceStatus === "present"
        ).length,
        late: teachersUpdated.filter(
          (t) => t.attendanceStatus === "late"
        ).length,
        absent: teachersUpdated.filter(
          (t) => t.attendanceStatus === "absent"
        ).length,
      };
    });

  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Unable to save attendance."
    );
  }
};

  const filteredTeachers =
    teachers.filter((teacher) => {

      const keyword =
        search.toLowerCase();

      return (

        teacher.name
          ?.toLowerCase()
          .includes(keyword)

        ||

        teacher.email
          ?.toLowerCase()
          .includes(keyword)

        ||

        teacher.specialization
          ?.toLowerCase()
          .includes(keyword)

      );

    });

  if (loading) {

    return (
      <div className="attendance-page">

        <div className="page-loader">

          <div className="loading-spinner"></div>

          <p>Loading...</p>

        </div>

      </div>
    );

  }

  return (

<div className="attendance-page">

<div className="attendance-top">

    <div>

        <h1>Teacher Attendance</h1>

        <p>
            {new Date().toLocaleDateString()}
        </p>

    </div>

</div>

<div className="stats-grid">

<div className="stat-card">

<Users size={28}/>

<h2>

{stats.totalTeachers}

</h2>

<p>

Teachers

</p>

</div>

<div className="stat-card">

<CheckCircle size={28}/>

<h2>

{stats.present}

</h2>

<p>

Present

</p>

</div>

<div className="stat-card">

<Clock size={28}/>

<h2>

{stats.late}

</h2>

<p>

Late

</p>

</div>

<div className="stat-card">

<XCircle size={28}/>

<h2>

{stats.absent}

</h2>

<p>

Absent

</p>

</div>

</div>

<div className="table-card">

<div className="table-header">

<div className="search-box">

<Search size={18}/>

<input
type="text"
placeholder="Search teacher..."
value={search}
onChange={(e)=>
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

<th>Course</th>

<th>Status</th>

<th>Attendance</th>

</tr>

</thead>

<tbody>

{filteredTeachers.length>0 ? (

filteredTeachers.map((teacher)=>(

<tr key={teacher._id}>

<td>

<div className="teacher-info">

<img
src={
teacher.photo || "/avatar.png"
}
alt=""
className="teacher-photo"
/>

<div>

<strong>{teacher.name}</strong>

<p>{teacher.specialization}</p>

</div>

</div>

</td>

<td>

{teacher.email}

</td>

<td>

{teacher.course
? `${teacher.course.courseCode} - ${teacher.course.courseName}`
: "Not Assigned"}

</td>

<td>

<span
className={`status-badge ${teacher.attendanceStatus}`}
>

{teacher.attendanceStatus}

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

<MoreVertical size={18}/>

</button>

{activeMenu === teacher._id && (

<div className="action-menu">

<button
className="present-action"
onClick={()=>{
handleAttendance(
teacher._id,
"present"
);
setActiveMenu(null);
}}
>

<CheckCircle size={16}/>
Mark Present

</button>

<button
className="late-action"
onClick={()=>{
handleAttendance(
teacher._id,
"late"
);
setActiveMenu(null);
}}
>

<Clock size={16}/>
Mark Late

</button>

<button
className="absent-action"
onClick={()=>{
handleAttendance(
teacher._id,
"absent"
);
setActiveMenu(null);
}}
>

<XCircle size={16}/>
Mark Absent

</button>

</div>

)}

</td>

</tr>

))

):(

<tr>

<td
colSpan="5"
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

  );

}