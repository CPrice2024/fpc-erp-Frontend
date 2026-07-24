
import React, { useEffect, useState } from 'react';
import {
  Search,
  Save,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  RefreshCw,
  Printer,
  Download,
} from 'lucide-react';
import {
  getGradeStudents,
  saveGrades,
  getMyCourse,
  getCourseGrades,
} from '../../api/teacherApi';
import './GradeEntry.css'; 

const GradeEntry = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [course, setCourse] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    passed: 0,
    failed: 0,
    average: 0,
  });

  // --- helpers ---
  const limit = (value, max) => {
    let num = Number(value);
    if (isNaN(num)) return 0;
    if (num < 0) return 0;
    if (num > max) return max;
    return num;
  };

  const calculate = (student) => {
    const total = (student.assignment || 0) + (student.quiz || 0) + 
                  (student.midExam || 0) + (student.finalExam || 0);
    let letterGrade = 'F';
    if (total >= 90) letterGrade = 'A';
    else if (total >= 80) letterGrade = 'B';
    else if (total >= 70) letterGrade = 'C';
    else if (total >= 60) letterGrade = 'D';

    return {
      ...student,
      total,
      letterGrade,
      status: total >= 60 ? 'Passed' : 'Failed',
    };
  };

  const calculateStatistics = (list) => {
    const passed = list.filter(s => s.status === 'Passed').length;
    const failed = list.length - passed;
    const average = list.length > 0
      ? (list.reduce((sum, s) => sum + (s.total || 0), 0) / list.length).toFixed(1)
      : 0;

    setStats({
      totalStudents: list.length,
      passed,
      failed,
      average,
    });
  };

  // --- data fetching ---
  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentRes, courseRes, gradeRes] = await Promise.all([
        getGradeStudents(),
        getMyCourse(),
        getCourseGrades(),
      ]);

      const initialized = studentRes.data.map(student => {
        const existing = gradeRes.data.find(g => g.student === student._id);
        return {
          ...student,
          assignment: existing?.assignment ?? 0,
          quiz: existing?.quiz ?? 0,
          midExam: existing?.midExam ?? 0,
          finalExam: existing?.finalExam ?? 0,
          total: existing?.total ?? 0,
          letterGrade: existing?.letterGrade ?? 'F',
          status: existing?.status ?? 'Failed',
        };
      });

      setStudents(initialized);
      setFilteredStudents(initialized);
      calculateStatistics(initialized);
      setCourse(courseRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // --- handlers ---
  const updateMark = (index, field, value) => {
    const copy = [...students];
    const limits = { assignment: 20, quiz: 10, midExam: 30, finalExam: 40 };
    copy[index][field] = limit(value, limits[field]);
    copy[index] = calculate(copy[index]);
    setStudents(copy);
    setFilteredStudents(copy);
    calculateStatistics(copy);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = students.map(student => ({
        student: student._id,
        course: course._id,
        semester: course.semester,
        academicYear: student.academicYear,
        assignment: student.assignment,
        quiz: student.quiz,
        midExam: student.midExam,
        finalExam: student.finalExam,
      }));
      await saveGrades(payload);
      alert('Grades saved successfully.');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save grades.');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => fetchData();
  const handlePrint = () => window.print();
  const handleExport = () => alert('Export CSV (demo)');

  // --- effects ---
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    setFilteredStudents(
      students.filter(student =>
        student.studentId?.toLowerCase().includes(keyword) ||
        student.firstName?.toLowerCase().includes(keyword) ||
        student.fatherName?.toLowerCase().includes(keyword)
      )
    );
  }, [search, students]);

  if (loading) {
    return (
    <div className="teacher-course-page">
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading grades...</p>
      </div>
    </div>
  );
  }

  return (
    <div className="grade-page">
      {/* Header */}
      <div className="grade-header">
        <div>
          <h1>Grade Management</h1>
          <p className="course-badge">
            {course?.courseCode || '—'} • {course?.courseName || 'No course'}
          </p>
        </div>
        <div className="header-actions">
          <button className="upload-btnn" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="upload-btnn" onClick={handlePrint}>
            <Printer size={16} />
            Print
          </button>
          <button className="upload-btnn" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-cards">
        <div className="summary-card">
          <BookOpen size={24} />
          <div>
            <span>Course</span>
            <h3>{course?.courseName || '—'}</h3>
            <small>{course?.courseCode || ''}</small>
          </div>
        </div>
        <div className="summary-card">
          <GraduationCap size={24} />
          <div>
            <span>Level</span>
            <h3>{course?.level || '—'}</h3>
          </div>
        </div>
        <div className="summary-card">
          <Calendar size={24} />
          <div>
            <span>Semester</span>
            <h3>{course?.semester || '—'}</h3>
          </div>
        </div>
        <div className="summary-card">
          <Users size={24} />
          <div>
            <span>Students</span>
            <h3>{stats.totalStudents}</h3>
          </div>
        </div>
        <div className="summary-card success">
          <span>Passed</span>
          <h2>{stats.passed}</h2>
        </div>
        <div className="summary-card danger">
          <span>Failed</span>
          <h2>{stats.failed}</h2>
        </div>
        <div className="summary-card primary">
          <span>Average</span>
          <h2>{stats.average}%</h2>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search student"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grade Table */}
      <table className="grade-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Assignment</th>
            <th>Quiz</th>
            <th>Mid</th>
            <th>Final</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student._id || index}>
              <td>{student.studentId}</td>
              <td>{student.firstName} {student.fatherName}</td>
              {['assignment', 'quiz', 'midExam', 'finalExam'].map((field) => (
                <td key={field}>
                  <input
                    type="number"
                    value={student[field] ?? 0}
                    onChange={(e) => updateMark(index, field, e.target.value)}
                    min="0"
                    max={field === 'assignment' ? 20 : field === 'quiz' ? 10 : field === 'midExam' ? 30 : 40}
                  />
                </td>
              ))}
              <td>
                <strong>{student.total ?? 0}</strong>
              </td>
              <td>{student.letterGrade || 'F'}</td>
              <td>
                <span className={student.status === 'Passed' ? 'passed' : 'failed'}>
                  {student.status || 'Failed'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeEntry;