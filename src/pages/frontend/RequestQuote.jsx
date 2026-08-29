import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  CheckCircle2, 
  Package, 
  Truck, 
  Globe
} from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import './RequestQuote.css';

const RequestQuote = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const preSelectedProduct = queryParams.get('product') || '';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone1: '',
    phone2: '',
    company: '',
    country: '',
    product: preSelectedProduct,
    quantity: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Use the generic inquiry service to post the quote request
      await FirebaseService.submitInquiry({
        ...formData,
        subject: `Quote Request: ${formData.product}`,
        status: 'new'
      });
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error('Submission Error:', err);
      setError('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="quote-success-page">
        <div className="container">
          <div className="success-content animate-scaleIn">
            <div className="success-icon">
              <CheckCircle2 size={80} />
            </div>
            <h1>Quote Request Received!</h1>
            <p>
              Thank you for choosing **HK AgroGlobal**. Our export specialists have received your inquiry 
              for **{formData.product}** and will get back to you with a competitive quote within 24 hours.
            </p>
            <div className="success-actions">
              <Link to="/products" className="btn btn-primary">Browse More Products</Link>
              <Link to="/" className="btn btn-outline">Return Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-quote-page">
      {/* Header Section */}
      <section className="quote-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <ChevronRight size={14} /> <span>Request Quote</span>
          </div>
          <h1>Get a <span>Custom Quote</span></h1>
          <p>
            Ready to expand your bulk supply or international export? Fill out the details below 
            and our team will provide you with the best available market pricing.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-grid">
            {/* Form side */}
            <div className="quote-form-card shadow-lg animate-fadeInUp">
              <form onSubmit={handleSubmit} className="quote-form">
                <div className="form-section-title">
                  <span className="step-num">1</span>
                  <h3>Contact Information</h3>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Work Email *</label>
                    <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="e.g. john@company.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone1">Primary Contact Number *</label>
                    <input type="tel" id="phone1" name="phone1" required value={formData.phone1} onChange={handleChange} placeholder="+91 XXXX XXXX XX" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone2">Secondary Contact Number (Optional)</label>
                    <input type="tel" id="phone2" name="phone2" value={formData.phone2} onChange={handleChange} placeholder="+91 XXXX XXXX XX" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company Name</label>
                  <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Your Company Ltd." />
                </div>

                <div className="form-section-title mt-8">
                  <span className="step-num">2</span>
                  <h3>Inquiry Details</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="product">Product / Category of Interest *</label>
                  <input 
                    type="text" 
                    id="product" 
                    name="product" 
                    required 
                    value={formData.product} 
                    onChange={handleChange} 
                    placeholder="e.g. Frozen Rohu Fish, Basmati Rice..."
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="quantity">Required Quantity (Est.)</label>
                    <input type="text" id="quantity" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="e.g. 5 MT, 1000 Boxes" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Destination Country</label>
                    <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Country name" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Additional Requirements / Custom Note</label>
                  <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} placeholder="Share specific shipping instructions, packaging needs, or quality grades..."></textarea>
                </div>

                {error && <div className="form-error-msg">{error}</div>}

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Processing Request...' : 'Send Quote Request'} <Send size={18} />
                </button>
                <p className="form-disclaimer">
                  * By submitting, you agree to being contacted by our sales team. Your data is secure and will only be used for this inquiry.
                </p>
              </form>
            </div>

            {/* Sidebar Info */}
            <div className="quote-sidebar flex-column">
              <div className="info-card animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <h3>Why choose HK AgroGlobal?</h3>
                <ul className="benefits-list">
                  <li>
                    <div className="benefit-icon"><CheckCircle2 size={20} /></div>
                    <div>
                      <h4>Direct-Source Pricing</h4>
                      <p>Skip middlemen and get the best farm-gate or production-line rates.</p>
                    </div>
                  </li>
                  <li>
                    <div className="benefit-icon"><Package size={20} /></div>
                    <div>
                      <h4>Custom Packaging</h4>
                      <p>We provide private labeling and custom export packaging options.</p>
                    </div>
                  </li>
                  <li>
                    <div className="benefit-icon"><Truck size={20} /></div>
                    <div>
                      <h4>Global Logistics</h4>
                      <p>End-to-end shipping solutions by air, sea, or land to 10+ countries.</p>
                    </div>
                  </li>
                  <li>
                    <div className="benefit-icon"><Globe size={20} /></div>
                    <div>
                      <h4>Full Certification</h4>
                      <p>All products arrive with FSSAI, APEDA, ISO, or Halal certification.</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="support-card animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <h4>Need Immediate Help?</h4>
                <p>Chat directly with our export consultants on WhatsApp for faster processing.</p>
                <a href="https://wa.me/919999999999" className="btn btn-outline btn-block" target="_blank" rel="noreferrer">
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RequestQuote;
