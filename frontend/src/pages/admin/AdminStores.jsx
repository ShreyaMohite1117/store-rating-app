import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import FilterBar from '../../components/FilterBar';
import Alert from '../../components/Alert';
import StarRating from '../../components/StarRating';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true },
];

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await api.get('/admin/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">All stores registered on the platform.</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-primary">
          + Add store
        </Link>
      </div>

      <FilterBar
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'address', label: 'Address' },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onReset={() => setFilters({ name: '', email: '', address: '' })}
      />

      <Alert type="error">{error}</Alert>

      {loading ? (
        <p className="loading-text">Loading stores…</p>
      ) : (
        <SortableTable
          columns={COLUMNS}
          data={stores}
          sortBy={sortBy}
          order={order}
          onSortChange={(key, ord) => {
            setSortBy(key);
            setOrder(ord);
          }}
          renderCell={(row, key) => {
            if (key === 'rating')
              return row.rating != null ? (
                <span className="rating-inline">
                  <StarRating value={row.rating} size="sm" /> {row.rating}
                </span>
              ) : (
                'No ratings yet'
              );
            return row[key];
          }}
          emptyMessage="No stores match these filters."
        />
      )}
    </div>
  );
}
