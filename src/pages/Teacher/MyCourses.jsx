// src/pages/teacher/MyCourses.jsx
import React, { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import {
  BookOpen,
  Users,
  Clock,
  Calendar,
  ChevronRight,
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  FileText,
  Video,
  CheckCircle,
  AlertCircle,
  Play,
  MoreVertical,
  File,
  Star,
  BarChart3,
  GraduationCap,
  Target,
  MessageSquare,
  Settings,
  X,
  Grid3x3,
  List,
  Award,
  LineChart,
  PieChart,
  RefreshCw,
  Mail,
  Bell,
  Upload,
  Copy,
  Archive,
  EyeOff,
  TrendingUp,
  Link as LinkIcon,
  FolderOpen,
  Printer,
  Filter,
  Save,
  ArrowLeft,
  HelpCircle,
  Info,
  Send,
  Paperclip,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  MapPin,
  ExternalLink,
  Globe,
  Tag,
  DollarSign,
  Clock as ClockIcon,
  Users as UsersIcon,
  BookMarked,
  CheckSquare,
  AlertTriangle,
  Shield,
  Zap,
  Heart,
  Feather,
  Layers,
  Grid,
  Maximize2,
  Minimize2,
} from "lucide-react";

// ============================================
// COMPONENTS DEFINED OUTSIDE (FIXES THE ERROR)
// ============================================

// Course Card Component (Grid View)
const CourseCard = ({ course, onClick }) => (
  <div className="course-card" onClick={() => onClick(course)}>
    <div className="course-card-image">
      <img src={course.thumbnail} alt={course.title} />
      <span className={`status-badge ${course.status}`}>{course.status}</span>
    </div>
    <div className="course-card-content">
      <div className="course-card-header">
        <h3>{course.title}</h3>
        <p className="course-code">{course.code}</p>
      </div>
      <p className="course-description">{course.description}</p>
      <div className="course-stats">
        <div className="stat">
          <Users size={14} />
          <span>{course.students} students</span>
        </div>
        <div className="stat">
          <Clock size={14} />
          <span>{course.schedule?.split(" ")[0] || "N/A"}</span>
        </div>
      </div>
      <div className="progress-section">
        <div className="progress-header">
          <span>Course Progress</span>
          <span className="progress-value">{course.progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${course.progress}%` }} />
        </div>
      </div>
      <div className="course-footer">
        <span className="semester">
          <Calendar size={12} />
          {course.semester}
        </span>
        <button className="view-details-btn">
          View Details <ChevronRight size={14} />
        </button>
      </div>
    </div>
  </div>
);

// Course List View Component
const CourseListView = ({ course, onClick, onAnalytics, onSettings }) => (
  <div className="course-list-item" onClick={() => onClick(course)}>
    <div className="list-item-image">
      <img src={course.thumbnail} alt={course.title} />
    </div>
    <div className="list-item-content">
      <div className="list-item-header">
        <div>
          <h3>{course.title}</h3>
          <p className="course-code">{course.code} • {course.semester}</p>
        </div>
        <span className={`status-badge ${course.status}`}>{course.status}</span>
      </div>
      <p className="course-description">{course.description}</p>
    </div>
    <div className="list-item-stats">
      <div className="stat-box">
        <p className="stat-number">{course.students}</p>
        <p className="stat-label">Students</p>
      </div>
      <div className="stat-box">
        <p className="stat-number">{course.progress}%</p>
        <p className="stat-label">Progress</p>
      </div>
      <div className="stat-box">
        <p className="stat-number">{course.modules?.length || 0}</p>
        <p className="stat-label">Modules</p>
      </div>
    </div>
    <div className="list-item-actions">
      <button 
        className="icon-btn" 
        onClick={(e) => { 
          e.stopPropagation(); 
          onAnalytics(course);
        }}
      >
        <BarChart3 size={18} />
      </button>
      <button 
        className="icon-btn" 
        onClick={(e) => { 
          e.stopPropagation(); 
          onSettings(course);
        }}
      >
        <Settings size={18} />
      </button>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ icon: Icon, iconColor, value, title }) => (
  <div className="stat-card">
    <div className="stat-icon-wrapper" style={{ background: `${iconColor}15` }}>
      <Icon size={24} color={iconColor} />
    </div>
    <div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  </div>
);

// Main Component
export default function MyCourses() {
  // State Management
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState("courses");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock courses data
  const [courses] = useState([
    {
      id: 1,
      title: "Advanced Mathematics",
      code: "MATH301",
      description: "Calculus, Linear Algebra, and Differential Equations",
      students: 45,
      schedule: "Mon/Wed 10:00 AM - 11:30 AM",
      room: "Room 201",
      semester: "Spring 2026",
      status: "active",
      progress: 78,
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=240&fit=crop",
      instructor: "Prof. John Smith",
      credits: 3,
      prerequisites: "MATH202",
      modules: [],
      assignments: [],
      announcements: [],
      students: [],
    },
    {
      id: 2,
      title: "Physics: Mechanics & Waves",
      code: "PHY201",
      description: "Newtonian mechanics, wave motion, and thermodynamics",
      students: 38,
      schedule: "Tue/Thu 1:00 PM - 2:30 PM",
      room: "Lab 105",
      semester: "Spring 2026",
      status: "active",
      progress: 65,
      thumbnail: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=240&fit=crop",
      instructor: "Dr. Sarah Chen",
      credits: 4,
      prerequisites: "PHY101",
      modules: [],
      assignments: [],
      announcements: [],
      students: [],
    },
    {
      id: 3,
      title: "English Literature",
      code: "ENG150",
      description: "Classic and contemporary literary analysis",
      students: 52,
      schedule: "Mon/Wed/Fri 9:00 AM - 10:00 AM",
      room: "Room 305",
      semester: "Spring 2026",
      status: "active",
      progress: 45,
      thumbnail: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=240&fit=crop",
      instructor: "Prof. Emily Dickinson",
      credits: 3,
      prerequisites: "ENG101",
      modules: [],
      assignments: [],
      announcements: [],
      students: [],
    },
    {
      id: 4,
      title: "Computer Science 101",
      code: "CS101",
      description: "Introduction to programming and algorithms",
      students: 60,
      schedule: "Tue/Thu 3:00 PM - 4:30 PM",
      room: "CS Lab A",
      semester: "Spring 2026",
      status: "archived",
      progress: 100,
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=240&fit=crop",
      instructor: "Prof. Alan Turing",
      credits: 3,
      prerequisites: "None",
      modules: [],
      assignments: [],
      announcements: [],
      students: [],
    },
  ]);

  // Filtered courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentPage("course-detail");
    setSelectedTab("overview");
  };

  const handleAnalyticsClick = (course) => {
    setSelectedCourse(course);
    setCurrentPage("course-detail");
    setSelectedTab("analytics");
  };

  const handleSettingsClick = (course) => {
    setSelectedCourse(course);
    setCurrentPage("course-detail");
    setSelectedTab("settings");
  };

  const handleBackToCourses = () => {
    setCurrentPage("courses");
    setSelectedCourse(null);
    setSelectedTab("overview");
  };

  const handleCreateCourseClick = () => {
    setCurrentPage("create-course");
  };

  // Calculate stats
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalModules = courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0);
  const totalAssignments = courses.reduce((sum, c) => sum + (c.assignments?.length || 0), 0);

  // Course Detail View Component (defined inside but not created during render - it's conditional rendering)
  const CourseDetailView = () => {
    if (!selectedCourse) return null;

    return (
      <div className="course-detail-view">
        <div className="course-detail-header">
          <button className="back-btn" onClick={handleBackToCourses}>
            <ArrowLeft size={20} />
            Back to Courses
          </button>
        </div>

        <div className="course-hero">
          <img src={selectedCourse.thumbnail} alt={selectedCourse.title} />
          <div className="course-hero-overlay">
            <div className="course-hero-content">
              <h1>{selectedCourse.title}</h1>
              <p className="course-code">{selectedCourse.code}</p>
              <div className="course-meta">
                <div className="meta-item"><Users size={16} /><span>{selectedCourse.students} Students</span></div>
                <div className="meta-item"><Clock size={16} /><span>{selectedCourse.schedule}</span></div>
                <div className="meta-item"><Calendar size={16} /><span>{selectedCourse.room}</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="tabs-container">
          {["overview", "modules", "assignments", "announcements", "students", "analytics", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`tab-btn ${selectedTab === tab ? "active" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {selectedTab === "overview" && (
            <div className="overview-tab">
              <div className="stats-overview">
                <div className="stat-card-small">
                  <div className="stat-icon blue"><GraduationCap size={24} /></div>
                  <div>
                    <p className="stat-value">{selectedCourse.progress}%</p>
                    <p className="stat-label">Course Progress</p>
                  </div>
                </div>
                <div className="stat-card-small">
                  <div className="stat-icon green"><FileText size={24} /></div>
                  <div>
                    <p className="stat-value">{selectedCourse.students}</p>
                    <p className="stat-label">Enrolled Students</p>
                  </div>
                </div>
              </div>
              <div className="course-info-section">
                <div className="info-card">
                  <h3>Course Description</h3>
                  <p>{selectedCourse.description}</p>
                </div>
                <div className="info-card">
                  <h3>Course Details</h3>
                  <div className="info-grid">
                    <div><label>Instructor</label><p>{selectedCourse.instructor}</p></div>
                    <div><label>Credits</label><p>{selectedCourse.credits}</p></div>
                    <div><label>Prerequisites</label><p>{selectedCourse.prerequisites}</p></div>
                    <div><label>Schedule</label><p>{selectedCourse.schedule}</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selectedTab !== "overview" && (
            <div className="coming-soon">
              <p>Content for {selectedTab} coming soon...</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Create Course Page Component
  const CreateCoursePage = () => (
    <div className="create-course-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleBackToCourses}>
          <ArrowLeft size={20} />
          Back to Courses
        </button>
        <h1>Create New Course</h1>
        <p>Fill in the details below to create a new course</p>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h2>Course Information</h2>
          <p>Enter the basic details about your course</p>
        </div>

        <div className="form-grid">
          <div className="form-group full-width">
            <label>Course Title *</label>
            <input type="text" placeholder="e.g., Advanced Web Development" />
          </div>

          <div className="form-group">
            <label>Course Code *</label>
            <input type="text" placeholder="e.g., CS301" />
          </div>

          <div className="form-group">
            <label>Credits</label>
            <input type="number" placeholder="3" />
          </div>

          <div className="form-group full-width">
            <label>Course Description *</label>
            <textarea rows={4} placeholder="Describe what students will learn in this course..." />
          </div>

          <div className="form-group">
            <label>Instructor Name *</label>
            <input type="text" placeholder="e.g., Prof. John Doe" />
          </div>

          <div className="form-group">
            <label>Semester</label>
            <input type="text" placeholder="e.g., Spring 2026" />
          </div>

          <div className="form-group">
            <label>Schedule</label>
            <input type="text" placeholder="e.g., Mon/Wed 10:00 AM" />
          </div>

          <div className="form-group">
            <label>Room / Location</label>
            <input type="text" placeholder="e.g., Room 201 or Online" />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={handleBackToCourses}>
            Cancel
          </button>
          <button type="button" className="primary-btn" onClick={() => {
            alert("Course created successfully!");
            handleBackToCourses();
          }}>
            <CheckCircle size={16} /> Create Course
          </button>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content-area">
        <Topbar title="My Courses" />

        <div className="content-wrapper">
          <div className="teacher-dashboard">
            {currentPage === "courses" && (
              <>
                <div className="dashboard-header">
                  <div className="header-left">
                    <h1>My Courses</h1>
                    <p>Manage your courses, modules, assignments, and student progress</p>
                  </div>
                  <button onClick={handleCreateCourseClick} className="create-course-btn">
                    <Plus size={18} /> New Course
                  </button>
                </div>

                <div className="stats-grid">
                  <StatCard icon={BookOpen} iconColor="#10b981" value={courses.length} title="Total Courses" />
                  <StatCard icon={Users} iconColor="#8b5cf6" value={totalStudents} title="Total Students" />
                  <StatCard icon={Target} iconColor="#f59e0b" value={totalModules} title="Active Modules" />
                  <StatCard icon={Award} iconColor="#06b6d4" value={totalAssignments} title="Assignments" />
                </div>

                <div className="controls-card">
                  <div className="controls-header">
                    <div className="view-toggle">
                      <button 
                        className={`view-btn ${viewMode === "grid" ? "active" : ""}`} 
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3x3 size={18} />
                      </button>
                      <button 
                        className={`view-btn ${viewMode === "list" ? "active" : ""}`} 
                        onClick={() => setViewMode("list")}
                      >
                        <List size={18} />
                      </button>
                    </div>
                    <div className="filters">
                      <div className="search-wrapper">
                        <Search size={18} />
                        <input 
                          type="text" 
                          placeholder="Search courses..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select 
                        className="filter-select" 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button className="refresh-btn" onClick={() => setSearchTerm("")}>
                        <RefreshCw size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {viewMode === "grid" ? (
                  <div className="courses-grid">
                    {filteredCourses.map((course) => (
                      <CourseCard key={course.id} course={course} onClick={handleCourseClick} />
                    ))}
                  </div>
                ) : (
                  <div className="courses-list">
                    {filteredCourses.map((course) => (
                      <CourseListView 
                        key={course.id} 
                        course={course} 
                        onClick={handleCourseClick}
                        onAnalytics={handleAnalyticsClick}
                        onSettings={handleSettingsClick}
                      />
                    ))}
                  </div>
                )}

                {filteredCourses.length === 0 && (
                  <div className="empty-state">
                    <BookOpen size={64} />
                    <h3>No courses found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                )}

                <footer className="dashboard-footer">
                  <p>© 2026 Federal Prison Commission — Course Management System</p>
                </footer>
              </>
            )}

            {currentPage === "course-detail" && <CourseDetailView />}
            {currentPage === "create-course" && <CreateCoursePage />}
          </div>
        </div>
      </div>
    </div>
  );
}