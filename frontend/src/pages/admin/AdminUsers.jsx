import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import SortableTable from '../../components/SortableTable';
import FilterBar from '../../components/FilterBar';
import Alert from '../../components/Alert';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'rating', label: 'Rating (owners)', sortable: false },
  { key: 'actions', label: '', sortable: false },
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach((k) => !params[k] && delete params[k]);
      const { data } = await api.get('/admin/users', { params });
      setUsers(data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Normal users, store owners, and admins.</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">
          + Add user
        </Link>
      </div>

      <FilterBar
        fields={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'address', label: 'Address' },
          {
            key: 'role',
            label: 'Role',
            type: 'select',
            options: [
              { value: 'admin', label: 'Admin' },
              { value: 'user', label: 'Normal user' },
              { value: 'owner', label: 'Store owner' },
            ],
          },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
        onReset={() => setFilters({ name: '', email: '', address: '', role: '' })}
      />

      <Alert type="error">{error}</Alert>

      {loading ? (
        <p className="loading-text">Loading users…</p>
      ) : (
        <SortableTable
          columns={COLUMNS}
          data={users}
          sortBy={sortBy}
          order={order}
          onSortChange={(key, ord) => {
            setSortBy(key);
            setOrder(ord);
          }}
          renderCell={(row, key) => {
            if (key === 'role') return <span className="role-badge" data-role={row.role}>{row.role}</span>;
            if (key === 'rating') return row.rating ?? '—';
            if (key === 'actions')
              return (
                <Link to={`/admin/users/${row.id}`} className="link">
                  View
                </Link>
              );
            return row[key];
          }}
          emptyMessage="No users match these filters."
        />
      )}
    </div>
  );
}
