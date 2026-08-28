import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, X, Upload, ExternalLink } from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import './ManageCertificates.css';

const EMOJI_OPTIONS = ['✅', '🌿', '🐟', '🏆', '☪️', '🌾', '🎖️', '🔰', '⭐', '🛡️', '📜', '🏅'];

const emptyForm = {
  name: '',
  description: '',
  icon: '🏆',
  image_url: '',
  issuer: '',
  valid_until: '',
  order: 0,
};

const ManageCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [isModalOpen, setModalOpen]     = useState(false);
  const [current, setCurrent]           = useState(null);
  const [saving, setSaving]             = useState(false);
  const [toast, setToast]               = useState(null);

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  async function fetchData() {
    setLoading(true);
    try {
      const data = await FirebaseService.getCertificates();
      setCertificates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const openAdd  = () => { setCurrent({ ...emptyForm }); setModalOpen(true); };
  const openEdit = (cert) => { setCurrent({ ...cert }); setModalOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    try {
      await FirebaseService.deleteCertificate(id);
      setCertificates(prev => prev.filter(c => c.id !== id));
      showToast('Certificate deleted.');
    } catch (err) {
      showToast('Error deleting certificate.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (current.id) {
        await FirebaseService.updateCertificate(current.id, current);
        showToast('Certificate updated!');
      } else {
        await FirebaseService.createCertificate(current);
        showToast('Certificate added!');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const set = (field, val) => setCurrent(prev => ({ ...prev, [field]: val }));

  return (
    <div className="manage-certs">

      {/* Toast */}
      {toast && (
        <div className={`cert-toast ${toast.type}`}>{toast.msg}</div>
      )}

      {/* Header */}
      <div className="view-header">
        <div className="header-info">
          <h2>Manage Certificates</h2>
          <p>{certificates.length} certificate{certificates.length !== 1 ? 's' : ''} — changes appear live on the website.</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <Plus size={18} /> Add Certificate
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="cert-loading">Loading certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="cert-empty">
          <Award size={48} />
          <p>No certificates yet. Click <strong>Add Certificate</strong> to get started.</p>
        </div>
      ) : (
        <div className="certs-grid">
          {certificates.map(cert => (
            <div key={cert.id} className="cert-card">
              {/* Image / Icon */}
              <div className="cert-card-top">
                {cert.image_url ? (
                  <img src={cert.image_url} alt={cert.name} className="cert-img" />
                ) : (
                  <div className="cert-icon-display">{cert.icon || '🏆'}</div>
                )}
              </div>
              <div className="cert-card-body">
                <h3>{cert.name}</h3>
                {cert.issuer && <p className="cert-issuer">Issued by: {cert.issuer}</p>}
                <p className="cert-desc">{cert.description}</p>
                {cert.valid_until && (
                  <span className="cert-validity">Valid until: {cert.valid_until}</span>
                )}
              </div>
              <div className="cert-card-actions">
                <button className="icon-btn edit" onClick={() => openEdit(cert)} title="Edit">
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(cert.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && current && (
        <div className="modal-overlay">
          <div className="modal-content animate-scaleIn" style={{ maxWidth: '560px' }}>
            <div className="modal-header">
              <h3>{current.id ? 'Edit Certificate' : 'Add Certificate'}</h3>
              <button className="close-modal" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="cert-form">

              {/* Certificate Name */}
              <div className="form-group">
                <label>Certificate Name *</label>
                <input
                  type="text"
                  value={current.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="e.g. FSSAI, ISO 22000, HALAL"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  rows="3"
                  value={current.description}
                  onChange={e => set('description', e.target.value)}
                  placeholder="Brief description of what this certificate represents"
                  required
                />
              </div>

              {/* Issuer & Validity side by side */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Issuing Authority</label>
                  <input
                    type="text"
                    value={current.issuer}
                    onChange={e => set('issuer', e.target.value)}
                    placeholder="e.g. FSSAI, BIS, ISO"
                  />
                </div>
                <div className="form-group">
                  <label>Valid Until</label>
                  <input
                    type="text"
                    value={current.valid_until}
                    onChange={e => set('valid_until', e.target.value)}
                    placeholder="e.g. Dec 2026 or Lifetime"
                  />
                </div>
              </div>

              {/* Icon picker */}
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <div className="emoji-picker">
                  {EMOJI_OPTIONS.map(em => (
                    <button
                      key={em}
                      type="button"
                      className={`emoji-btn ${current.icon === em ? 'selected' : ''}`}
                      onClick={() => set('icon', em)}
                    >
                      {em}
                    </button>
                  ))}
                  <input
                    type="text"
                    className="emoji-custom"
                    value={current.icon}
                    onChange={e => set('icon', e.target.value)}
                    placeholder="Custom emoji"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Certificate Image URL */}
              <div className="form-group">
                <label>Certificate Image / Badge URL (optional)</label>
                <div className="image-input-wrap">
                  <input
                    type="text"
                    value={current.image_url}
                    onChange={e => set('image_url', e.target.value)}
                    placeholder="https://example.com/certificate-badge.png"
                  />
                  {current.image_url && (
                    <div className="image-preview-mini">
                      <img src={current.image_url} alt="Preview" />
                    </div>
                  )}
                </div>
                <small className="form-help">
                  Paste a direct link to the certificate logo/badge image. Leave blank to use the emoji icon.
                </small>
              </div>

              {/* Display Order */}
              <div className="form-group">
                <label>Display Order</label>
                <input
                  type="number"
                  value={current.order}
                  onChange={e => set('order', parseInt(e.target.value) || 0)}
                  min="0"
                />
                <small className="form-help">Lower number = shown first on the website.</small>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : current.id ? 'Update Certificate' : 'Add Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCertificates;
