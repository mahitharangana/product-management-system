import React from "react";

function ProductCard({ product, editingId, onEdit, onDelete }) {
  const { _id, name, price, description } = product;
  const isEditing = editingId === _id;

  return (
    <article className={`product-card ${isEditing ? "editing-active" : ""}`}>
      <div className="product-card-header">
        <h3 className="product-title">{name}</h3>
        <span className="price-tag">₹{price}</span>
      </div>

      <p className="product-desc">{description}</p>

      <div className="product-actions">
        <button
          className="btn-icon btn-icon-primary"
          title="Edit Product"
          onClick={() => onEdit(product)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="btn-icon btn-icon-danger"
          title="Delete Product"
          onClick={() => onDelete(_id)}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
