import { useState } from "react";

const CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Audio",
  "Wearables",
  "Tablets",
  "Others",
];

function ProductForm({
  initialData = {},
  onSubmit,
  submitLabel = "Save Product",
  submitting = false,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [price, setPrice] = useState(
    initialData.price !== undefined ? String(initialData.price) : ""
  );
  const [description, setDescription] = useState(initialData.description || "");
  const [category, setCategory] = useState(initialData.category || "Others");
  const [stock, setStock] = useState(
    initialData.stock !== undefined ? String(initialData.stock) : "0"
  );
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Product name cannot be empty."); return; }
    if (!price || isNaN(Number(price)) || Number(price) < 0) { setError("Please enter a valid non-negative price."); return; }
    if (!description.trim()) { setError("Product description cannot be empty."); return; }
    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) { setError("Stock must be 0 or more."); return; }

    onSubmit({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category,
      stock: Number(stock),
      imageUrl: imageUrl.trim(),
    });
  };

  const adjustStock = (delta) => {
    const next = Math.max(0, (Number(stock) || 0) + delta);
    setStock(String(next));
  };

  const stockNum = Number(stock);
  const stockHint =
    stockNum === 0
      ? { text: "Will show as Out of Stock", color: "var(--danger)" }
      : stockNum <= 5
      ? { text: `Low Stock — only ${stock} unit${stockNum > 1 ? "s" : ""} left`, color: "#D97706" }
      : { text: `In Stock — ${stock} units available`, color: "var(--success)" };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="form-error-msg" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* Product Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="form-name">Product Name</label>
        <input id="form-name" className="form-input" type="text"
          placeholder="e.g. Apple iPhone 17" value={name}
          onChange={(e) => setName(e.target.value)} autoComplete="off" />
      </div>

      {/* Category */}
      <div className="form-group">
        <label className="form-label" htmlFor="form-category">Category</label>
        <select id="form-category" className="form-input form-select"
          value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="form-group">
        <label className="form-label" htmlFor="form-price">Price (₹)</label>
        <input id="form-price" className="form-input" type="number"
          placeholder="e.g. 89000" value={price} min="0"
          onChange={(e) => setPrice(e.target.value)} />
      </div>

      {/* Stock */}
      <div className="form-group">
        <label className="form-label" htmlFor="form-stock">Stock (units)</label>
        <div className="stock-input-row">
          <button type="button" className="stock-adj-btn" onClick={() => adjustStock(-1)} aria-label="Decrease stock">−</button>
          <input id="form-stock" className="form-input stock-number-input"
            type="number" min="0" value={stock}
            onChange={(e) => setStock(e.target.value)} />
          <button type="button" className="stock-adj-btn" onClick={() => adjustStock(1)} aria-label="Increase stock">+</button>
        </div>
        <p className="form-hint" style={{ color: stockHint.color }}>{stockHint.text}</p>
      </div>

      {/* Image URL */}
      <div className="form-group">
        <label className="form-label" htmlFor="form-image">Product Image URL <span className="form-optional">(optional)</span></label>
        <input id="form-image" className="form-input" type="text"
          placeholder="https://images.unsplash.com/photo-..." value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)} autoComplete="off" />
        <p className="form-hint" style={{ color: "var(--text-muted)", marginTop: "4px" }}>
          ⚠️ Google Images &amp; shopping sites block external use. Use direct links from{" "}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer" style={{ color: "var(--accent-blue)" }}>Unsplash</a>,{" "}
          Wikipedia, or product CDN URLs (e.g. <code style={{ fontSize: "0.78rem" }}>images-na.ssl-images-amazon.com</code>).
        </p>
        {imageUrl && (
          <div className="form-image-preview">
            <img src={imageUrl} alt="Preview" onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label" htmlFor="form-desc">Description</label>
        <textarea id="form-desc" className="form-textarea"
          placeholder="Brand, model, specs, features..."
          value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none"
                style={{ animation: "spin 0.7s linear infinite" }} aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Saving...
            </>
          ) : submitLabel}
        </button>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}

export default ProductForm;
