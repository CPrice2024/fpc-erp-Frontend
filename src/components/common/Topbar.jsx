import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  Calendar,
  Users,
  CheckCircle
} from "lucide-react";

import "../styles/Topbar.css";
import avatar from "../../assets/avatar.png";

function Topbar({ setIsOpen }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const profilePhoto = user?.photo
  ? `${import.meta.env.VITE_API_URL.replace("/api", "")}${user.photo}`
  : avatar;

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New student registered", type: "success", time: "2 mins ago", read: false },
    { id: 2, title: "Attendance submitted for Grade 10", type: "info", time: "1 hour ago", read: false },
    { id: 3, title: "Teacher added successfully", type: "success", time: "3 hours ago", read: true },
    { id: 4, title: "Exam schedule published", type: "warning", time: "Yesterday", read: true },
  ]);

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);
  useEffect(() => {

  const timer = setInterval(() => {

    setCurrentTime(new Date());

  }, 1000);

  return () => clearInterval(timer);

}, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.topbar-dropdown-wrapper')) {
        setShowProfile(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle size={14} />;
      case 'warning': return <Calendar size={14} />;
      default: return <Users size={14} />;
    }
  };

  // Debug function to check if setIsOpen works
  const handleMenuClick = () => {
    console.log("Menu button clicked");
    if (setIsOpen) {
      setIsOpen(true);
      console.log("setIsOpen(true) called");
    } else {
      console.error("setIsOpen prop is not provided to Topbar");
    }
  };

  return (
    <div className="topbar">
      {/* LEFT */}
      <div className="topbar-left">

  <div className="topbar-greeting">

    <h3>

      {currentTime.getHours() < 12
        ? "Good Morning"
        : currentTime.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening"}

      , {user?.name || "Admin"} 

    </h3>

    <p>

      {currentTime.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}

      {" • "}

      {currentTime.toLocaleTimeString()}

    </p>

  </div>

</div>

      {/* RIGHT */}
      <div className="topbar-right">
        {/* DARK MODE */}
       

          {showNotifications && (
            <div className="dropdown notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button className="mark-all-btn" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>
              
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    <Bell size={32} />
                    <p>No notifications</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`dropdown-item notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <p>{notification.title}</p>
                        <span>{notification.time}</span>
                      </div>
                      {!notification.read && <div className="unread-dot"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="topbar-dropdown-wrapper">
          <div
  className="topbar-avatar"
  onClick={() => setShowProfile(!showProfile)}
>
  <img
  src={profilePhoto}
  alt="Profile"
  className="topbar-avatar-img"
  onError={(e) => {
    e.target.src = avatar;
  }}
/>

  <ChevronDown
    size={14}
    className="avatar-chevron"
  />
</div>

          {showProfile && (
            <div className="dropdown profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  {user?.name?.charAt(0) || "A"}
                </div>
                <div className="profile-info">
                  <h4>{user?.name || "Admin User"}</h4>
                  <p>{user?.email || "admin@school.com"}</p>
                  <span className="profile-role">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || "Administrator"}
                  </span>
                </div>
              </div>

              <div className="profile-menu">
                <button className="dropdown-btn" onClick={() => navigate("/profile")}>
                  <User size={16} />
                  View Profile
                </button>
                <button className="dropdown-btn" onClick={() => navigate("/settings")}>
                  <Settings size={16} />
                  Settings
                </button>
              </div>

              <div className="profile-divider"></div>

              <button className="dropdown-btn logout-btn" onClick={logout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
  );
}

export default Topbar;