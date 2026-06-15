import { useState, useEffect } from 'react';
import Sidebar from "../../components/common/Sidebar";
import Topbar from "../../components/common/Topbar";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  UserPlus,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  GraduationCap
} from 'lucide-react';

export default function TeacherDashboard() {
  const [currentDate, setCurrentDate] = useState('');
  const [teacherName, setTeacherName] = useState('Teacher User');


  useEffect(() => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('en-US', options));
  }, []);

  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Students',
      value: '11',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: '#aa3bff'
    },
    {
      title: 'Total Teachers',
      value: '24',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: '#10b981'
    },
    {
      title: 'Total Courses',
      value: '36',
      change: '+5%',
      trend: 'up',
      icon: BookOpen,
      color: '#f59e0b'
    },
    {
      title: 'Attendance Rate',
      value: '87%',
      change: '+2%',
      trend: 'up',
      icon: Calendar,
      color: '#ef4444'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrolled', subject: 'John Doe', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Assignment submitted', subject: 'Mathematics', time: '5 hours ago', type: 'info' },
    { id: 3, action: 'Class attendance updated', subject: 'Physics', time: '1 day ago', type: 'warning' },
    { id: 4, action: 'New course material added', subject: 'Computer Science', time: '2 days ago', type: 'success' }
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Mathematics', time: '10:00 AM', room: 'Room 201', students: 11 },
    { id: 2, subject: 'Physics', time: '02:00 PM', room: 'Lab 3', students: 8 },
    { id: 3, subject: 'English', time: '04:00 PM', room: 'Room 105', students: 9 }
  ];

  const handleMenuClick = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('mobile-open');
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content-area">
        <Topbar title="Teacher Dashboard" onMenuClick={handleMenuClick} />
        <div className="content-wrapper">
          <div className="teacher-dashboard">
            <div className="dashboard-header">
              <div className="header-left">
                <h1>FPC EduSystem</h1>
                <p>Welcome back, <span className="teacher-name">{teacherName}</span></p>
                <div className="current-date">{currentDate}</div>
              </div>
              <div className="header-right">
                          <button
                 className="register-btn"
                  onClick={() => navigate("/teacher/students/register")} >Register Student
                  </button>
              </div>
            </div>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <div className="stat-header">
                    <span className={`stat-trend ${stat.trend}`}>
                      {stat.change}
                      {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    </span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid">
              {/* Inmate Education Statistics */}
              <div className="card inmate-stats">
                <div className="card-header">
                  <h3>Inmate Education Statistics</h3>
                  <PieChart size={20} />
                </div>
                <div className="inmate-content">
                  <div className="inmate-percentage">
                    <div className="circle-progress">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" className="circle-bg"/>
                        <circle cx="50" cy="50" r="45" className="circle-fill" 
                          style={{ strokeDasharray: `${(55/100) * 283}`, strokeDashoffset: '0' }}/>
                      </svg>
                      <div className="percentage-text">
                        <span className="percentage-value">55%</span>
                        <span className="percentage-label">Inmate Students</span>
                      </div>
                    </div>
                    <div className="inmate-details">
                      <div className="inmate-stat">
                        <GraduationCap size={18} />
                        <span>6 out of 11 students</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Rate Chart */}
              <div className="card attendance-chart">
                <div className="card-header">
                  <h3>Attendance Rate Chart</h3>
                  <BarChart3 size={20} />
                </div>
                <div className="chart-container">
                  <div className="bar-chart">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                      <div className="bar-item" key={index}>
                        <div className="bar" style={{ height: `${65 + Math.random() * 25}%` }}>
                          <span className="bar-value">{Math.floor(65 + Math.random() * 25)}%</span>
                        </div>
                        <span className="bar-label">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="card recent-activities">
                <div className="card-header">
                  <h3>Recent Activities</h3>
                  <Activity size={20} />
                </div>
                <div className="activities-list">
                  {recentActivities.map(activity => (
                    <div className="activity-item" key={activity.id}>
                      <div className={`activity-icon ${activity.type}`}>
                        {activity.type === 'success' && <CheckCircle size={16} />}
                        {activity.type === 'info' && <Clock size={16} />}
                        {activity.type === 'warning' && <AlertCircle size={16} />}
                      </div>
                      <div className="activity-details">
                        <p className="activity-action">{activity.action}</p>
                        <span className="activity-subject">{activity.subject}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Classes */}
              <div className="card upcoming-classes">
                <div className="card-header">
                  <h3>Today's Classes</h3>
                  <Calendar size={20} />
                </div>
                <div className="classes-list">
                  {upcomingClasses.map(class_item => (
                    <div className="class-item" key={class_item.id}>
                      <div className="class-time">{class_item.time}</div>
                      <div className="class-info">
                        <span className="class-subject">{class_item.subject}</span>
                        <span className="class-room">{class_item.room}</span>
                      </div>
                      <div className="class-students">
                        <Users size={14} />
                        <span>{class_item.students}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <footer className="dashboard-footer">
              <p>© 2026 Federal Prison Commission. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
        }

        .main-content-area {
          flex: 1;
          margin-left: 280px;
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .content-wrapper {
          flex: 1;
          overflow-x: auto;
        }

        .teacher-dashboard {
          padding: 2rem;
          max-width: 1400px;
            padding: inherit;
            width: 100%;

          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left h1 {
          font-size: 26px;
          font-weight: 600;
          color: #006cd3;
          margin-bottom: 0px;
          letter-spacing: -0.5px;
        }
          margin: 0 0 0.5rem 0;
          color: var(--text-h);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-left p {
          color: var(--text);
          margin: 0;
          font-size: 16px;
        }

        .teacher-name {
          color: var(--accent);
          font-weight: 600;
        }

        .current-date {
          font-size: 13px;
          color: var(--text);
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .current-date::before {
          content: "📅";
          font-size: 12px;
        }


      

        .stats-grid {
        display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 14px;
    margin-bottom: 23px;
        }

       

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent), #c084fc);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover::before {
          transform: scaleX(1);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -12px rgba(0, 0, 0, 0.2);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
    height: 32px;
    color: #3b82f6;
    background: #eff6ff;
    padding: 8px;
    border-radius: 14px;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.05);
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 13px;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .stat-trend.up {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .stat-value {
 font-size: 22px;
  font-weight: 600;
  color: #3a63eb;
  line-height: 1.2;
  margin-bottom: 4px;
        }

        .stat-title {
          font-size: 14px;
          color: var(--text);
          font-weight: 500;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

   


        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #5770e9;
        }

        .card-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-h);
        }

        .inmate-stats {
          background: #f3f3f3;
        }

        .circle-progress {
          position: relative;
          width: 200px;
          margin: 0 auto 1.5rem;
        }

        .circle-progress svg {
          width: 100%;
          height: auto;
          transform: rotate(-90deg);
        }

        .circle-bg {
          fill: none;
          stroke: var(--border);
          stroke-width: 10;
        }

        .circle-fill {
          fill: none;
          stroke: var(--accent);
          stroke-width: 10;
          stroke-linecap: round;
        }

        .percentage-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .percentage-value {
          display: block;
          font-size: 36px;
          font-weight: 700;
          color: var(--accent);
          line-height: 1;
        }

        .percentage-label {
          font-size: 11px;
          color: var(--text);
          margin-top: 0.25rem;
          display: block;
        }

        .inmate-details {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
        }

        .inmate-stat {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-h);
          font-size: 14px;
          font-weight: 500;
          padding: 0.5rem 1rem;
          background: var(--accent-bg);
          border-radius: 10px;
        }

        .bar-chart {
           display: contents;
    justify-content: space-around;
    align-items: flex-end;
    height: 320px;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    padding: 1rem 0;
}
    .inmate-percentage {
        display: flex;
    justify-content: space-around;
    align-items: flex-end;
    height: 320px;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    padding: 1rem 0;
}
        }

        .bar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          flex: 1;
        }

        .bar {
          width: 100%;
          max-width: 60px;
          background: linear-gradient(180deg, var(--accent), #c084fc);
          border-radius: 12px;
          transition: height 0.5s ease;
          position: relative;
          cursor: pointer;
        }

        .bar:hover {
          opacity: 0.9;
          transform: scaleX(1.05);
        }

        .bar-value {
          position: absolute;
          top: -28px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          font-weight: 700;
          color: var(--accent);
          white-space: nowrap;
        }

        .bar-label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text);
        }

        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 350px;
          overflow-y: auto;
              display: flex;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
}
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 0.875rem;
          border-radius: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .activity-item:hover {
          background: var(--code-bg);
          transform: translateX(4px);
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon.success {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .activity-icon.info {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .activity-icon.warning {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .activity-details {
          flex: 1;
        }

        .activity-action {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-h);
        }

        .activity-subject {
          display: block;
          font-size: 12px;
          color: var(--accent);
          margin: 0.25rem 0;
        }

        .activity-time {
          font-size: 11px;
          color: var(--text);
          opacity: 0.7;
        }

        .classes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
    height: 320px;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
}
        }

        .class-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 14px;
          background: var(--code-bg);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .class-item:hover {
          transform: translateX(4px);
          background: var(--accent-bg);
        }

        .class-time {
          background: linear-gradient(135deg, var(--accent), #c084fc);
          color: white;
          padding: 0.375rem 0.875rem;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          min-width: 80px;
          text-align: center;
        }

        .class-info {
          flex: 1;
        }

        .class-subject {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: var(--text-h);
          margin-bottom: 0.25rem;
        }

        .class-room {
          font-size: 12px;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .class-students {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text);
          font-size: 12px;
          background: var(--bg);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        @media (max-width: 768px) {
          .main-content-area {
            margin-left: 0;
          }
          
          .teacher-dashboard {
            padding: 1rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
          
          .dashboard-header {
            flex-direction: column;
          }
          
       
          
          .bar-chart {
            height: 250px;
          }
          
          .stat-value {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}