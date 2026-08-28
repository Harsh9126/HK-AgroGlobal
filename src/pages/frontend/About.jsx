import { useState, useEffect } from 'react';
import { Shield, Target, Users, Landmark, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FirebaseService } from '../../services/firebaseService';
import { certifications as mockCerts } from '../../data/mockData';
import './About.css';

export default function About() {
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    FirebaseService.getCertificates()
      .then(data => {
        const valid = data.filter(c => c.name && c.name.trim() !== '');
        if (valid.length > 0) {
          const names = valid.map(c => c.name.toLowerCase());
          const extra = mockCerts.filter(m => !names.includes(m.name.toLowerCase()));
          setCertificates([...valid, ...extra]);
        } else {
          setCertificates(mockCerts);
        }
      })
      .catch(() => setCertificates(mockCerts));
  }, []);

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>About Us</span>
          </div>
          <h1 className="animate-fadeInUp">Our <span>Story & Mission</span></h1>
          <p className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            A heritage of quality and a future of global supply. HK AgroGlobal is committed to 
            connecting the world with premium agricultural excellence.
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section">
        <div className="container about-grid">
          <div className="about-image animate-fadeIn">
            <div className="image-stack">
              <img 
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80" 
                alt="Agro Farm" 
                className="img-main card"
              />
              <div className="img-sub card animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400&q=80" 
                  alt="Quality Control" 
                />
              </div>
            </div>
            <div className="experience-box animate-scaleIn">
              <span className="exp-num">2+</span>
              <span className="exp-txt">Years of <br/> Industry Experience</span>
            </div>
          </div>

          <div className="about-content">
            <span className="section-tag">Who We Are</span>
            <h2 className="section-title">Leading the Way in <span>Agro-Export</span></h2>
            <p>
              Founded with a vision to bridge the gap between local farmers and global markets, 
              AgroGlobal has grown into a premier export and supply house. We specialize in 
              sourcing, processing, and distributing high-quality agricultural products.
            </p>
            <p>
              Our operations are built on a foundation of trust, transparency, and timely delivery. 
              With state-of-the-art cold storage facilities and a robust logistics network, 
              we ensure that every product retains its nutritional value and freshness from 
              farm to port.
            </p>

            <div className="stats-mini">
              <div className="stat-item">
                <span className="s-val">10+</span>
                <span className="s-lbl">Global Clients</span>
              </div>
              <div className="stat-item">
                <span className="s-val">5K MT</span>
                <span className="s-lbl">Annual Volume</span>
              </div>
              <div className="stat-item">
                <span className="s-val">100%</span>
                <span className="s-lbl">Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Values</span>
            <h2 className="section-title">Centered on <span>Excellence</span></h2>
          </div>

          <div className="grid-3">
            {[
              { icon: <Shield />, title: "Quality First", desc: "We never compromise on the quality of our products, ensuring they meet international food safety standards." },
              { icon: <Target />, title: "Customer Centric", desc: "Tailoring our supply chains and product specifications to meet the unique needs of every importer." },
              { icon: <Users />, title: "Sustainable Sourcing", desc: "Partnering with farms that follow ethical and sustainable agricultural practices." }
            ].map((v, i) => (
              <div key={i} className="value-card card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="section" id="infrastructure">
        <div className="container infra-grid">
          <div className="infra-content">
            <span className="section-tag red">Facilities</span>
            <h2 className="section-title">Modern <span>Infrastructure</span></h2>
            <p>
              Our facilities are designed to handle high-volume exports while maintaining 
              product integrity.
            </p>
            <ul className="check-list">
              <li><CheckCircle2 size={18} /> Temperature-controlled cold storage units</li>
              <li><CheckCircle2 size={18} /> Advanced processing and sorting machinery</li>
              <li><CheckCircle2 size={18} /> Dedicated packaging and labeling zones</li>
              <li><CheckCircle2 size={18} /> Proximity to major export ports and airports</li>
              <li><CheckCircle2 size={18} /> In-house quality testing laboratory</li>
            </ul>
            <Link to="/contact" className="btn btn-primary btn-lg" style={{marginTop: '32px'}}>
              Tour Our Facilities <ArrowRight size={18} />
            </Link>
          </div>
          <div className="infra-images">
            <img 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80" 
              alt="Cold Storage Facility" 
              className="card"
            />
          </div>
        </div>
      </section>

      {/* Certifications Page Link */}
      <section className="section bg-primary cert-section" id="certifications">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" style={{color: 'white'}}>Trusted <span>Certifications</span></h2>
            <p style={{color: 'rgba(255,255,255,0.7)', margin: '0 auto'}}>Our commitment to quality is backed by globally recognized certifications.</p>
          </div>

          <div className="grid-3">
            {certificates.map((c, i) => (
              <div key={c.id || i} className="cert-card-alt">
                {c.image_url ? (
                  <div className="cert-img-wrap">
                    <img src={c.image_url} alt={c.name} className="cert-badge-img" />
                  </div>
                ) : (
                  <div className="cert-icon-alt">{c.icon || <Award size={32} />}</div>
                )}
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                {c.issuer && <span className="cert-small-tag">{c.issuer}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
