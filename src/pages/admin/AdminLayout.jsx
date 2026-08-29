import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Mail, 
  Award,
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bell,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    // Set initial state
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Overview',      path: '/admin',               icon: <LayoutDashboard size={20} /> },
    { name: 'Products',      path: '/admin/products',       icon: <Package size={20} /> },
    { name: 'Categories',    path: '/admin/categories',     icon: <Layers size={20} /> },
    { name: 'Certificates',  path: '/admin/certificates',   icon: <Award size={20} /> },
    { name: 'Inquiries',     path: '/admin/inquiries',      icon: <Mail size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className={`admin-sidebar-overlay ${isSidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <span className="logo-icon">A</span>
            <span className="logo-text">Agro<span>Admin</span></span>
          </div>
          <button className="sidebar-toggle-btn mobile-only" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-name">{item.name}</span>
                  {location.pathname === item.path && <ChevronRight size={16} className="active-indicator" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <span className="nav-icon"><LogOut size={20} /></span>
            <span className="nav-name">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <h1 className="header-title">
              {menuItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
            </h1>
          </div>
          
          <div className="header-right">
            <button className="header-icon-btn" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-badge"></span>
            </button>
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user?.email?.split('@')[0] || 'Admin'}</span>
                <span className="user-role">Super Admin</span>
              </div>
              <div className="user-avatar">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content-area">
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
