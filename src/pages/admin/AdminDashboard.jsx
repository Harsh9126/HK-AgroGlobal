import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Layers, 
  Mail, 
  TrendingUp, 
  Users, 
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FirebaseService } from '../../services/firebaseService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    newInquiries: 0,
    avgGrowth: '+12.5%'
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [products, categories, inquiries] = await Promise.all([
          FirebaseService.getProducts(),
          FirebaseService.getCategories(),
          FirebaseService.getInquiries()
        ]);

        setStats({
          totalProducts: products.length,
          totalCategories: categories.length,
          newInquiries: inquiries.filter(i => i.status === 'new').length,
          avgGrowth: '+12.5%'
        });

        setRecentInquiries(inquiries.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: <Package />, color: 'blue', link: '/admin/products' },
    { title: 'Categories', value: stats.totalCategories, icon: <Layers />, color: 'purple', link: '/admin/categories' },
    { title: 'New Inquiries', value: stats.newInquiries, icon: <Mail />, color: 'orange', link: '/admin/inquiries' },
    { title: 'Global Exports', value: '15+', icon: <TrendingUp />, color: 'green', link: '#' },
  ];

  if (loading) {
    return <div className="admin-loading">Loading Dashboard...</div>;
  }

  return (
    <div className="dashboard-view">
      <div className="dashboard-header animate-fadeIn">
        <div className="welcome-text">
          <h2>Dashboard Overview</h2>
          <p>Welcome back! Here's what's happening with HK AgroGlobal today.</p>
        </div>
        <div className="header-actions">
          <Link to="/admin/products" className="dashboard-btn btn-primary">
            <Plus size={18} /> Add New Product
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className={`stat-card ${card.color}`}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-content">
              <span className="stat-label">{card.title}</span>
              <span className="stat-value">{card.value}</span>
            </div>
            <Link to={card.link} className="stat-link">
              <ExternalLink size={14} />
            </Link>
          </div>
        ))}
      </div>

      <div className="dashboard-main-grid">
        {/* Recent Inquiries */}
        <div className="dashboard-card recent-inquiries-card">
          <div className="card-header">
            <h3>Recent Inquiries</h3>
            <Link to="/admin/inquiries" className="view-all-link">View All</Link>
          </div>
          <div className="card-body">
            {recentInquiries.length > 0 ? (
              <div className="inquiry-list">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="inquiry-item">
                    <div className="inquiry-avatar">
                      {inquiry.name.charAt(0)}
                    </div>
                    <div className="inquiry-info">
                      <div className="inquiry-header">
                        <span className="inquiry-name">{inquiry.name}</span>
                        <span className="inquiry-time">
                          <Clock size={12} /> {new Date(inquiry.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="inquiry-subject">{inquiry.subject || 'Product Inquiry'}</div>
                    </div>
                    <div className={`status-badge ${inquiry.status || 'new'}`}>
                      {inquiry.status || 'new'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent inquiries found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / System Status */}
        <div className="dashboard-card status-card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions-grid">
              <button className="action-btn">Update MOQ</button>
              <button className="action-btn">Export Inventory</button>
              <button className="action-btn">Manage Team</button>
              <button className="action-btn">System Logs</button>
            </div>
            
            <div className="system-health">
              <h4>System Status</h4>
              <div className="health-item">
                <span className="health-label">API Status</span>
                <span className="health-status online">Online</span>
              </div>
              <div className="health-item">
                <span className="health-label">Database</span>
                <span className="health-status online">Connected</span>
              </div>
              <div className="health-item">
                <span className="health-label">Last Backup</span>
                <span className="health-status">Oct 24, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
