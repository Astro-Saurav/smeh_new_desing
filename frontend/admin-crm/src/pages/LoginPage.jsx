import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export function LoginPage () {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@manavrachna.edu')
  const [password, setPassword] = useState('ChangeMeNow123!')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <p className="header-eyebrow">Secure Access</p>
        <h1>Manav Rachna Time CRM</h1>
        <p className="auth-subtitle">Sign in to manage college news, categories, media, and publishing schedules.</p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" className="btn primary full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
