import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/productService";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

const ALL_CATEGORIES = ["All", "Smartphones", "Laptops", "Audio", "Wearables", "Tablets", "Others"];

function Home({ onCountChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [toasts, setToasts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => { if (onCountChange) onCountChange(products.length); }, [products.length, onCountChange]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProducts(); }, []);

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteProduct(confirmDeleteId);
      showToast("Product deleted successfully.", "success");
      setConfirmDeleteId(null);
      fetchProducts();
    } catch {
      showToast("Failed to delete product.", "error");
      setConfirmDeleteId(null);
    }
  };

  // Category counts
  const countByCategory = ALL_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === "All" ? products.length
      : products.filter((p) => (p.category || "Others") === cat).length;
    return acc;
  }, {});

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "All" || (p.category || "Others") === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Export to CSV
  const exportCSV = () => {
    const headers = ["Name", "Category", "Price (INR)", "Stock", "Description", "Image URL"];
    const escape = (s) => `"${String(s || "").replace(/"/g, '""')}"`;
    const rows = products.map((p) => [
      escape(p.name), escape(p.category || "Others"),
      p.price || 0, p.stock || 0,
      escape(p.description), escape(p.imageUrl || ""),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    // Add BOM (\uFEFF) so Excel opens UTF-8 correctly
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${products.length} products to CSV.`, "success");
  };

  return (
    <div className="page-container">
      {/* Toasts */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" ? (
              <svg className="toast-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="20 6 9 17 4 12" /></svg>
            ) : (
              <svg className="toast-icon" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /></svg>
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h4 className="modal-title">Delete Product?</h4>
            <p className="modal-desc">This action cannot be undone. The product will be permanently removed.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="dashboard-hero">
        <h1>Product Management System</h1>
        <p>Manage all your products easily.</p>
      </div>

      {/* Toolbar */}
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="total-badge">
          Total: <span>{products.length}</span>
        </div>
        {!loading && !error && products.length > 0 && (
          <button className="btn-export" onClick={exportCSV} title="Export all products to CSV">
            <svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
        )}
        <Link to="/add-product" className="btn-primary" id="add-product-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Link>
      </div>

      {/* Category Tabs */}
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
              <div style={{ background: "#E2E8F0", height: "140px", borderRadius: "8px", marginBottom: "12px" }} />
              <div style={{ background: "#E2E8F0", height: "16px", width: "60%", borderRadius: "4px", marginBottom: "8px" }} />
              <div style={{ background: "#E2E8F0", height: "14px", width: "80%", borderRadius: "4px", marginBottom: "6px" }} />
              <div style={{ background: "#E2E8F0", height: "22px", width: "35%", borderRadius: "4px", marginTop: "10px" }} />
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
              : <><Link to="/add-product">Add your first product</Link> to get started.</>}
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} onDelete={setConfirmDeleteId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;