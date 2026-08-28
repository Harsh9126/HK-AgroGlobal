import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowRight, X } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { FirebaseService } from '../../services/firebaseService';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(categoryFilter || 'all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [pData, cData] = await Promise.all([
          FirebaseService.getProducts(),
          FirebaseService.getCategories()
        ]);
        setProducts(pData);
        setCategories(cData);
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    setActiveCategory(categoryFilter || 'all');
  }, [categoryFilter]);

  useEffect(() => {
    let result = products;

    // Filter by category — use category_id only (exact match, same as count badge)
    if (activeCategory !== 'all') {
      // Find the category whose slug matches the URL param to get its Firestore ID
      const activeCat = categories.find(c => c.slug === activeCategory);

      result = result.filter(p => activeCat && p.category_id === activeCat.id);
    }


    // Filter by search
    if (searchTerm) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(result);
  }, [activeCategory, searchTerm, products]);

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="products-page">
      {/* Page Header */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Explore Products</span>
          </div>
          <h1 className="animate-fadeInUp">Our <span>Premium Portfolio</span></h1>
          <p className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
            Browse our wide range of exported agricultural goods, featuring quality grains, spices, 
            frozen seafood, and more.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="products-layout">
            
            {/* Sidebar Filters - Desktop */}
            <aside className="products-sidebar">
              <div className="sidebar-group">
                <h3>Search Products</h3>
                <div className="search-box">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="sidebar-group">
                <h3>Categories</h3>
                <ul className="filter-list">
                  <li 
                    className={activeCategory === 'all' ? 'active' : ''} 
                    onClick={() => handleCategoryChange('all')}
                  >
                    All Categories
                  </li>
                  {categories.map(cat => (
                    <li 
                    key={cat.id} 
                    className={activeCategory === cat.slug ? 'active' : ''} 
                    onClick={() => handleCategoryChange(cat.slug)}
                    >
                      {cat.name}
                      <span className="cat-num">{cat.product_count || 0}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="sidebar-group export-promo">
                <h4>Bulk Export Inquiry?</h4>
                <p>We handle orders of any volume for international shipments.</p>
                <Link to="/request-quote" className="btn btn-primary btn-sm">Request Quote</Link>
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="products-main">
              
              {/* Controls */}
              <div className="products-controls">
                <div className="results-count">
                  Showing <b>{filteredProducts.length}</b> products 
                  {activeCategory !== 'all' && <span> in <b>{activeCategory.replace('-', ' ')}</b></span>}
                </div>
                
                <div className="mobile-filter-btn" onClick={() => setIsFilterOpen(true)}>
                  <SlidersHorizontal size={18} /> Filters
                </div>

                <div className="sort-box">
                  <label>Sort By:</label>
                  <select>
                    <option>Default</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              <div className="grid-3 animate-fadeIn">
                {loading ? (
                  <p>Loading products...</p>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="no-results">
                    <h3>No products found matching your search.</h3>
                    <p>Try using different keywords or resetting filters.</p>
                    <button className="btn btn-outline-blue btn-sm" onClick={() => {setSearchTerm(''); handleCategoryChange('all')}}>
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <div className={`filter-drawer ${isFilterOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Filters</h3>
          <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
        </div>
        <div className="drawer-body">
          {/* Same filters as sidebar but for mobile UI */}
          <div className="sidebar-group">
            <h3>Search</h3>
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sidebar-group">
            <h3>Categories</h3>
            <div className="mobile-cat-grid">
              <div 
                className={`mobile-cat-item ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => {handleCategoryChange('all'); setIsFilterOpen(false)}}
              >
                All
              </div>
              {categories.map(cat => (
                <div 
                  key={cat.id} 
                  className={`mobile-cat-item ${activeCategory === cat.slug ? 'active' : ''}`}
                  onClick={() => {handleCategoryChange(cat.slug); setIsFilterOpen(false)}}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{width: '100%', marginTop: 'auto'}} onClick={() => setIsFilterOpen(false)}>
            Close Filters
          </button>
        </div>
      </div>
      <div className={`drawer-overlay ${isFilterOpen ? 'active' : ''}`} onClick={() => setIsFilterOpen(false)}></div>
    </div>
  );
}
