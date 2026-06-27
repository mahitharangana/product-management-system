import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, deleteProduct } from "../services/productService";

function getStockStatus(stock) {
  const n = Number(stock);
  if (n === 0) return { label: "Out of Stock", cls: "stock-out" };
  if (n <= 5)  return { label: `Low Stock · ${n} left`, cls: "stock-low" };
  return            { label: `In Stock · ${n} units`, cls: "stock-in" };
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(id);
      navigate("/");
    } catch {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="detail-page">
          <div className="shimmer" style={{ height: "300px", borderRadius: "16px", marginBottom: "2rem" }} />
          {[70, 40, 60, 90, 50].map((w, i) => (
            <div key={i} className="shimmer" style={{ height: "20px", width: `${w}%`, borderRadius: "6px", marginBottom: "12px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <div className="detail-page">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3 className="error-title">Product not found.</h3>
            <p className="error-desc">This product may have been deleted.</p>
            <Link to="/" className="btn-primary" style={{ display: "inline-flex", marginTop: "1rem" }}>Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const { name, price, description, category = "Others", stock = 0, imageUrl = "", createdAt } = product;
  const stockStatus = getStockStatus(stock);
  const formattedPrice = Number(price).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  const addedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : null;

  return (
    <div className="page-container">
      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h4 className="modal-title">Delete Product?</h4>
            <p className="modal-desc">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={deleting}>Cancel</button>
              <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="detail-page">
        {/* Back link */}
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Products
        </Link>

        <div className="detail-card">
          {/* Product Image */}
          <div className="detail-image-wrap">
            {imageUrl && !imageError ? (
              <img src={imageUrl} alt={name} className="detail-image" onError={() => setImageError(true)} />
            ) : (
              <div className="detail-image-placeholder">
                <svg width="56" height="56" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span>No Image</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="detail-content">
            {/* Badges row */}
            <div className="detail-badges">
              <span className="category-chip">{category}</span>
              <span className={`stock-badge ${stockStatus.cls}`}>{stockStatus.label}</span>
            </div>

            {/* Name */}
            <h1 className="detail-name">{name}</h1>

            {/* Price */}
            <p className="detail-price">₹{formattedPrice}</p>

            {/* Description */}
            <div className="detail-section">
              <h2 className="detail-section-title">Description</h2>
              <p className="detail-description">{description}</p>
            </div>

            {/* Info grid */}
            <div className="detail-info-grid">
              <div className="detail-info-item">
                <span className="detail-info-label">Category</span>
                <span className="detail-info-value">{category}</span>
              </div>
              <div className="detail-info-item">
                <span className="detail-info-label">Stock</span>
                <span className="detail-info-value">{Number(stock) === 0 ? "Out of Stock" : `${stock} units`}</span>
              </div>
              {addedDate && (
                <div className="detail-info-item">
                  <span className="detail-info-label">Added</span>
                  <span className="detail-info-value">{addedDate}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button className="btn-edit detail-action-btn" onClick={() => navigate(`/edit-product/${id}`)}>
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Product
              </button>
              <button className="btn-danger detail-action-btn" onClick={() => setShowDeleteModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
