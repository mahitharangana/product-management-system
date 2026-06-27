import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function getStockStatus(stock) {
  const n = Number(stock);
  if (n === 0) return { label: "Out of Stock", cls: "stock-out" };
  if (n <= 5)  return { label: `Low Stock · ${n} left`, cls: "stock-low" };
  return            { label: `In Stock · ${n} units`, cls: "stock-in" };
}

function ProductCard({ product, onDelete }) {
  const { _id, name, price, description, category = "Others", stock = 0, imageUrl = "" } = product;
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const stockStatus = getStockStatus(stock);
  const isOutOfStock = Number(stock) === 0;

  const formattedPrice = Number(price).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <article className={`product-card${isOutOfStock ? " product-out-of-stock" : ""}`}>

      {/* Product Image — falls back to placeholder if URL is broken/blocked */}
      {imageUrl && !imgError ? (
        <div className="card-image-wrap">
          <img
            src={imageUrl}
            alt={name}
            className="card-image"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className="card-image-placeholder">
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}

      {/* Meta row: category chip + stock badge */}
      <div className="product-card-meta">
        <span className="category-chip">{category}</span>
        <span className={`stock-badge ${stockStatus.cls}`}>{stockStatus.label}</span>
      </div>

      <div className="product-card-body">
        <Link to={`/product/${_id}`} className="product-name-link">
          <h3 className="product-name">{name}</h3>
        </Link>
        <p className="product-description">{description}</p>
        <p className="product-price">₹{formattedPrice}</p>
      </div>

      <div className="product-actions">
        <button className="btn-edit" title="Edit Product" onClick={() => navigate(`/edit-product/${_id}`)}>
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>
        <button className="btn-delete" title="Delete Product" onClick={() => onDelete(_id)}>
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
