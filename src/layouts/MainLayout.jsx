import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Topbar from "../components/common/Topbar";
import { Outlet } from "react-router-dom";
import "../styles/layout.css"; 

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isMobileOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <div className="main-section">
        <Topbar onMenuClick={toggleMobileMenu} isMobileMenuOpen={isMobileMenuOpen} />
        
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}