import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Save,
  Users,
  Calendar,
  RefreshCw,
  Printer,
  Download,
  CheckCircle,
  XCircle,
  Clock3,
} from "lucide-react";

import {
  getAttendanceStudents,
  saveAttendance,
  getMyCourse,
  getTodayAttendance,
} from "../../api/teacherAPI";
import "./Attendance.css";

export default function Attendance() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

const [course, setCourse] = useState(null);

const [search, setSearch] = useState("");

const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {

    const keyword =
        search.toLowerCase();

    setFilteredStudents(

        students.filter(

            student =>

            student.studentId
            .toLowerCase()
            .includes(keyword)

            ||

            student.firstName
            .toLowerCase()
            .includes(keyword)

            ||

            student.fatherName
            .toLowerCase()
            .includes(keyword)

        )

    );

}, [search, students]);

 const loadStudents = async () => {

  try {

    const [
  studentRes,
  courseRes,
  attendanceRes,
] = await Promise.all([
  getAttendanceStudents(),
  getMyCourse(),
  getTodayAttendance(),
]);

    const attendance = studentRes.data.map(student => {

  const existing = attendanceRes.data.find(record =>
    (record.student?._id || record.student).toString() ===
    student._id.toString()
  );

  return {

    ...student,

    status: existing?.status || "Present",

    remark: existing?.remark || "",

  };

});

    setStudents(attendance);

    setFilteredStudents(attendance);

    setCourse(courseRes.data);

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }

};

 const updateStatus = (id, value) => {

  const updated = students.map(student =>

    student._id === id

      ? {
          ...student,
          status: value,
        }

      : student

  );

  setStudents(updated);

};

  const updateRemark = (id, value) => {
    const updated = students.map(student =>
      student._id === id
        ? {
            ...student,
            remark: value,
          }
        : student
    );
    setStudents(updated);
  };

  const handleSave = async () => {

    try{

        setSaving(true);
        const today = new Date().toISOString().split("T")[0];

const records = students.map(student => ({

    student: student._id,

    course: course._id,

    date: today,

    status: student.status,

    remark: student.remark,

}));

        await saveAttendance({

            records,

        });

        alert("Attendance Saved Successfully");

    }

    catch(err){

        console.log(err);

    }

    finally{

        setSaving(false);

    }

};

  const stats = useMemo(() => {

  return {

    total: students.length,

    present: students.filter(
      s => s.status === "Present"
    ).length,

    absent: students.filter(
      s => s.status === "Absent"
    ).length,

    late: students.filter(
      s => s.status === "Late"
    ).length,

    excused: students.filter(
      s => s.status === "Excused"
    ).length,

  };

}, [students]);

if (loading) {
  return (
    <div className="teacher-course-page">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    </div>
  );
}

  return (
    <div className="attendance-page">

      <div className="attendance-header">

    <div>

        <h1>

            Attendance

        </h1>

        <p>

            {course?.courseCode}

            {" • "}

            {course?.courseName}

        </p>

    </div>

    <div className="header-actions">

        <button
        onClick={loadStudents}
        className="print-btn"
        >

            <RefreshCw size={18}/>

            Refresh

        </button>

        <button className="print-btn">

            <Printer size={18}/>

            Print

        </button>

        <button className="export-btn">

            <Download size={18}/>

            Export

        </button>

        <button
        className="print-btn"
        onClick={handleSave}
        disabled={saving}
        >

            <Save size={18}/>

           {saving ? "Saving..." : "Save Attendance"}

        </button>

    </div>

</div>

<div className="attendance-dashboard">

<div className="summary-card">

<Users size={24}/>

<div>

<span>Students</span>

<h3>{stats.total}</h3>

</div>

</div>

<div className="summary-card success">

<CheckCircle size={24}/>

<div>

<span>Present</span>

<h3>{stats.present}</h3>

</div>

</div>

<div className="summary-card danger">

<XCircle size={24}/>

<div>

<span>Absent</span>

<h3>{stats.absent}</h3>

</div>

</div>

<div className="summary-card warning">

<Clock3 size={24}/>

<div>

<span>Late</span>

<h3>{stats.late}</h3>

</div>

</div>

<div className="summary-card">

<Calendar size={24}/>

<div>

<span>Excused</span>

<h3>{stats.excused}</h3>

</div>

</div>

</div>

<div className="search-bar">

<Search size={18}/>

<input

placeholder="Search Student..."

value={search}

onChange={(e)=>

setSearch(e.target.value)

}

/>

</div>

      <table className="attendance-table">
        <thead>
<tr>
  <th>#</th>
  <th>Photo</th>
  <th>Student ID</th>
  <th>Full Name</th>
  <th>Gender</th>
  <th>Status</th>
  <th>Remark</th>
  <th>Updated</th>
</tr>
</thead>

        <tbody>

          {filteredStudents.map((student, index) => (
            <tr key={student._id}>

  <td>{index + 1}</td>

  <td>
    <img
      src={
        student.photo
          ? student.photo
          : "/avatar.png"
      }
      alt=""
      className="student-photo"
    />
  </td>

  <td>{student.studentId}</td>

  <td>
    {student.firstName} {student.fatherName}
  </td>

  <td>{student.gender}</td>

  <td>
    <select
      value={student.status}
      onChange={(e) =>
        updateStatus(student._id, e.target.value)
      }
      className={`status-select ${student.status.toLowerCase()}`}
    >
      <option value="Present">Present</option>
      <option value="Absent">Absent</option>
      <option value="Late">Late</option>
      <option value="Excused">Excused</option>
    </select>
  </td>

  <td>
    <input
      type="text"
      placeholder="Remark..."
      value={student.remark}
      onChange={(e) =>
        updateRemark(student._id, e.target.value)
      }
    />
  </td>

  <td>
    {new Date().toLocaleTimeString()}
  </td>

</tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}