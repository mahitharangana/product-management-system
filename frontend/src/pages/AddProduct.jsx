import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addProduct } from "../services/productService";
import ProductForm from "../components/ProductForm";

function AddProduct({ onProductAdded }) {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async ({ name, price, description }) => {
    setSubmitting(true);
    try {
      await addProduct({ name, price, description });
      if (onProductAdded) onProductAdded();
      showToast("✅ Product Added Successfully", "success");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      showToast("Failed to add product. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Toast */}
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
          <h1 className="form-card-title">Add Product</h1>
          <p className="form-card-subtitle">Fill in the details to add a new product.</p>

          <ProductForm
            onSubmit={handleSubmit}
            submitLabel="Add Product"
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
