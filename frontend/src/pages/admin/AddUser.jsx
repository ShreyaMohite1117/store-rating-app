import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Alert from '../../components/Alert';

export default function AddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/admin/users', form);
      navigate('/admin/users');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        setError(apiErrors.map((e) => e.message).join(' · '));
      } else {
        setError(err.response?.data?.message || 'Failed to create user.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Link to="/admin/users" className="back-link">
        ← Back to users
      </Link>
      <h1 className="page-title">Add user</h1>
      <p className="page-subtitle">Create a normal user, store owner, or admin account.</p>

      <div className="card card--narrow">
        <Alert type="error">{error}</Alert>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Name
            <input
              type="text"
              required
              minLength={2}
              maxLength={6}
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Between 2 and 6 characters"
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
              maxLength={40}
              rows={3}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="8-16 chars, 1 uppercase, 1 special character"
            />
          </label>
          <label>
            Role
            <select value={form.role} onChange={(e) => update('role', e.target.value)}>
              <option value="user">Normal user</option>
              <option value="owner">Store owner</option>
              <option value="admin">System administrator</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create user'}
          </button>
        </form>
      </div>
    </div>
  );
}
