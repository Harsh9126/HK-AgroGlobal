import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Check, Globe, Package, Shield, Truck, 
  MessageCircle, Star, Info, FileText 
} from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const foundProduct = await FirebaseService.getProductBySlug(slug);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          navigate('/products');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        navigate('/products');
      }
    }
    fetchProduct();
  }, [slug, navigate]);

  if (!product) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
      </div>
    );
  }

  const {
    name, categories, moq, origin, shelf_life, 
    packaging, description, specifications, images, rating, reviews, tags, export_available
  } = product;

  const categoryName = categories?.name || 'Agro Products';

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb & Back Button */}
        <div className="detail-header">
          <Link to="/products" className="back-btn">
            <ArrowLeft size={18} /> Back to Products
          </Link>
          <div className="breadcrumb-small">
            <Link to="/">Home</Link> <span>/</span> <Link to="/products">Products</Link> <span>/</span> <span>{name}</span>
          </div>
        </div>

        <div className="product-main-grid">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image card">
              <img src={images?.[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'} alt={name} />
              {product.featured && <span className="featured-label">⭐ Featured Export</span>}
            </div>
            {images?.length > 1 && (
              <div className="thumbnail-grid">
                {images.map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`thumb-item card ${activeImage === idx ? 'active' : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`${name} thumbnail ${idx + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-wrap">
            <div className="info-header">
              <span className="info-category">{categoryName}</span>
              <h1 className="info-title">{name}</h1>
              <div className="info-rating">
                <div className="stars">{'★'.repeat(Math.floor(rating || 5))}{'☆'.repeat(5-Math.floor(rating || 5))}</div>
                <span>{rating || 5.0} ({reviews || 24} Verified Reviews)</span>
              </div>
            </div>

            <div className="info-price-section">
              <div className="moq-badge no-price">
                <Package size={20} /> 
                <span>Minimum Order Quantity: <b>{moq || 'Contact for details'}</b></span>
              </div>
            </div>

            <p className="product-description">{description}</p>

            <div className="quick-specs-grid">
              <div className="spec-item">
                <Globe size={18} />
                <div>
                  <label>Origin</label>
                  <span>{origin || 'India'}</span>
                </div>
              </div>
              <div className="spec-item">
                <Info size={18} />
                <div>
                  <label>Shelf Life</label>
                  <span>{shelf_life || 'N/A'}</span>
                </div>
              </div>
              <div className="spec-item">
                <Package size={18} />
                <div>
                  <label>Packaging</label>
                  <span>{packaging || 'Export Standard'}</span>
                </div>
              </div>
              <div className="spec-item">
                <Truck size={18} />
                <div>
                  <label>Availability</label>
                  <span>{export_available ? 'Global Export Ready' : 'Domestic Supply Only'}</span>
                </div>
              </div>
            </div>

            <div className="info-actions">
              <Link 
                to={`/request-quote?product=${encodeURIComponent(name)}`}
                className="btn btn-primary btn-lg flex-grow"
              >
                <FileText size={20} /> Request Formal Quote
              </Link>
              <a 
                href={`https://wa.me/919999999999?text=I'm interested in ${encodeURIComponent(name)}. Requesting more information.`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent btn-lg"
              >
                <MessageCircle size={20} /> WhatsApp Inquiry
              </a>
            </div>

            <div className="trust-badges-small">
              <div className="trust-b"><Check size={14} /> FSSAI Certified</div>
              <div className="trust-b"><Check size={14} /> Export Quality</div>
              <div className="trust-b"><Check size={14} /> Premium Sourcing</div>
            </div>
          </div>
        </div>

        {/* Detail Tabs/Sections */}
        <div className="product-details-extra">
          <div className="details-tabs">
            <button className="tab-btn active">Technical Specifications</button>
            <button className="tab-btn">Packaging & Delivery</button>
            <button className="tab-btn">Certifications</button>
          </div>
          
          <div className="tab-content card">
            <div className="specs-table">
              {specifications && Object.entries(specifications).map(([key, val]) => (
                <div key={key} className="specs-row">
                  <div className="specs-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                  <div className="specs-value">{val}</div>
                </div>
              ))}
            </div>
            
            <div className="extra-info-box">
              <h3><FileText size={20} /> Export Compliance</h3>
              <p>
                All our {name} shipments comply with international export standards. We provide 
                Certification of Origin, Phytosanitary Certificates (where applicable), and detailed 
                Bill of Lading. For bulk export inquiries, please contact our dedicated export desk.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
