// Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  Edit,
  KeyRound,
  Settings,
  UserCheck,
  Clock,
  Award,
  MapPin,
  AlertCircle,
  Eye,
  Camera,
  Copy,
  Check,
  ChevronRight,
  LogOut,
  Bell,
  Globe,
  Lock
} from "lucide-react";

import api from "../../api/axios";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/auth/profile");
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-grid">
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-lines">
              <div className="skeleton-line"></div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <div className="error-icon">
            <AlertCircle size={32} />
          </div>
          <h3>Connection Error</h3>
          <p>We couldn't load your profile information</p>
          <button className="btn-modern" onClick={fetchProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Modern Header */}
      <div className="profile-header-modern">
        <div className="header-content">
          <div className="breadcrumb">
          </div>
          <h1>Profile Settings</h1>
        </div>
        <div className="header-actions">
          <button 
            className="btn-modern outlined"
            onClick={() => navigate("/edit-profile")}
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Stats Cards - Minimal */}
      <div className="stats-minimal">
        <div className="stat-card-minimal">
          <div className="stat-icon-minimal role">
            <Shield size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label-minimal">Role</span>
            <span className="stat-value-minimal">{user.role || "Registrar"}</span>
          </div>
        </div>

        <div className="stat-card-minimal">
          <div className="stat-icon-minimal status">
            <UserCheck size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label-minimal">Status</span>
            <span className="stat-value-minimal active">
              <span className="status-dot"></span>
              Active
            </span>
          </div>
        </div>

        <div className="stat-card-minimal">
          <div className="stat-icon-minimal dept">
            <Building2 size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label-minimal">Department</span>
            <span className="stat-value-minimal">{user.department?.name || "Main"}</span>
          </div>
        </div>

        <div className="stat-card-minimal">
          <div className="stat-icon-minimal login">
            <Clock size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-label-minimal">Last Login</span>
            <span className="stat-value-minimal">Today, 10:30 AM</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-content-modern">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div className="avatar-section">
            <div className="avatar-modern">
              <img
                src="/default-avatar.png"
                alt={user.name}
                className="avatar-img"
              />
              <button className="avatar-camera">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="user_name">{user.name}</h2>
            <p className="user-title">{user.role || "Staff Member"}</p>
            <div className="user-id">
              <span>ID: {user._id?.slice(-8) || "N/A"}</span>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(user._id || "")}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <User size={18} />
              Information
            </button>
            <button 
              className={`nav-item ${activeTab === "security" ? "active" : ""}`}
              onClick={() => setActiveTab("security")}
            >
              <Lock size={18} />
              Security
            </button>
            <button 
              className={`nav-item ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              <Settings size={18} />
              Preferences
            </button>
            <div className="nav-divider"></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="profile-main">
          {activeTab === "info" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Personal Information</h3>
                <button 
                  className="btn-text"
                  onClick={() => navigate("/edit-profile")}
                >
                  <Edit size={14} />
                  Edit
                </button>
              </div>
              
              <div className="info-grid-modern">
                <div className="info-field">
                  <div className="field-icon">
                    <User size={16} />
                  </div>
                  <div className="field-content">
                    <label>Full Name</label>
                    <p>{user.name}</p>
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-icon">
                    <Mail size={16} />
                  </div>
                  <div className="field-content">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-icon">
                    <Phone size={16} />
                  </div>
                  <div className="field-content">
                    <label>Phone Number</label>
                    <p>{user.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-icon">
                    <Building2 size={16} />
                  </div>
                  <div className="field-content">
                    <label>Department</label>
                    <p>{user.department?.name || "Not assigned"}</p>
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="field-content">
                    <label>Location</label>
                    <p>Main Campus</p>
                  </div>
                </div>

                <div className="info-field">
                  <div className="field-icon">
                    <Globe size={16} />
                  </div>
                  <div className="field-content">
                    <label>Language</label>
                    <p>English</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Security Settings</h3>
              </div>
              <div className="security-options">
                <button 
                  className="security-option"
                  onClick={() => navigate("/change-password")}
                >
                  <KeyRound size={20} />
                  <div className="option-text">
                    <strong>Change Password</strong>
                    <span>Update your account password</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
                
                <div className="security-option">
                  <Shield size={20} />
                  <div className="option-text">
                    <strong>Two-Factor Authentication</strong>
                    <span>Add extra security to your account</span>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="2fa" />
                    <label htmlFor="2fa"></label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="content-card">
              <div className="card-header">
                <h3>Preferences</h3>
              </div>
              <div className="preferences-list">
                <div className="preference-item">
                  <Bell size={20} />
                  <div className="option-text">
                    <strong>Email Notifications</strong>
                    <span>Receive email updates</span>
                  </div>
                  <div className="toggle-switch">
                    <input type="checkbox" id="email-notif" defaultChecked />
                    <label htmlFor="email-notif"></label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}