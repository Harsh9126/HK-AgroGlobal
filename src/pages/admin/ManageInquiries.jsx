import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Eye, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import './ManageInquiries.css';

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);
    try {
      const data = await FirebaseService.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await FirebaseService.updateInquiryStatus(id, status);
      setInquiries(inquiries.map(inc => inc.id === id ? { ...inc, status } : inc));
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this inquiry?')) {
      // Logic for delete inquiry...
      setInquiries(inquiries.filter(inc => inc.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const filteredInquiries = inquiries.filter(inc => {
    const matchesSearch = inc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inc.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="manage-inquiries">
      <div className="inquiries-container">
        {/* Left Sidebar List */}
        <div className="inquiry-sidebar shadow-sm">
          <div className="sidebar-header">
            <h3>Inbox</h3>
            <div className="sidebar-filters">
              <div className="search-mini">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>

          <div className="inquiry-list-panel">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : filteredInquiries.length > 0 ? (
              filteredInquiries.map((inc) => (
                <div 
                  key={inc.id} 
                  className={`inquiry-list-item ${selectedInquiry?.id === inc.id ? 'active' : ''} ${inc.status === 'new' ? 'unread' : ''}`}
                  onClick={() => setSelectedInquiry(inc)}
                >
                  <div className="item-avatar">{inc.name.charAt(0)}</div>
                  <div className="item-info">
                    <div className="item-top">
                      <span className="item-name">{inc.name}</span>
                      <span className="item-date">{new Date(inc.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="item-subject">{inc.subject || 'Inquiry'}</div>
                    <div className="item-snippet">{inc.message.substring(0, 45)}...</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state p-8 text-center text-gray-500">
                <Mail size={40} className="mb-2 opacity-20" />
                <p>No messages found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Pane */}
        <div className="inquiry-detail shadow-sm">
          {selectedInquiry ? (
            <div className="detail-view">
              <div className="detail-header">
                <div className="detail-user-main">
                  <div className="detail-avatar">{selectedInquiry.name.charAt(0)}</div>
                  <div>
                    <h2>{selectedInquiry.name}</h2>
                    <p className="detail-email">{selectedInquiry.email}</p>
                  </div>
                </div>
                <div className="detail-actions">
                  {selectedInquiry.status === 'new' && (
                    <button className="btn-action green" onClick={() => handleStatusUpdate(selectedInquiry.id, 'read')}>
                      <CheckCircle size={18} /> Mark as Read
                    </button>
                  )}
                  <button className="btn-action red" onClick={() => handleDelete(selectedInquiry.id)}>
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>

              <div className="detail-body">
                <div className="info-grid">
                  <div className="info-item">
                    <label><Phone size={14} /> Phone</label>
                    <p>{selectedInquiry.phone || 'N/A'}</p>
                  </div>
                  <div className="info-item">
                    <label><Clock size={14} /> Received</label>
                    <p>{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                  </div>
                  <div className="info-item">
                    <label><MessageSquare size={14} /> Subject</label>
                    <p>{selectedInquiry.subject || 'Product Inquiry / Quote Request'}</p>
                  </div>
                </div>

                <div className="message-content">
                  <label>Message Content</label>
                  <div className="message-text">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="reply-section">
                  <textarea placeholder="Type a reply note or send via your external email..."></textarea>
                  <div className="reply-footer">
                    <p className="text-gray-400 text-xs">Note: Replying here only adds a reference. Use your email client to send the actual response.</p>
                    <button className="btn-primary" onClick={() => handleStatusUpdate(selectedInquiry.id, 'replied')}>
                      Mark as Replied
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              <Mail size={80} className="mb-4 opacity-10" />
              <h3>No Message Selected</h3>
              <p>Select an inquiry from the inbox on the left to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageInquiries;
