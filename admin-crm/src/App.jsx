import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { NewsPage } from './pages/NewsPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { MediaPage } from './pages/MediaPage'
import { UsersPage } from './pages/UsersPage'

function ProtectedRoute ({ children }) {
  const { token, initialized } = useAuth()

  if (!initialized) {
    return <div className="screen-center">Loading session...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AdminRoute ({ children }) {
  const { user, initialized } = useAuth()

  if (!initialized) {
    return <div className="screen-center">Loading session...</div>
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default function App () {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<DashboardPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route
          path="users"
          element={(
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          )}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
