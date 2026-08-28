import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';

// Frontend Pages
import Home from './pages/frontend/Home';
import Products from './pages/frontend/Products';
import ProductDetail from './pages/frontend/ProductDetail';
import Export from './pages/frontend/Export';
import About from './pages/frontend/About';
import Contact from './pages/frontend/Contact';
import RequestQuote from './pages/frontend/RequestQuote';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManageCategories from './pages/admin/ManageCategories';
import ManageCertificates from './pages/admin/ManageCertificates';
import ManageInquiries from './pages/admin/ManageInquiries';
import Login from './pages/admin/Login';

import './App.css';

/**
 * Global Error Boundary
 * Catches runtime crashes and displays a readable error.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AgroGlobal Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#b91c1c' }}>Something went wrong.</h1>
          <p>The application encountered a runtime error.</p>
          <pre style={{ 
            background: '#f1f5f9', padding: '16px', borderRadius: '8px', 
            display: 'inline-block', textAlign: 'left', marginTop: '20px' 
          }}>
            {this.state.error?.toString()}
          </pre>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => window.location.reload()} style={{
              padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer'
            }}>
              Reload Website
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="app-wrapper">
            <Routes>
              {/* Public Routes with Navbar and Footer */}
              <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
              <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
              <Route path="/products/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
              <Route path="/export" element={<PublicLayout><Export /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
              <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path="/request-quote" element={<PublicLayout><RequestQuote /></PublicLayout>} />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<Login />} />

              {/* Admin Routes - Protected */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products"      element={<ManageProducts />} />
                <Route path="categories"    element={<ManageCategories />} />
                <Route path="certificates"  element={<ManageCertificates />} />
                <Route path="inquiries"     element={<ManageInquiries />} />
              </Route>
            
              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            {/* Global WhatsApp Float */}
            <a 
              href="https://wa.me/919999999999" 
              className="whatsapp-float" 
              target="_blank" 
              rel="noreferrer"
              aria-label="Contact on WhatsApp"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
