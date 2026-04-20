import { NavLink } from 'react-router-dom';
import { logout } from '../utils/auth';

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <nav className="app-navbar">
      <span className="app-brand">ecommerce website</span>

      {isAuthenticated && (
        <div className="app-nav-links">
          <NavLink to="/products" className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>Catalog</NavLink>
          <NavLink to="/cart" className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>Cart</NavLink>
          <NavLink to="/orders" className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>Orders</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>Profile</NavLink>
          <button onClick={logout} className="ghost-btn">Logout</button>
        </div>
      )}
    </nav>
  );
}

