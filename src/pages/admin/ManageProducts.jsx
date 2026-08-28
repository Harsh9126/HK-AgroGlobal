import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Check,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import './ManageProducts.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [pData, cData] = await Promise.all([
        FirebaseService.getProducts(),
        FirebaseService.getCategories()
      ]);
      setProducts(pData);
      setCategories(cData);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await FirebaseService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Error deleting product');
      }
    }
  };

  const openAddModal = () => {
    setCurrentProduct({
      name: '',
      slug: '',
      category_id: categories[0]?.id || '',
      price: '',
      unit: 'kg',
      description: '',
      in_stock: true,
      featured: false,
      export_available: true,
      moq: '500 kg',
      origin: 'India',
      shelf_life: '12 months',
      packaging: 'Standard export packaging',
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setCurrentProduct({ ...product });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      // Find the selected category name and slug to store them with the product
      const category = categories.find(c => c.id === currentProduct.category_id);
      const productWithMeta = {
        ...currentProduct,
        category: category?.name || 'Uncategorized',
        category_slug: category?.slug || ''
      };

      if (currentProduct.id) {
        await FirebaseService.updateProduct(currentProduct.id, productWithMeta);
      } else {
        await FirebaseService.createProduct(productWithMeta);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving product:', err);
      const msg = err.code === 'permission-denied' 
        ? 'Permission Denied: Please try logging out and logging back in.'
        : `Error saving product: ${err.message || 'Unknown error'}.`;
      alert(msg);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Use == to handle string vs number comparison for category ID
    const matchesCategory = selectedCategory === 'all' || p.category_id == selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="manage-products">
      <div className="view-header">
        <div className="header-info">
          <h2>Manage Products</h2>
          <p>Total {products.length} products found in the database.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={18} className="filter-icon" />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="table-container shadow-sm">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-40">Product</th>
              <th>Category</th>
              <th>Inventory</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Loading products...</td></tr>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td className="product-cell">
                    <div className="product-info-mini">
                      <div className="product-image-mini">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" /> : <Package size={20} />}
                      </div>
                      <div>
                        <div className="product-name">{p.name}</div>
                        <div className="product-slug">/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="category-tag">
                      {categories.find(c => c.id === p.category_id)?.name || p.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td>
                    <span className={`stock-status ${p.in_stock ? 'in' : 'out'}`}>
                      {p.in_stock ? <Check size={12} /> : <X size={12} />}
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    {p.featured && <span className="featured-star">★</span>}
                  </td>
                  <td className="actions-cell">
                    <div className="action-btns">
                      <button className="icon-btn edit" onClick={() => openEditModal(p)} title="Edit">
                         <Edit2 size={16} />
                      </button>
                      <button className="icon-btn delete" onClick={() => handleDelete(p.id)} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-4">No products found matching your criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-scaleIn">
            <div className="modal-header">
              <h3>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-modal" onClick={() => setModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input 
                    type="text" 
                    value={currentProduct.name} 
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Slug (URL Handle)</label>
                  <input 
                    type="text" 
                    value={currentProduct.slug} 
                    onChange={(e) => setCurrentProduct({...currentProduct, slug: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={currentProduct.category_id} 
                    onChange={(e) => setCurrentProduct({...currentProduct, category_id: e.target.value})}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                   {/* Spanning or adding a second field here for layout balance */}
                   <label>MOQ (Min. Order Quantity)</label>
                   <input 
                     type="text" 
                     value={currentProduct.moq} 
                     onChange={(e) => setCurrentProduct({...currentProduct, moq: e.target.value})}
                     placeholder="e.g. 500 kg, 10 MT"
                   />
                </div>
                <div className="form-group full-width">
                   <label>Product Image URL</label>
                   <div className="image-input-wrap">
                     <input 
                       type="text" 
                       value={currentProduct.images?.[0] || ''} 
                       onChange={(e) => setCurrentProduct({...currentProduct, images: [e.target.value]})}
                       placeholder="https://images.unsplash.com/photo-..."
                     />
                     {currentProduct.images?.[0] && (
                       <div className="image-preview-mini">
                         <img src={currentProduct.images[0]} alt="Preview" />
                       </div>
                     )}
                   </div>
                   <small className="form-help">Paste a link to an image (Unsplash, imgur, etc.)</small>
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Description</label>
                <textarea 
                  rows="4"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                ></textarea>
              </div>

              <div className="form-row toggle-row">
                <label className="toggle-label">
                  <input 
                    type="checkbox" 
                    checked={currentProduct.in_stock} 
                    onChange={(e) => setCurrentProduct({...currentProduct, in_stock: e.target.checked})}
                  />
                  <span>In Stock</span>
                </label>
                <label className="toggle-label">
                  <input 
                    type="checkbox" 
                    checked={currentProduct.featured} 
                    onChange={(e) => setCurrentProduct({...currentProduct, featured: e.target.checked})}
                  />
                  <span>Featured Product</span>
                </label>
                <label className="toggle-label">
                  <input 
                    type="checkbox" 
                    checked={currentProduct.export_available} 
                    onChange={(e) => setCurrentProduct({...currentProduct, export_available: e.target.checked})}
                  />
                  <span>Available for Export</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
