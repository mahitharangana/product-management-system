import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../services/productService";
import ProductForm from "../components/ProductForm";

function EditProduct({ onProductUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ✅ FIX: destructure ALL fields including category, stock, imageUrl
  const handleSubmit = async ({ name, price, description, category, stock, imageUrl }) => {
    setSubmitting(true);
    try {
      await updateProduct(id, { name, price, description, category, stock, imageUrl });
      if (onProductUpdated) onProductUpdated();
      showToast("Product updated successfully!", "success");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      showToast("Failed to update product. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {toast && (
        <div className="toast-container" aria-live="polite">
          <div className={`toast toast-${toast.type}`}>
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
        </div>
      )}

      <div className="form-page">
        <Link to="/" className="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>

        <div className="form-card">
          <h1 className="form-card-title">Edit Product</h1>
          <p className="form-card-subtitle">Update the details below and save your changes.</p>

          {loading ? (
            <div style={{ padding: "2rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[80, 100, 60, 100, 40, 100].map((w, i) => (
                <div key={i} className="shimmer" style={{ height: "18px", width: `${w}%`, borderRadius: "4px" }} />
              ))}
            </div>
          ) : loadError ? (
            <div className="error-state" role="alert">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">Product not found.</h3>
              <p className="error-desc">Unable to load product details. It may have been deleted.</p>
            </div>
          ) : (
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              submitLabel="Update Product"
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
