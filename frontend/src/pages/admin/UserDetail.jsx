import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import StarRating from '../../components/StarRating';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then(({ data }) => setUser(data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user'));
  }, [id]);

  return (
    <div className="page">
      <Link to="/admin/users" className="back-link">
        ← Back to users
      </Link>
      <h1 className="page-title">User details</h1>

      <Alert type="error">{error}</Alert>

      {user && (
        <div className="card card--narrow detail-card">
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="detail-value">{user.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role</span>
            <span className="role-badge" data-role={user.role}>
              {user.role}
            </span>
          </div>
          {user.role === 'owner' && (
            <div className="detail-row">
              <span className="detail-label">Store rating</span>
              {user.rating != null ? (
                <span className="rating-inline">
                  <StarRating value={user.rating} size="sm" /> {user.rating}
                </span>
              ) : (
                <span className="detail-value">No ratings yet</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
