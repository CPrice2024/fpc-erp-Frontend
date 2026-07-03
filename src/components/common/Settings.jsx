import { useNavigate } from "react-router-dom";

// ✅ Rename the Settings icon to SettingsIcon to avoid conflict
import {
  User,
  Lock,
  Palette,
  Bell,
  Shield,
  Globe,
  Info,
  ChevronRight,
  Settings as SettingsIcon, 
} from "lucide-react";

import "../../styles/setting.css";

export default function Settings() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Profile",
      icon: User,
      route: "/profile",
      desc: "View and edit your personal information",
    },
    {
      title: "Change Password",
      icon: Lock,
      route: "/change-password",
      desc: "Update your account password for security",
    },
    {
      title: "Appearance",
      icon: Palette,
      route: "/appearance",
      desc: "Theme, layout, and display preferences",
    },
    {
      title: "Notifications",
      icon: Bell,
      route: "/notification-settings",
      desc: "Manage your notification preferences",
    },
    {
      title: "Security",
      icon: Shield,
      route: "/security",
      desc: "Login sessions, 2FA, and security settings",
    },
    {
      title: "Language & Region",
      icon: Globe,
      route: "/language",
      desc: "Language, timezone, and date format",
    },
    {
      title: "About System",
      icon: Info,
      route: "/about-system",
      desc: "Version, system information, and credits",
    },
  ];


  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>
          <SettingsIcon size={20} />  {/* ← Using renamed icon */}
          Account Settings
        </h1>
        <p>Manage your account preferences and security settings</p>
      </div>

      <div className="settings-grid">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="settings-card"
              onClick={() => navigate(item.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(item.route);
                }
              }}
            >
              <div className="settings-left">
                <div className="settings-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={18} />
            </div>
          );
        })}
      </div>
    </div>
  );
}