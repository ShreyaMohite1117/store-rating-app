import { useState } from 'react';
import api from '../api/axios';
import Alert from '../components/Alert';

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await api.put('/auth/update-password', form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      const apiErrors = err.response?.data?.errors;
      if (apiErrors?.length) {
        setError(apiErrors.map((e) => e.message).join(' · '));
      } else {
        setError(err.response?.data?.message || 'Failed to update password.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Update password</h1>
      <div className="card card--narrow">
        <Alert type="error">{error}</Alert>
        <Alert type="success">{success}</Alert>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Current password
            <input
              type="password"
              required
              value={form.currentPassword}
              onChange={(e) => update('currentPassword', e.target.value)}
            />
          </label>
          <label>
            New password
            <input
              type="password"
              required
              minLength={8}
              maxLength={16}
              value={form.newPassword}
              onChange={(e) => update('newPassword', e.target.value)}
              placeholder="8-16 chars, 1 uppercase, 1 special character"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
