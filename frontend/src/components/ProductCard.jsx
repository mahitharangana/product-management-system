import { useNavigate } from "react-router-dom";

const CATEGORY_ICONS = {
  Smartphones: "📱",
  Laptops: "💻",
  Audio: "🎧",
  Wearables: "⌚",
  Tablets: "📟",
  Others: "📦",
};

function getStockStatus(stock) {
  const n = Number(stock);
  if (n === 0) return { label: "Out of Stock", cls: "stock-out", icon: "⛔" };
  if (n <= 5) return { label: `Low Stock · ${n} left`, cls: "stock-low", icon: "⚠️" };
  return { label: `In Stock · ${n} units`, cls: "stock-in", icon: "✅" };
}

function ProductCard({ product, onDelete }) {
  const { _id, name, price, description, category = "Others", stock = 0 } = product;
  const navigate = useNavigate();
  const stockStatus = getStockStatus(stock);
  const isOutOfStock = Number(stock) === 0;

  const formattedPrice = Number(price).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  return (
    <article className={`product-card${isOutOfStock ? " product-out-of-stock" : ""}`}>
      {/* Top row: category chip + stock badge */}
      <div className="product-card-meta">
        <span className="category-chip">
          {CATEGORY_ICONS[category] || "📦"} {category}
        </span>
        <span className={`stock-badge ${stockStatus.cls}`}>
          {stockStatus.icon} {stockStatus.label}
        </span>
      </div>

      <div className="product-card-body">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">₹{formattedPrice}</p>
      </div>

      <div className="product-actions">
        <button
          className="btn-edit"
          title="Edit Product"
          onClick={() => navigate(`/edit-product/${_id}`)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Edit
        </button>

        <button
          className="btn-delete"
          title="Delete Product"
          onClick={() => onDelete(_id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
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
