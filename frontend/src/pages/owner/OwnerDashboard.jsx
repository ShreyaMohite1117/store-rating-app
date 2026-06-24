import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import StarRating from '../../components/StarRating';
import StatCard from '../../components/StatCard';
import SortableTable from '../../components/SortableTable';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'address', label: 'Address', sortable: false },
  { key: 'rating', label: 'Rating', sortable: false },
];

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/owner/dashboard')
      .then(({ data }) => setData(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your dashboard'));
  }, []);

  return (
    <div className="page">
      <h1 className="page-title">My store</h1>

      <Alert type="error">{error}</Alert>

      {data && (
        <>
          <p className="page-subtitle">{data.store.name} · {data.store.address}</p>

          <div className="stat-grid">
            <StatCard
              label="Average rating"
              value={data.averageRating != null ? data.averageRating : '—'}
              accent="amber"
            />
            <StatCard label="Ratings received" value={data.raters.length} accent="teal" />
          </div>

          <h2 className="section-title">Who rated your store</h2>
          <SortableTable
            columns={COLUMNS}
            data={data.raters}
            renderCell={(row, key) =>
              key === 'rating' ? <StarRating value={row.rating} size="sm" /> : row[key]
            }
            emptyMessage="No one has rated your store yet."
          />
        </>
      )}
    </div>
  );
}
