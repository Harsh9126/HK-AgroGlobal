import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter, Youtube, ArrowRight, Globe } from 'lucide-react'
import './Footer.css'

const footerLinks = {
  products: [
    { label: 'Frozen Fish', path: '/products?category=frozen-fish' },
    { label: 'Table Eggs', path: '/products?category=table-eggs' },
    { label: 'Grains & Rice', path: '/products?category=grains-rice' },
    { label: 'Spices', path: '/products?category=spices' },
    { label: 'Poultry Feed', path: '/products?category=poultry-feed' },
    { label: 'Fruits & Vegetables', path: '/products?category=fruits' },
  ],
  company: [
    { label: 'About Us', path: '/about' },
    { label: 'Export Services', path: '/export' },
    { label: 'Certifications', path: '/about#certifications' },
    { label: 'Infrastructure', path: '/about#infrastructure' },
    { label: 'Contact Us', path: '/contact' },
  ],
  support: [
    { label: 'Request a Quote', path: '/contact' },
    { label: 'WhatsApp Inquiry', path: 'https://wa.me/919999999999' },
    { label: 'Shipping Info', path: '/export' },
    { label: 'Quality Standards', path: '/about#certifications' },
    { label: 'MOQ Guidelines', path: '/products' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* CTA Band */}
      <div className="footer-cta-band">
        <div className="container footer-cta-inner">
          <div>
            <h3>Ready to Start Exporting?</h3>
            <p>Get a custom quote for bulk orders. Our export team responds within 24 hours.</p>
          </div>
          <div className="footer-cta-actions">
            <Link to="/contact" className="btn btn-accent btn-lg">
              Request Export Quote <ArrowRight size={18} />
            </Link>
            <a href="https://wa.me/919999999999" className="btn btn-outline btn-lg" target="_blank" rel="noreferrer">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <div className="logo-icon"><span>AG</span></div>
                <div className="logo-text">
                  <span className="logo-primary">HK Agro</span>
                  <span className="logo-accent">Global</span>
                </div>
              </Link>
              <p className="footer-tagline">
                India's premium agro-food exporter, connecting global markets with certified quality products across 10+ countries.
              </p>
              <div className="footer-contact-items">
                <div className="footer-contact-item">
                  <MapPin size={16} />
                  <span>Gurugram, Haryana, India</span>
                </div>
                <div className="footer-contact-item">
                  <Phone size={16} />
                  <a href="tel:+919999999999">+91 99999 99999</a>
                </div>
                <div className="footer-contact-item">
                  <Mail size={16} />
                  <a href="mailto:info@agroglobal.in">info@agroglobal.in</a>
                </div>
                <div className="footer-contact-item">
                  <Globe size={16} />
                  <span>www.agroglobal.in</span>
                </div>
              </div>
              <div className="footer-social">
                <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
                <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
                <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
              </div>
            </div>

            {/* Products */}
            <div className="footer-links-col">
              <h4>Products</h4>
              <ul>
                {footerLinks.products.map(l => (
                  <li key={l.path}><Link to={l.path}><ArrowRight size={12} />{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="footer-links-col">
              <h4>Company</h4>
              <ul>
                {footerLinks.company.map(l => (
                  <li key={l.path}><Link to={l.path}><ArrowRight size={12} />{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="footer-links-col">
              <h4>Quick Support</h4>
              <ul>
                {footerLinks.support.map(l => (
                  <li key={l.path}><Link to={l.path}><ArrowRight size={12} />{l.label}</Link></li>
                ))}
              </ul>

              <div className="footer-cert-badges">
                <h4 style={{marginBottom:'12px', marginTop:'24px'}}>Certifications</h4>
                <div className="cert-badge-row">
                  {['FSSAI', 'APEDA', 'EIC', 'ISO', 'HALAL'].map(c => (
                    <span key={c} className="cert-badge">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {year} HK AgroGlobal Export & Supply. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
