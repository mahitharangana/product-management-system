import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/productService";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const ALL_CATEGORIES = [
  "All",
  "Smartphones",
  "Laptops",
  "Audio",
  "Wearables",
  "Tablets",
  "Others",
];

const CATEGORY_ICONS = {
  All: "🗂️",
  Smartphones: "📱",
  Laptops: "💻",
  Audio: "🎧",
  Wearables: "⌚",
  Tablets: "📟",
  Others: "📦",
};

function Home({ onCountChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toasts, setToasts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (onCountChange) onCountChange(products.length);
  }, [products.length, onCountChange]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrigger = (id) => setConfirmDeleteId(id);

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteProduct(confirmDeleteId);
      showToast("🗑 Product deleted successfully.", "success");
      setConfirmDeleteId(null);
      fetchProducts();
    } catch {
      showToast("Failed to delete product.", "error");
      setConfirmDeleteId(null);
    }
  };

  // Count per category (for tab badges)
  const countByCategory = ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === "All"
      ? products.length
      : products.filter((p) => (p.category || "Others") === cat).length;
    return acc;
  }, {});

  // Filter by search + active category
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || (p.category || "Others") === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page-container">
      {/* Toast Notifications */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? (
              <svg className="toast-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="toast-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
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
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            <div className="modal-icon">🗑️</div>
            <h4 className="modal-title" id="modal-title">Delete Product?</h4>
            <p className="modal-desc">
              This action cannot be undone. The product will be permanently removed.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="dashboard-hero">
        <h1>📦 Product Management System</h1>
        <p>Manage all your products easily.</p>
      </div>

      {/* Toolbar: search + counter + add button */}
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="total-badge">
          Total Products: <span>{products.length}</span>
        </div>
        <Link to="/add-product" className="btn-primary" id="add-product-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Category Filter Tabs */}
      {!loading && !error && (
        <div className="category-tabs" role="tablist" aria-label="Filter by category">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              className={`category-tab${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              <span className="cat-icon">{CATEGORY_ICONS[cat]}</span>
              <span className="cat-label">{cat}</span>
              {countByCategory[cat] > 0 && (
                <span className="cat-count">{countByCategory[cat]}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="products-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card shimmer">
              <div className="skeleton-line" style={{ background: "#E2E8F0", height: "18px", width: "40%", marginBottom: "8px", borderRadius: "4px" }} />
              <div className="skeleton-line" style={{ background: "#E2E8F0", height: "14px", width: "70%", marginBottom: "6px", borderRadius: "4px" }} />
              <div className="skeleton-line" style={{ background: "#E2E8F0", height: "14px", width: "55%", marginBottom: "6px", borderRadius: "4px" }} />
              <div className="skeleton-line" style={{ background: "#E2E8F0", height: "22px", width: "30%", marginTop: "10px", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-state" role="alert">
          <div className="error-icon">⚠️</div>
          <h3 className="error-title">Unable to connect.</h3>
          <p className="error-desc">Please check your connection and try again later.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">No Products Found</h3>
          <p className="empty-desc">
            {searchQuery
              ? `No results for "${searchQuery}".`
              : activeCategory !== "All"
              ? `No products in ${activeCategory} yet.`
              : <>Click <Link to="/add-product">Add Product</Link> to create your first product.</>}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteTrigger}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;