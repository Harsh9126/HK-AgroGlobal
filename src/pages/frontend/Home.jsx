import { useState, useEffect } from 'react';
import { ArrowRight, Globe, Shield, Truck, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { FirebaseService } from '../../services/firebaseService';
import { certifications as mockCerts, testimonials, stats } from '../../data/mockData';
import './Home.css';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [cData, pData, certData] = await Promise.all([
          FirebaseService.getCategories(),
          FirebaseService.getProducts(),
          FirebaseService.getCertificates()
        ]);
        setCategories(cData);
        setFeaturedProducts(pData.filter(p => p.featured).slice(0, 4));

        // Filter out any Firebase certs that were saved with empty names
        const validFirebaseCerts = certData.filter(c => c.name && c.name.trim() !== '');
        if (validFirebaseCerts.length > 0) {
          // Use Firebase certs; add any mockData certs not already covered
          const firebaseNames = validFirebaseCerts.map(c => c.name.toLowerCase());
          const extraMock = mockCerts.filter(m => !firebaseNames.includes(m.name.toLowerCase()));
          setCertificates([...validFirebaseCerts, ...extraMock]);
        } else {
          // No valid Firebase certs — show all mockData defaults
          setCertificates(mockCerts);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
        setCertificates(mockCerts);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content animate-fadeInUp">
            <span className="section-tag">Global Exporter & Supplier</span>
            <h1 className="hero-title">
              Premium <span>Agro Products</span> <br /> 
              Supplied Worldwide
            </h1>
            <p className="hero-description">
              Connecting global markets with India's finest agricultural, food, and feed products. 
              Certified quality, transparent logistics, and sustainable sourcing.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Products <ArrowRight size={18} />
              </Link>
              <Link to="/request-quote" className="btn btn-outline btn-lg">
                Request Quote
              </Link>
            </div>
            
            <div className="hero-stats">
              {stats.slice(0, 3).map((stat, idx) => (
                <div key={idx} className="hero-stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hero-image-wrap animate-float">
            <div className="hero-image-bg"></div>
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80" 
              alt="Premium Agro Products" 
              className="hero-main-img"
            />
            <div className="experience-badge">
              <span className="exp-years">2+</span>
              <span className="exp-text">Years of <br/> Excellence</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section bg-off-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Categories</span>
            <h2 className="section-title">Diverse <span>Product Portfolio</span></h2>
            <p className="section-subtitle">We supply a wide range of agricultural products tailored for both domestic supply and international export.</p>
          </div>
          
          <div className="grid-4">
            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <Link to={`/products?category=${cat.slug}`} key={cat.id} className="category-card card">
                  <div className="category-icon-box">{cat.icon || '📦'}</div>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="cat-count">{cat.product_count || 0} Products</span>
                </Link>
              ))
            ) : (
              <div className="no-data-msg">
                <p>No categories found. Start by adding them from the Admin Dashboard!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag red">Hot Picks</span>
            <h2 className="section-title">Featured <span>Export Quality</span></h2>
            <p className="section-subtitle">Discover our most in-demand products currently being shipped to major global hubs.</p>
          </div>
          
          <div className="grid-4">
            {loading ? (
              <p>Loading featured products...</p>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="no-data-msg col-span-full text-center py-8">
                <p>No featured products found yet.</p>
              </div>
            )}
          </div>
          
          <div className="center-btn" style={{marginTop: '40px', textAlign: 'center'}}>
            <Link to="/products" className="btn btn-outline-blue">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Certifications */}
      <section className="section bg-primary trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-content">
              <span className="section-tag" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}}>Reliability</span>
              <h2 className="section-title" style={{color: 'white'}}>Certified <span>Quality Standards</span></h2>
              <p style={{color: 'rgba(255,255,255,0.8)', marginBottom: '32px'}}>
                We adhere to strict international food safety and quality standards. Our certifications ensure that every product 
                leaving our facilities meets the highest benchmarks for nutrition, safety, and packaging.
              </p>
              
              <div className="cert-icons-grid">
                {certificates.map((cert, idx) => (
                  <div key={cert.id || idx} className="cert-item">
                    <span className="cert-check">{cert.icon || '✓'}</span>
                    <div>
                      <h4>{cert.name}</h4>
                      <p>{cert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="features-side">
              {[
                { icon: <Shield size={24} />, title: "Secure Logistics", desc: "End-to-end tracking for all international shipments." },
                { icon: <Zap size={24} />, title: "Rapid Fulfillment", desc: "Efficient processing to ensure product freshness." },
                { icon: <Globe size={24} />, title: "Global Network", desc: "Distributing to 10+ countries across 5 continents." },
                { icon: <Truck size={24} />, title: "Cold Storage", desc: "State-of-the-art facilities for perishable exports." }
              ].map((f, i) => (
                <div key={i} className="feature-small-card">
                  <div className="f-icon">{f.icon}</div>
                  <div>
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-off-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag red">Testimonials</span>
            <h2 className="section-title">What <span>Global Buyers</span> Say</h2>
          </div>
          
          <div className="grid-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card card">
                <div className="quote-icon">"</div>
                <p className="t-text">{t.text}</p>
                <div className="t-author">
                  <div className="t-avatar">{t.avatar}</div>
                  <div>
                    <div className="t-name">{t.name}</div>
                    <div className="t-company">{t.company}</div>
                  </div>
                </div>
                <div className="t-stars">
                  {'★'.repeat(t.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-banner-section">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-banner-content">
              <h2>Expand Your Business Globally with <span>HK AgroGlobal</span></h2>
              <p>Join hundreds of international distributors who rely on us for consistent supply and quality.</p>
              <div className="cta-btns">
                <Link to="/request-quote" className="btn btn-accent btn-lg">Start Inquiry Now</Link>
                <Link to="/export" className="btn btn-outline btn-lg">View Export Process</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
