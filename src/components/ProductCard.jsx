import { Link } from 'react-router-dom'
import { Star, Package, Globe, MessageCircle, Info } from 'lucide-react'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const {
    id, name, slug, category, moq,
    export_available, in_stock, images, rating, reviews, tags, featured
  } = product

  return (
    <div className="product-card">
      {/* Badges */}
      <div className="product-card-badges">
        {featured && <span className="badge badge-red pc-badge">⭐ Featured</span>}
        {export_available && <span className="badge badge-blue pc-badge"><Globe size={10}/>Export</span>}
        {!in_stock && <span className="badge pc-badge out-stock">Out of Stock</span>}
      </div>

      {/* Image */}
      <Link to={`/products/${slug}`} className="product-card-img-wrap">
        <img
          src={images?.[0] || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80'}
          alt={name}
          loading="lazy"
        />
        <div className="product-card-overlay">
          <span className="overlay-hint">View Details →</span>
        </div>
      </Link>

      {/* Body */}
      <div className="product-card-body">
        <div className="product-card-category">{category}</div>
        <Link to={`/products/${slug}`}>
          <h3 className="product-card-name">{name}</h3>
        </Link>

        {/* Rating */}
        <div className="product-card-rating">
          <span className="stars">{'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}</span>
          <span className="rating-val">{rating}</span>
          <span className="rating-count">({reviews})</span>
        </div>

        {/* Tags */}
        {tags && (
          <div className="product-card-tags">
            {tags.slice(0, 3).map(t => (
              <span key={t} className="pc-tag">{t}</span>
            ))}
          </div>
        )}

        {/* info Row */}
        <div className="product-card-price-row">
          <div className="product-card-moq">
            <Package size={14} />
            <span>MOQ: {moq}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <Link to={`/products/${slug}`} className="btn btn-primary btn-sm" style={{flex:1}}>
            <Info size={14} /> View Details
          </Link>
          <a
            href={`https://wa.me/919999999999?text=I'm interested in ${encodeURIComponent(name)}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-accent btn-sm"
            style={{flex:1}}
          >
            <MessageCircle size={14} /> Inquire
          </a>
        </div>
      </div>
    </div>
  )
}
