import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Send, MessageCircle, Clock, 
  Globe, Facebook, Instagram, Linkedin, Twitter, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { FirebaseService } from '../../services/firebaseService';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone1: '',
    phone2: '',
    subject: '',
    message: '',
    interest: 'General'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await FirebaseService.submitInquiry({
        ...formData,
        status: 'new'
      });
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone1: '',
        phone2: '',
        subject: '',
        message: '',
        interest: 'General'
      });
    } catch (err) {
      console.error('Submission Error:', err);
      alert('Error sending inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Contact Us</span>
          </div>
          <h1 className="animate-fadeInUp">Get in <span>Touch</span></h1>
          <p className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            Have questions about our bulk export services? Our dedicated export team is 
            ready to assist you with custom quotes and shipping logistics.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section bg-white">
        <div className="container contact-main-grid">
          
          {/* Info Side */}
          <div className="contact-info-panel">
            <div className="info-block">
              <span className="section-tag red">Contact Details</span>
              <h2 className="section-title">Reach <span>Out to Us</span></h2>
              <p>
                We are available 24/7 for our international clients via WhatsApp and Email. 
                Our office hours are Monday to Saturday, 9 AM to 7 PM IST.
              </p>
            </div>

            <div className="contact-methods">
              <div className="contact-method-card card">
                <div className="cm-icon"><Phone /></div>
                <div className="cm-text">
                  <label>Call Us</label>
                  <span>+91 99999 99999</span>
                </div>
              </div>
              <div className="contact-method-card card">
                <div className="cm-icon"><Mail /></div>
                <div className="cm-text">
                  <label>Email Us</label>
                  <span>info@agroglobal.in</span>
                </div>
              </div>
              <div className="contact-method-card card">
                <div className="cm-icon"><MessageCircle /></div>
                <div className="cm-text">
                  <label>WhatsApp</label>
                  <span>+91 88888 88888</span>
                </div>
              </div>
              <div className="contact-method-card card">
                <div className="cm-icon"><MapPin /></div>
                <div className="cm-text">
                  <label>Our Office</label>
                  <span>Gurugram, Haryana, India</span>
                </div>
              </div>
            </div>

            <div className="social-connect">
              <h4>Follow Our Global Journey</h4>
              <div className="social-row">
                <a href="#"><Facebook /></a>
                <a href="#"><Instagram /></a>
                <a href="#"><Linkedin /></a>
                <a href="#"><Twitter /></a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="contact-form-panel card">
            <h3 className="form-head">Send an <span>Export Inquiry</span></h3>
            {isSubmitted ? (
              <div className="contact-success-msg text-center p-8 bg-green-50 rounded-xl">
                <Shield size={40} className="text-green-500 mx-auto mb-4" />
                <h3>Inquiry Sent Recently!</h3>
                <p>Thank you for reaching out. Our team will contact you within 24 hours.</p>
                <button className="btn btn-outline mt-4" onClick={() => setIsSubmitted(false)}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" id="name" placeholder="Enter name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" placeholder="example@mail.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Primary Phone *</label>
                    <input type="tel" id="phone1" placeholder="+91 XXXX" value={formData.phone1} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Secondary Phone (Opt)</label>
                    <input type="tel" id="phone2" placeholder="+91 XXXX" value={formData.phone2} onChange={handleChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Interested In</label>
                  <select id="interest" value={formData.interest} onChange={handleChange}>
                    <option value="General">General Inquiry</option>
                    <option value="Export">Bulk Export Quote</option>
                    <option value="Domestic">Domestic Supply</option>
                    <option value="Partnership">Partnership Opportunities</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input type="text" id="subject" placeholder="Export to UAE / Order Inquiry" value={formData.subject} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Your Message</label>
                  <textarea id="message" rows="5" placeholder="Please specify product, quantity, and destination port..." value={formData.message} onChange={handleChange} required></textarea>
                </div>

                <button type="submit" className="btn btn-accent btn-lg w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending Request...' : <><Send size={18} /> Send Inquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section bg-off-white map-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Location</span>
            <h2 className="section-title">Our <span>Corporate Office</span></h2>
          </div>
          
          <div className="map-wrapper card">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13912.446864190848!2d76.974955!3d29.3909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dd977f6b96fb1%3A0x6b106969562a1945!2sPanipat%2C%20Haryana!5e0!3m2!1sen!2sin!4v1712411000000!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{border:0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Global Clock (Extra Polish) */}
      <section className="section bg-primary time-section">
        <div className="container">
          <div className="time-grid">
            <div className="time-item">
              <Globe />
              <div>
                <label>Global Desk</label>
                <span>Active 24/7</span>
              </div>
            </div>
            <div className="time-item">
              <Clock />
              <div>
                <label>Avg Response Time</label>
                <span>Under 2 Hours</span>
              </div>
            </div>
            <div className="time-item">
              <Shield />
              <div>
                <label>Compliance Ready</label>
                <span>Docs & Permits</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
