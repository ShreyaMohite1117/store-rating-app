import { useEffect, useState } from 'react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import Alert from '../../components/Alert';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">A quick look at activity across the platform.</p>

      <Alert type="error">{error}</Alert>

      {stats && (
        <div className="stat-grid">
          <StatCard label="Total users" value={stats.totalUsers} accent="ink" />
          <StatCard label="Total stores" value={stats.totalStores} accent="amber" />
          <StatCard label="Ratings submitted" value={stats.totalRatings} accent="teal" />
        </div>
      )}
    </div>
  );
}
