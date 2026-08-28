import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { FirebaseService } from '../../services/firebaseService';
import './ManageCategories.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const data = await FirebaseService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }

  const openAddModal = () => {
    setCurrentCategory({ name: '', slug: '', description: '', image_url: '', icon: '📦' });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setCurrentCategory({ ...cat });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (currentCategory.id) {
        await FirebaseService.updateCategory(currentCategory.id, currentCategory);
      } else {
        await FirebaseService.createCategory(currentCategory);
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      // Show detailed error from Firebase to help debug Rules/Permissions
      alert(`Error saving category: ${err.message || 'Unknown error'}. 
Please ensure your Firebase rules allow this operation.`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect products in this category.')) {
      setLoading(true);
      try {
        await FirebaseService.deleteCategory(id);
        fetchCategories();
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Error deleting category');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="manage-categories">
      <div className="view-header">
        <div className="header-info">
          <h2>Manage Categories</h2>
          <p>Organize your products into logical groups for easier browsing.</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="categories-grid grid-3">
        {loading ? (
          <div className="loading-state">Loading categories...</div>
        ) : categories.map((cat) => (
          <div key={cat.id} className="category-admin-card shadow-sm">
            <div className="category-card-image">
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} />
              ) : (
                <div className="image-placeholder"><ImageIcon size={40} /></div>
              )}
              <div className="category-icon-overlay">{cat.icon}</div>
            </div>
            <div className="category-card-content">
              <h3>{cat.name}</h3>
              <p className="category-slug">/{cat.slug}</p>
              <p className="category-desc">{cat.description}</p>
              <div className="category-meta">
                <span>{cat.product_count || 0} Products</span>
              </div>
              <div className="category-actions">
                <button className="icon-btn edit" onClick={() => openEditModal(cat)}>
                  <Edit2 size={16} /> Edit
                </button>
                <button className="icon-btn delete" onClick={() => handleDelete(cat.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-scaleIn" style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h3>{currentCategory?.id ? 'Edit Category' : 'Add Category'}</h3>
              <button className="close-modal" onClick={() => setModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="admin-form p-6">
              <div className="form-group mb-4">
                <label>Category Name</label>
                <input 
                  type="text" 
                  value={currentCategory.name} 
                  onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group mb-4">
                <label>Slug</label>
                <input 
                  type="text" 
                  value={currentCategory.slug} 
                  onChange={(e) => setCurrentCategory({...currentCategory, slug: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group mb-4">
                <label>Icon (Emoji)</label>
                <input 
                  type="text" 
                  value={currentCategory.icon} 
                  onChange={(e) => setCurrentCategory({...currentCategory, icon: e.target.value})}
                />
              </div>
              <div className="form-group mb-4">
                <label>Image URL</label>
                <input 
                  type="text" 
                  value={currentCategory.image_url} 
                  onChange={(e) => setCurrentCategory({...currentCategory, image_url: e.target.value})}
                />
              </div>
              <div className="form-group mb-6">
                <label>Description</label>
                <textarea 
                  rows="3"
                  value={currentCategory.description} 
                  onChange={(e) => setCurrentCategory({...currentCategory, description: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
