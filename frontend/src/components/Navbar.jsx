import { Link, useLocation } from "react-router-dom";

function Navbar({ productCount = 0 }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <span className="navbar-title">Product Management System</span>
        </Link>

        {/* Right side */}
        <div className="navbar-right">
          <Link
            to="/"
            className={`navbar-link${location.pathname === "/" ? " active" : ""}`}
          >
            Home
          </Link>

          <div className="navbar-counter">
            Products
            <span className="navbar-counter-num">{productCount}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
