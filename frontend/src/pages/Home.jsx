import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../services/productService";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  // Notifications (Toast) State
  const [toasts, setToasts] = useState([]);

  // Modal confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch products.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Product name is required.", "error");
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast("Please enter a valid price.", "error");
      return;
    }
    if (!description.trim()) {
      showToast("Product description is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, {
          name,
          price: Number(price),
          description,
        });
        showToast("Product updated successfully!", "success");
        setEditingId(null);
      } else {
        await addProduct({
          name,
          price: Number(price),
          description,
        });
        showToast("Product created successfully!", "success");
      }

      setName("");
      setPrice("");
      setDescription("");
      fetchProducts();
    } catch (error) {
      console.error(error);
      showToast("Failed to save product.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrigger = (id) => {
    setConfirmDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteProduct(confirmDeleteId);
      showToast("Product deleted successfully.", "success");
      setConfirmDeleteId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
      showToast("Failed to delete product.", "error");
      setConfirmDeleteId(null);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    
    // Scroll to form smoothly on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setDescription("");
  };

  // Filter & Sort Products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "priceAsc") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    if (sortBy === "nameAsc") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="app-container">
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? (
              <svg className="toast-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="toast-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4 className="modal-title">Delete Product</h4>
            <p className="modal-desc">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)" }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Area */}
      <header className="header-glass">
        <div className="brand-section">
          <div className="brand-logo-container">
            <svg className="brand-logo-icon" viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <div>
            <h1 className="app-title">Product Management System</h1>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Inventory and catalog manager</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-badge">
            Total Products:
            <span className="stat-value">{products.length}</span>
          </div>
        </div>
      </header>

      {/* Two Column Layout Grid */}
      <main className="dashboard-grid">
        {/* Left Side: Creation / Edit Form */}
        <section className="glass-card">
          <h2 className="section-title">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" style={{ color: "var(--accent-purple)" }}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            {editingId ? "Update Product" : "Create Product"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="product-name">Product Name</label>
              <div className="input-wrapper">
                <input
                  id="product-name"
                  className="form-input"
                  type="text"
                  placeholder="Enter product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <svg className="input-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product-price">Price (₹)</label>
              <div className="input-wrapper">
                <input
                  id="product-price"
                  className="form-input"
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <svg className="input-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="product-desc">Description</label>
              <div className="input-wrapper">
                <input
                  id="product-desc"
                  className="form-input"
                  type="text"
                  placeholder="Enter description details"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <svg className="input-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <circle cx="3" cy="6" r="1" />
                  <circle cx="3" cy="12" r="1" />
                  <circle cx="3" cy="18" r="1" />
                </svg>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                {submitting ? (
                  <span>Saving...</span>
                ) : editingId ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Right Side: Products Catalog */}
        <section className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" style={{ color: "var(--accent-blue)" }}>
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
              Products Catalog
            </h2>
          </div>

          {/* Catalog search/sorting bar */}
          <div className="catalog-controls">
            <div className="search-wrapper input-wrapper">
              <input
                className="form-input"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "42px" }}
              />
              <svg className="input-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <div className="sort-select-wrapper">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Default Sort</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Catalog grid */}
          {loading ? (
            <div className="products-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="skeleton-card shimmer">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-price"></div>
                  <div className="skeleton-text skeleton-desc" style={{ marginTop: "8px" }}></div>
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-container">
                <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1.5" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 15h8" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <h3 className="empty-title">No products found</h3>
              <p className="empty-desc">
                {searchQuery
                  ? "We couldn't find any products matching your search terms."
                  : "Start creating products using the form on the left."}
              </p>
            </div>
          ) : (
            <div className="products-grid">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  editingId={editingId}
                  onEdit={handleEdit}
                  onDelete={handleDeleteTrigger}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;