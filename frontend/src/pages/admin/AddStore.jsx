import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Alert from '../../components/Alert';

export default function AddStore() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get('/admin/users', { params: { role: 'owner' } })
      .then(({ data }) => setOwners(data.users))
      .catch(() => setOwners([]));
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/admin/stores', { ...form, ownerId: form.ownerId || null });
      navigate('/admin/stores');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        setError(apiErrors.map((e) => e.message).join(' · '));
      } else {
        setError(err.response?.data?.message || 'Failed to create store.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Link to="/admin/stores" className="back-link">
        ← Back to stores
      </Link>
      <h1 className="page-title">Add store</h1>
      <p className="page-subtitle">Register a new store on the platform.</p>

      <div className="card card--narrow">
        <Alert type="error">{error}</Alert>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Store name
            <input
              type="text"
              required
              minLength={2}
              maxLength={10}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Between 2 and 10 characters"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </label>
          <label>
            Address
            <textarea
              required
              maxLength={400}
              rows={3}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
            />
          </label>
          <label>
            Store owner (optional)
            <select value={form.ownerId} onChange={(e) => update('ownerId', e.target.value)}>
              <option value="">No owner assigned yet</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} ({o.email})
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create store'}
          </button>
        </form>
      </div>
    </div>
  );
}
