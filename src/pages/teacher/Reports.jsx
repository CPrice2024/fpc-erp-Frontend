// src/pages/teacher/Reports.jsx
import React, { useState, useMemo } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";

import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  LineChart,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Mail,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  Target,
  BookOpen,
  GraduationCap,
  Percent,
  Activity,
  Eye,
  Settings,
  RefreshCw,
  Maximize2,
  X,
  FileSpreadsheet,
  FileJson,
  File as FilePdf,
  Share2,
  Zap,
  Crown,
  Medal,
  Trophy,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Loader,
  UserCheck,
  UserX,
  Clock as ClockIcon,
  ArrowUp,
  ArrowDown,
  MinusCircle,
} from "lucide-react";

export default function Reports() {
  const [reportType, setReportType] = useState("attendance");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [dateRange, setDateRange] = useState({ start: "2026-04-01", end: "2026-04-30" });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  // Mock data
  const classes = [
    { id: "all", name: "All Classes" },
    { id: "class-1", name: "Grade 10 - Section A", strength: 35 },
    { id: "class-2", name: "Grade 10 - Section B", strength: 32 },
    { id: "class-3", name: "Grade 9 - Section A", strength: 30 },
    { id: "class-4", name: "Grade 9 - Section B", strength: 33 },
    { id: "class-5", name: "Grade 8 - Section A", strength: 28 },
  ];

  const students = [
    { id: "STU001", name: "Ahmed Khan", class: "class-1", rollNo: 1 },
    { id: "STU002", name: "Fatima Ali", class: "class-1", rollNo: 2 },
    { id: "STU003", name: "Muhammad Usman", class: "class-2", rollNo: 3 },
    { id: "STU004", name: "Ayesha Siddiqui", class: "class-3", rollNo: 4 },
    { id: "STU005", name: "Omar Farooq", class: "class-4", rollNo: 5 },
    { id: "STU006", name: "Zainab Bibi", class: "class-5", rollNo: 6 },
    { id: "STU007", name: "Hassan Raza", class: "class-1", rollNo: 7 },
    { id: "STU008", name: "Maryam Noor", class: "class-2", rollNo: 8 },
  ];

  // Generate mock attendance data
  const generateAttendanceData = () => {
    const data = [];
    const dateRangeList = [];
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) {
        dateRangeList.push(new Date(d));
      }
    }

    const filteredStudents = selectedStudent 
      ? students.filter(s => s.id === selectedStudent)
      : selectedClass !== "all" 
        ? students.filter(s => s.class === selectedClass)
        : students;

    filteredStudents.forEach((student) => {
      let presentCount = 0;
      let absentCount = 0;
      let lateCount = 0;
      
      dateRangeList.forEach((date, idx) => {
        const rand = Math.random();
        if (rand < 0.7) {
          presentCount++;
        } else if (rand < 0.85) {
          lateCount++;
        } else {
          absentCount++;
        }
      });
      
      data.push({
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        class: student.class,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        totalDays: dateRangeList.length,
        percentage: ((presentCount / dateRangeList.length) * 100).toFixed(1),
      });
    });
    
    return { data, totalDays: dateRangeList.length };
  };

  // Generate mock performance data
  const generatePerformanceData = () => {
    const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Computer Science"];
    const filteredStudents = selectedStudent 
      ? students.filter(s => s.id === selectedStudent)
      : selectedClass !== "all" 
        ? students.filter(s => s.class === selectedClass)
        : students;

    const studentPerformance = filteredStudents.map((student) => {
      const scores = subjects.map(() => Math.floor(Math.random() * 40) + 60);
      const average = (scores.reduce((a, b) => a + b, 0) / subjects.length).toFixed(1);
      const grade = average >= 90 ? "A+" : average >= 80 ? "A" : average >= 70 ? "B" : average >= 60 ? "C" : "D";
      return {
        studentId: student.id,
        studentName: student.name,
        rollNo: student.rollNo,
        scores: subjects.reduce((obj, sub, idx) => ({ ...obj, [sub]: scores[idx] }), {}),
        average: parseFloat(average),
        grade,
        rank: 0,
      };
    });
    
    // Sort by average for ranking
    studentPerformance.sort((a, b) => b.average - a.average);
    studentPerformance.forEach((student, idx) => {
      student.rank = idx + 1;
    });
    
    const classAverage = (studentPerformance.reduce((sum, s) => sum + s.average, 0) / studentPerformance.length).toFixed(1);
    const highestScore = Math.max(...studentPerformance.map(s => s.average));
    const lowestScore = Math.min(...studentPerformance.map(s => s.average));
    
    return { studentPerformance, classAverage, highestScore, lowestScore, subjects };
  };

  // Generate mock course completion data
  const generateCourseData = () => {
    const courses = [
      { id: 1, name: "Advanced Mathematics", code: "MATH301", totalModules: 12, totalStudents: 45 },
      { id: 2, name: "Physics: Mechanics", code: "PHY201", totalModules: 8, totalStudents: 38 },
      { id: 3, name: "English Literature", code: "ENG150", totalModules: 10, totalStudents: 52 },
      { id: 4, name: "Computer Science", code: "CS101", totalModules: 15, totalStudents: 60 },
    ];

    return courses.map(course => ({
      ...course,
      completedModules: Math.floor(Math.random() * course.totalModules),
      avgCompletion: Math.floor(Math.random() * 30) + 70,
      avgScore: Math.floor(Math.random() * 20) + 75,
      topPerformer: students[Math.floor(Math.random() * students.length)].name,
    }));
  };

  // Generate mock grade distribution
  const generateGradeDistribution = () => {
    return [
      { grade: "A+", count: 12, percentage: 15 },
      { grade: "A", count: 25, percentage: 31 },
      { grade: "B", count: 28, percentage: 35 },
      { grade: "C", count: 12, percentage: 15 },
      { grade: "D", count: 3, percentage: 4 },
    ];
  };

  // Generate mock behavior data
  const generateBehaviorData = () => {
    const filteredStudents = selectedStudent 
      ? students.filter(s => s.id === selectedStudent)
      : selectedClass !== "all" 
        ? students.filter(s => s.class === selectedClass)
        : students;

    return filteredStudents.map(student => ({
      ...student,
      positivePoints: Math.floor(Math.random() * 50) + 10,
      negativePoints: Math.floor(Math.random() * 20),
      warnings: Math.floor(Math.random() * 3),
      achievements: Math.floor(Math.random() * 5),
    }));
  };

  const attendanceReport = useMemo(() => generateAttendanceData(), [selectedClass, selectedStudent, dateRange]);
  const performanceReport = useMemo(() => generatePerformanceData(), [selectedClass, selectedStudent]);
  const courseReport = useMemo(() => generateCourseData(), []);
  const gradeDistribution = useMemo(() => generateGradeDistribution(), []);
  const behaviorReport = useMemo(() => generateBehaviorData(), [selectedClass, selectedStudent]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  const handleExport = () => {
    alert(`Exporting as ${exportFormat.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 75) return "text-blue-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+": return "text-purple-600 bg-purple-100";
      case "A": return "text-green-600 bg-green-100";
      case "B": return "text-blue-600 bg-blue-100";
      case "C": return "text-yellow-600 bg-yellow-100";
      default: return "text-red-600 bg-red-100";
    }
  };

  const StatCard = ({ title, value, icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend === "up" ? (
                <ArrowUp size={14} className="text-green-500" />
              ) : trend === "down" ? (
                <ArrowDown size={14} className="text-red-500" />
              ) : (
                <MinusCircle size={14} className="text-gray-400" />
              )}
              <span className={`text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const ReportHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Academic Report</h2>
          <p className="text-white/80 mt-1">
            {dateRange.start} to {dateRange.end}
          </p>
          <p className="text-white/70 text-sm mt-2">
            {selectedClass !== "all" ? classes.find(c => c.id === selectedClass)?.name : "All Classes"}
            {selectedStudent && ` • Student: ${students.find(s => s.id === selectedStudent)?.name}`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 text-sm"
          >
            <Printer size={16} /> Print
          </button>
          <div className="relative">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-1.5 bg-white/20 rounded-lg text-white border border-white/30 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="pdf" className="text-gray-900">PDF</option>
              <option value="excel" className="text-gray-900">Excel</option>
              <option value="csv" className="text-gray-900">CSV</option>
              <option value="json" className="text-gray-900">JSON</option>
            </select>
            <ChevronDown size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 text-sm"
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>
    </div>
  );

  const AttendanceReportSection = () => (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Overall Attendance"
          value={`${((attendanceReport.data.reduce((sum, s) => sum + parseFloat(s.percentage), 0) / attendanceReport.data.length) || 0).toFixed(1)}%`}
          icon={<Users size={20} />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Total Present Days"
          value={attendanceReport.data.reduce((sum, s) => sum + s.present, 0)}
          icon={<CheckCircle size={20} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Absent Days"
          value={attendanceReport.data.reduce((sum, s) => sum + s.absent, 0)}
          icon={<UserX size={20} />}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title="Late Arrivals"
          value={attendanceReport.data.reduce((sum, s) => sum + s.late, 0)}
          icon={<ClockIcon size={20} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Student Attendance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Present</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Absent</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Late</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendanceReport.data.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{student.rollNo}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.studentName}</td>
                  <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{student.present}</td>
                  <td className="px-4 py-3 text-center text-sm text-red-600">{student.absent}</td>
                  <td className="px-4 py-3 text-center text-sm text-yellow-600">{student.late}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-semibold ${getAttendanceColor(parseFloat(student.percentage))}`}>
                      {student.percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      parseFloat(student.percentage) >= 75 
                        ? "bg-green-100 text-green-700" 
                        : parseFloat(student.percentage) >= 60 
                        ? "bg-yellow-100 text-yellow-700" 
                        : "bg-red-100 text-red-700"
                    }`}>
                      {parseFloat(student.percentage) >= 75 ? "Good" : parseFloat(student.percentage) >= 60 ? "Satisfactory" : "Needs Improvement"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Attendance Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Attendance trend chart would render here</p>
            <p className="text-xs text-gray-400 mt-1">Chart.js or Recharts integration available</p>
          </div>
        </div>
      </div>
    </div>
  );

  const PerformanceReportSection = () => (
    <div className="space-y-6">
      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Class Average"
          value={`${performanceReport.classAverage}%`}
          icon={<Target size={20} />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Highest Score"
          value={`${performanceReport.highestScore}%`}
          icon={<Trophy size={20} />}
          color="bg-yellow-100 text-yellow-600"
          trend="up"
          trendValue="Top Performer"
        />
        <StatCard
          title="Lowest Score"
          value={`${performanceReport.lowestScore}%`}
          icon={<AlertCircle size={20} />}
          color="bg-orange-100 text-orange-600"
          trend="down"
          trendValue="Needs Support"
        />
        <StatCard
          title="Total Students"
          value={performanceReport.studentPerformance.length}
          icon={<Users size={20} />}
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Grade Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {gradeDistribution.map((grade) => (
              <div key={grade.grade}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{grade.grade}</span>
                  <span className="text-gray-600">{grade.count} students ({grade.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 ${
                      grade.grade === "A+" ? "bg-purple-500" :
                      grade.grade === "A" ? "bg-green-500" :
                      grade.grade === "B" ? "bg-blue-500" :
                      grade.grade === "C" ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${grade.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500 text-sm">Grade distribution pie chart</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Student Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                {performanceReport.subjects.map((subject) => (
                  <th key={subject} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    {subject.substring(0, 4)}
                  </th>
                ))}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Average</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {performanceReport.studentPerformance.map((student) => (
                <tr key={student.studentId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {student.rank === 1 && <Crown size={18} className="text-yellow-500" />}
                    {student.rank === 2 && <Medal size={18} className="text-gray-400" />}
                    {student.rank === 3 && <Medal size={18} className="text-amber-600" />}
                    {student.rank > 3 && <span className="text-sm text-gray-500">{student.rank}</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{student.rollNo}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.studentName}</td>
                  {performanceReport.subjects.map((subject) => (
                    <td key={subject} className="px-4 py-3 text-center text-sm text-gray-700">
                      {student.scores[subject]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center font-semibold">{student.average}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(student.grade)}`}>
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const CourseReportSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Courses"
          value={courseReport.length}
          icon={<BookOpen size={20} />}
          color="bg-indigo-100 text-indigo-600"
        />
        <StatCard
          title="Total Modules"
          value={courseReport.reduce((sum, c) => sum + c.totalModules, 0)}
          icon={<Target size={20} />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Avg Completion"
          value={`${Math.round(courseReport.reduce((sum, c) => sum + c.avgCompletion, 0) / courseReport.length)}%`}
          icon={<CheckCircle size={20} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Avg Score"
          value={`${Math.round(courseReport.reduce((sum, c) => sum + c.avgScore, 0) / courseReport.length)}%`}
          icon={<Award size={20} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Course Progress Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Modules</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Completion</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Avg Score</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Students</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Top Performer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courseReport.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{course.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{course.code}</td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">
                    {course.completedModules}/{course.totalModules}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${(course.completedModules / course.totalModules) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{Math.round((course.completedModules / course.totalModules) * 100)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-green-600">{course.avgScore}%</span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-700">{course.totalStudents}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{course.topPerformer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Performance Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Course Performance Comparison</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">Course performance bar chart</p>
          </div>
        </div>
      </div>
    </div>
  );

  const BehaviorReportSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Positive Points"
          value={behaviorReport.reduce((sum, s) => sum + s.positivePoints, 0)}
          icon={<ThumbsUp size={20} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Negative Points"
          value={behaviorReport.reduce((sum, s) => sum + s.negativePoints, 0)}
          icon={<ThumbsDown size={20} />}
          color="bg-red-100 text-red-600"
        />
        <StatCard
          title="Total Achievements"
          value={behaviorReport.reduce((sum, s) => sum + s.achievements, 0)}
          icon={<Trophy size={20} />}
          color="bg-yellow-100 text-yellow-600"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Student Behavior & Conduct</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Positive Points</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Negative Points</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Warnings</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Achievements</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {behaviorReport.map((student) => {
                const netScore = student.positivePoints - student.negativePoints;
                const status = netScore >= 30 ? "Excellent" : netScore >= 15 ? "Good" : netScore >= 0 ? "Satisfactory" : "Needs Attention";
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{student.rollNo}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                    <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">{student.positivePoints}</td>
                    <td className="px-4 py-3 text-center text-sm text-red-600">{student.negativePoints}</td>
                    <td className="px-4 py-3 text-center text-sm text-orange-600">{student.warnings}</td>
                    <td className="px-4 py-3 text-center text-sm text-purple-600">{student.achievements}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status === "Excellent" ? "bg-green-100 text-green-700" :
                        status === "Good" ? "bg-blue-100 text-blue-700" :
                        status === "Satisfactory" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="Reports & Analytics" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">
            <div className="dashboard-header">
              <div className="header-left">
                <h1>Academic Reports</h1>
                <p>Generate comprehensive reports and analytics for your classes</p>
              </div>
            </div>

            {/* Report Configuration Panel */}
            <div className="card mb-6">
              <div className="card-header">
                <h3>Report Configuration</h3>
                <Filter size={20} className="text-gray-400" />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="attendance">Attendance Report</option>
                      <option value="performance">Academic Performance</option>
                      <option value="courses">Course Progress</option>
                      <option value="behavior">Behavior & Conduct</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => {
                        setSelectedClass(e.target.value);
                        setSelectedStudent("");
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student (Optional)</label>
                    <select                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={selectedClass === "all"}
                    >
                      <option value="">All Students</option>
                      {students
                        .filter(s => selectedClass === "all" || s.class === selectedClass)
                        .map((student) => (
                          <option key={student.id} value={student.id}>{student.name}</option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="self-center text-gray-500">to</span>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setSelectedClass("all");
                      setSelectedStudent("");
                      setDateRange({ start: "2026-04-01", end: "2026-04-30" });
                      setShowReport(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={18} />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Report Display Area */}
            {isGenerating ? (
              <div className="card py-12">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Generating Report</h3>
                  <p className="text-gray-500">Please wait while we compile your data...</p>
                </div>
              </div>
            ) : showReport ? (
              <div className="space-y-6">
                <ReportHeader />
                
                {reportType === "attendance" && <AttendanceReportSection />}
                {reportType === "performance" && <PerformanceReportSection />}
                {reportType === "courses" && <CourseReportSection />}
                {reportType === "behavior" && <BehaviorReportSection />}

                {/* Footer Note */}
                <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-200">
                  <p>Report generated on {new Date().toLocaleString()} • Federal Prison Commission Academic System</p>
                  <p className="mt-1">* Data is based on the selected date range and filters</p>
                </div>
              </div>
            ) : (
              <div className="card py-12">
                <div className="text-center">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Report Generated</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Configure your report settings above and click "Generate Report" to view analytics and insights.
                  </p>
                </div>
              </div>
            )}

            <footer className="dashboard-footer">
              <p>© 2026 Federal Prison Commission — Advanced Reporting & Analytics</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}