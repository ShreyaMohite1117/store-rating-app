import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
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
      await signup(form);
      navigate('/stores');
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        setError(apiErrors.map((e) => e.message).join(' · '));
      } else {
        setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-mark">★</span>
          <h1>RateNest</h1>
        </div>
        <p className="auth-subtitle">Create your account to start rating stores.</p>

        <Alert type="error">{error}</Alert>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
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
              placeholder="you@example.com"
            />
          </label>
          <label>
            Address
            <textarea
              required
              maxLength={400}
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Up to 5 characters"
              rows={3}
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
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
