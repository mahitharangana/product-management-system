function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-wrapper">
      <input
        id="search-products"
        type="text"
        className="search-bar-input"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <svg
        className="search-bar-icon"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
  );
}

export default SearchBar;
