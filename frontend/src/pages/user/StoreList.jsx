import { useEffect, useState, useCallback } from 'react';
import api from '../../api/axios';
import FilterBar from '../../components/FilterBar';
import Alert from '../../components/Alert';
import StarRating from '../../components/StarRating';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.address) params.address = filters.address;
      const { data } = await api.get('/stores', { params });
      setStores(data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  async function handleRate(storeId, rating) {
    setSavingId(storeId);
    setError('');
    setSuccess('');
    try {
      await api.post(`/stores/${storeId}/rating`, { rating });
      setSuccess('Thanks — your rating was saved.');
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, myRating: rating } : s))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Stores</h1>
      <p className="page-subtitle">Browse registered stores and share your rating.</p>

      <FilterBar
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'address', label: 'Address' },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onReset={() => setFilters({ name: '', address: '' })}
      />

      <Alert type="error">{error}</Alert>
      <Alert type="success">{success}</Alert>

      {loading ? (
        <p className="loading-text">Loading stores…</p>
      ) : (
        <div className="store-grid">
          {stores.length === 0 && <p className="empty-row">No stores match your search.</p>}
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <h3>{store.name}</h3>
              <p className="store-address">{store.address}</p>

              <div className="store-rating-row">
                <span className="detail-label">Overall rating</span>
                {store.overallRating != null ? (
                  <span className="rating-inline">
                    <StarRating value={store.overallRating} size="sm" /> {store.overallRating}
                  </span>
                ) : (
                  <span className="muted">No ratings yet</span>
                )}
              </div>

              <div className="store-rating-row">
                <span className="detail-label">
                  {store.myRating ? 'Your rating' : 'Rate this store'}
                </span>
                <StarRating
                  value={store.myRating || 0}
                  onChange={(n) => handleRate(store.id, n)}
                  size="lg"
                />
              </div>
              {savingId === store.id && <span className="muted">Saving…</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
