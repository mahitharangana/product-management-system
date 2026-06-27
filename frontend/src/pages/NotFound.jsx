import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="page-container">
      <div className="not-found">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary" id="go-home-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" fill="none" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
