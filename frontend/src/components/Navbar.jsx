import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const homeByRole = { admin: '/admin', user: '/stores', owner: '/owner' };

  return (
    <header className="navbar">
      <Link to={user ? homeByRole[user.role] : '/login'} className="navbar-brand">
        <span className="navbar-brand-mark">★</span> RateNest
      </Link>

      {user && (
        <nav className="navbar-links">
          {user.role === 'admin' && (
            <>
              <Link to="/admin">Dashboard</Link>
              <Link to="/admin/users">Users</Link>
              <Link to="/admin/stores">Stores</Link>
            </>
          )}
          {user.role === 'user' && <Link to="/stores">Stores</Link>}
          {user.role === 'owner' && <Link to="/owner">My Store</Link>}
          <Link to="/update-password">Password</Link>

          <span className="navbar-user">
            <span className="role-badge" data-role={user.role}>
              {user.role}
            </span>
            {user.name.split(' ')[0]}
          </span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}
