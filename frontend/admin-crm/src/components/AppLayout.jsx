import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { BarChart3, FolderKanban, ImageUp, LogOut, Newspaper, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { to: '/', icon: BarChart3, label: 'Dashboard' },
  { to: '/news', icon: Newspaper, label: 'Manage News' },
  { to: '/categories', icon: FolderKanban, label: 'Categories' },
  { to: '/media', icon: ImageUp, label: 'Media Upload' },
  { to: '/users', icon: Users, label: 'Users', roles: ['admin'] }
]

export function AppLayout () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const filteredNavItems = navItems.filter((item) => !item.roles || item.roles.includes(user?.role))

  const onLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <p className="brand-eyebrow">Admin CRM</p>
          <h1>Manav Rachna Time</h1>
        </div>

        <nav className="sidebar-nav">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <p className="user-meta">{user?.email}</p>
          <p className="user-role">Role: {user?.role}</p>
          <button type="button" className="btn ghost danger" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <section className="main-area">
        <header className="main-header">
          <div>
            <p className="header-eyebrow">Control Panel</p>
            <h2>Editorial Workspace</h2>
          </div>
          <ThemeToggle />
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </section>
    </div>
  )
}
