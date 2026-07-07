import { useEffect, useState } from "react";
import {
  Search,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import {
  getTeacherAttendance,
  getTeacherAttendanceStats,
  saveTeacherAttendance,
} from "../../api/departmentApi";

import "./attendance.css";

export default function Attendance() {

  const [teachers, setTeachers] = useState([]);

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

  const handleAttendance = async (
    teacherId,
    status
  ) => {

    try {

      await saveTeacherAttendance({
        teacherId,
        status,
      });

      fetchAttendance();

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

<h1>

Teacher Attendance

</h1>

<p>

Manage today's attendance for department teachers

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

{teacher.name}

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

<td>

<div className="attendance-actions">

<button
className={`present-btn ${
teacher.attendanceStatus==="present"
? "active"
: ""
}`}
onClick={()=>
handleAttendance(
teacher._id,
"present"
)
}
>

Present

</button>

<button
className={`late-btn ${
teacher.attendanceStatus==="late"
? "active"
: ""
}`}
onClick={()=>
handleAttendance(
teacher._id,
"late"
)
}
>

Late

</button>

<button
className={`absent-btn ${
teacher.attendanceStatus==="absent"
? "active"
: ""
}`}
onClick={()=>
handleAttendance(
teacher._id,
"absent"
)
}
>

Absent

</button>

</div>

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