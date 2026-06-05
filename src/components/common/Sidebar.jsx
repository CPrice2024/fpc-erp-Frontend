import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import "./Sidebar.css";
import logo from "../../assets/FPClogo.png";

const menuByRole = {
  college_head: {
    title: "College Head",
    items: [
      {
        label: "Dashboard",
        path: "/college-head",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Departments",
        path: "/college-head/departments",
        icon: <Building2 size={18} />,
      },
      {
        label: "Reports",
        path: "/college-head/reports",
        icon: <ClipboardCheck size={18} />,
      },
    ],
  },

  department_head: {
    title: "Department Head",
    items: [
      {
        label: "Dashboard",
        path: "/department-head",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Teachers",
        path: "/department-head/teachers",
        icon: <Users size={18} />,
      },
      {
        label: "Students",
        path: "/department-head/students",
        icon: <GraduationCap size={18} />,
      },
      {
        label: "Courses",
        path: "/department-head/courses",
        icon: <BookOpen size={18} />,
      },
      {
        label: "Attendance",
        path: "/department-head/attendance",
        icon: <ClipboardCheck size={18} />,
      },
            {
        label: "Report",
        path: "/department-head/report",
        icon: <ClipboardCheck size={18} />,
      },
    ],
  },

  registrar: {
    title: "Registrar",
    items: [
      {
        label: "Dashboard",
        path: "/registrar",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Student Records",
        path: "/registrar/records",
        icon: <GraduationCap size={18} />,
      },
      {
        label: "Enrollment",
        path: "/registrar/enrollment",
        icon: <BookOpen size={18} />,
      },
      {
        label: "Finance",
        path: "/registrar/finance",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "Grade Report",
        path: "/registrar/grade-report",
        icon: <ClipboardCheck size={18} />,
      },
      {
        label: "Reports",
        path: "/registrar/reports",
        icon: <ClipboardCheck size={18} />,
      },
    ],
  },

  teacher: {
    title: "Teacher",
    items: [
      {
        label: "Dashboard",
        path: "/teacher",
        icon: <LayoutDashboard size={18} />,
      },
      {
        label: "My Class",
        path: "/teacher/classes",
        icon: <BookOpen size={18} />,
      },
      {
        label: "Student Attendance",
        path: "/teacher/student-attendance",
        icon: <ClipboardCheck size={18} />,
      },
      {
        label: "Grades",
        path: "/teacher/grades",
        icon: <GraduationCap size={18} />,
      },
    ],
  },
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState({});

  if (!user) return null;

  const roleConfig = menuByRole[user.role];
  const menuItems = roleConfig?.items || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSubMenu = (label) => {
    setOpenSubMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path) => {
    if (path === location.pathname) return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  const SidebarContent = () => (
    <>
      {/* Header */}
<div className="sidebar-header">
  {!isCollapsed ? (
    <>
      <div className="college-brand">
        <div className="college-logo">
          <img className="college-logo" src={logo} alt="College Logo" />
        </div>

        <div>
          <h2>FPC</h2>
          <span>My College</span>
        </div>
      </div>

      <span className={`role-badge role-${user.role}`}>
        {roleConfig?.title}
      </span>
    </>
  ) : (
    <div className="collapsed-logo">
      <img src={logo} alt="College Logo" />
    </div>
  )}
</div>

      {/* User Profile (when collapsed) */}
      {isCollapsed && (
        <div className="collapsed-profile">
          <div className="avatar-placeholder">
            <User size={20} />
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item, idx) => {
          const active = isActive(item.path);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isOpen = openSubMenus[item.label];

          return (
            <div key={idx} className="nav-item-wrapper">
              {hasSubItems ? (
                <>
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className={`nav-link has-submenu ${active ? 'active' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        <span className="submenu-icon">
                          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                      </>
                    )}
                  </button>
                  {!isCollapsed && isOpen && (
                    <div className="submenu">
                      {item.subItems.map((subItem, subIdx) => (
                        <Link
                          key={subIdx}
                          to={subItem.path}
                          className={`submenu-link ${isActive(subItem.path) ? 'active' : ''}`}
                          onClick={closeMobileMenu}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-link ${active ? 'active' : ''}`}
                  title={isCollapsed ? item.label : undefined}
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name || user.email}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        <SidebarContent />
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
}