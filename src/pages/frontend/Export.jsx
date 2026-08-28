import { Globe, Shield, Truck, FileCheck, Anchor, Box, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportCountries, certifications } from '../../data/mockData';
import './Export.css';

export default function Export() {
  return (
    <div className="export-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Export Services</span>
          </div>
          <h1 className="animate-fadeInUp">Global <span>Supply Chain</span></h1>
          <p className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            Navigating international markets with precision. We specialize in the bulk export of 
            premium agro-products to over 50 countries across 5 continents.
          </p>
        </div>
      </section>

      {/* Export Process */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Methodology</span>
            <h2 className="section-title">Our <span>Export Process</span></h2>
            <p className="section-subtitle">A transparent, step-by-step approach to ensuring your order reaches you safely and on time.</p>
          </div>

          <div className="process-grid">
            {[
              { icon: <Box />, title: "1. Sourcing & Quality", desc: "Premium sourcing directly from farms and manufacturers with strict QC." },
              { icon: <FileCheck />, title: "2. Documentation", desc: "Handling all export permits, certificates of origin, and custom filings." },
              { icon: <Shield />, title: "3. Inspection", desc: "Third-party inspections (SGS/Bureau Veritas) to verify quality before loading." },
              { icon: <Truck />, title: "4. Cold Chain / Logistics", desc: "Expert handling of perishables with temperature-controlled logistics." },
              { icon: <Anchor />, title: "5. Shipping & Delivery", desc: "Coordinating sea and air freight for timely door-to-port delivery." }
            ].map((step, idx) => (
              <div key={idx} className="process-item card">
                <div className="process-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Map / List */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag red">Global Presence</span>
            <h2 className="section-title">Countries <span>We Serve</span></h2>
            <p className="section-subtitle">AgroGlobal products are trusted by importers in these major markets.</p>
          </div>

          <div className="countries-grid grid-4">
            {exportCountries.map((country, idx) => (
              <div key={idx} className="country-card card">
                <div className="country-flag">{country.flag}</div>
                <div className="country-info">
                  <h3>{country.name}</h3>
                  <div className="import-chips">
                    {country.imports.map(imp => (
                      <span key={imp} className="import-chip">{imp}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Block */}
      <section className="section">
        <div className="container">
          <div className="cert-banner-inner bg-primary">
            <div className="cert-banner-content">
              <h2>Export <span>Compliance</span> & Quality</h2>
              <p>
                We are fully registered with APEDA, FSSAI, and EIC. Every shipment is accompanied 
                by necessary health and analysis certificates required by the importing country.
              </p>
              <div className="cert-row">
                {certifications.map((c, i) => (
                  <div key={i} className="cert-mini">
                    <span className="cert-dot"></span>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
              <Link to="/contact" className="btn btn-accent btn-lg">
                Inquire for Bulk Export <ArrowRight size={18} />
              </Link>
            </div>
            <div className="cert-banner-image">
              <Globe size={160} color="rgba(255,255,255,0.1)" strokeWidth={1} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
