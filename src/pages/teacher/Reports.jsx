import { useEffect, useState } from "react";

import {

FileText,

Download,

BarChart3,

Users,

ClipboardCheck,

GraduationCap,

} from "lucide-react";

import {

getGradeReport,

getAttendanceHistory,

} from "../../api/teacherApi";

import "./Reports.css";

export default function Reports(){

const [grades,setGrades]=useState([]);

const [attendance,setAttendance]=useState([]);

const [loading,setLoading]=useState(true);

useEffect(()=>{

loadData();

},[]);

const loadData=async()=>{

try{

const [gradeRes,attendanceRes]=await Promise.all([

getGradeReport(),

getAttendanceHistory(),

]);

setGrades(gradeRes.data);

setAttendance(attendanceRes.data);

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

};

if(loading){

return <h2>Loading...</h2>;

}

const totalStudents=

new Set(

grades.map(

g=>g.student?._id

)

).size;

const passCount=

grades.filter(

g=>g.status==="Passed"

).length;

const average=

grades.length

?

(

grades.reduce(

(sum,g)=>sum+g.total,

0

)/grades.length

).toFixed(1)

:0;

return(

<div className="reports-page">

<div className="reports-header">

<h1>

Teacher Reports

</h1>

<p>

Academic Summary

</p>

</div>

<div className="report-cards">

<div className="report-card">

<Users/>

<h2>

{totalStudents}

</h2>

<p>

Students

</p>

</div>

<div className="report-card">

<GraduationCap/>

<h2>

{average}

%

</h2>

<p>

Average

</p>

</div>

<div className="report-card">

<ClipboardCheck/>

<h2>

{passCount}

</h2>

<p>

Passed

</p>

</div>

<div className="report-card">

<BarChart3/>

<h2>

{attendance.length}

</h2>

<p>

Attendance Records

</p>

</div>

</div>

<div className="table-card">

<table>

<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Course</th>

<th>Total</th>

<th>Grade</th>

<th>Status</th>

</tr>

</thead>

<tbody>

{

grades.map((grade)=>(

<tr key={grade._id}>

<td>

{grade.student?.studentId}

</td>

<td>

{grade.student?.firstName}

{" "}

{grade.student?.fatherName}

</td>

<td>

{grade.course?.courseCode}

</td>

<td>

{grade.total}

</td>

<td>

{grade.letterGrade}

</td>

<td>

<span

className={

grade.status==="Passed"

?

"passed"

:

"failed"

}

>

{grade.status}

</span>

</td>

</tr>

))

}

</tbody>

</table>

</div>

<div className="export-buttons">

<button>

<FileText size={18}/>

Export PDF

</button>

<button>

<Download size={18}/>

Export Excel

</button>

</div>

</div>

);

}