import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi'
import { attachAuthApi, setAccessToken } from '../api/client'
import {
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser
} from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider ({ children }) {
  const [token, setToken] = useState(getStoredToken())
  const [user, setUser] = useState(getStoredUser())
  const [initialized, setInitialized] = useState(false)

  function updateSession ({ token: nextToken, user: nextUser }) {
    setToken(nextToken || null)
    setUser(nextUser || null)
    setStoredToken(nextToken || null)
    setStoredUser(nextUser || null)
    setAccessToken(nextToken || null)
  }

  async function login (credentials) {
    const data = await authApi.login(credentials)
    updateSession(data)
    toast.success('Welcome to Manav Rachna Time CRM')
    return data
  }

  async function refresh () {
    const data = await authApi.refresh()
    updateSession(data)
    return data
  }

  async function logout () {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignore logout transport errors, local session still must be cleared.
    } finally {
      updateSession({ token: null, user: null })
    }
  }

  useEffect(() => {
    attachAuthApi({ refresh })
  }, [])

  useEffect(() => {
    setAccessToken(token)

    const init = async () => {
      if (!token) {
        setInitialized(true)
        return
      }

      try {
        const me = await authApi.me()
        setUser(me)
        setStoredUser(me)
      } catch (error) {
        updateSession({ token: null, user: null })
      } finally {
        setInitialized(true)
      }
    }

    init()
  }, [token])

  const value = useMemo(() => ({
    token,
    user,
    initialized,
    login,
    refresh,
    logout,
    updateSession
  }), [token, user, initialized])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth () {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
