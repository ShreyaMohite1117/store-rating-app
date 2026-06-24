import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AddUser from './pages/admin/AddUser';
import UserDetail from './pages/admin/UserDetail';
import AdminStores from './pages/admin/AdminStores';
import AddStore from './pages/admin/AddStore';

import StoreList from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/OwnerDashboard';

const HOME_BY_ROLE = { admin: '/admin', user: '/stores', owner: '/owner' };

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={HOME_BY_ROLE[user.role] || '/login'} replace />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/update-password"
            element={
              <PrivateRoute roles={['admin', 'user', 'owner']}>
                <UpdatePassword />
              </PrivateRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <PrivateRoute roles={['admin']}>
                <AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/:id"
            element={
              <PrivateRoute roles={['admin']}>
                <UserDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stores"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminStores />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/stores/new"
            element={
              <PrivateRoute roles={['admin']}>
                <AddStore />
              </PrivateRoute>
            }
          />

          {/* Normal user */}
          <Route
            path="/stores"
            element={
              <PrivateRoute roles={['user']}>
                <StoreList />
              </PrivateRoute>
            }
          />

          {/* Store owner */}
          <Route
            path="/owner"
            element={
              <PrivateRoute roles={['owner']}>
                <OwnerDashboard />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
