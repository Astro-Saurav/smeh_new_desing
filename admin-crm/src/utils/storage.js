const TOKEN_KEY = 'mrt_admin_token'
const USER_KEY = 'mrt_admin_user'
const THEME_KEY = 'mrt_admin_theme'

export function getStoredToken () {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken (token) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY)
    return
  }

  localStorage.setItem(TOKEN_KEY, token)
}

export function getStoredUser () {
  const data = localStorage.getItem(USER_KEY)

  if (!data) {
    return null
  }

  try {
    return JSON.parse(data)
  } catch (error) {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function setStoredUser (user) {
  if (!user) {
    localStorage.removeItem(USER_KEY)
    return
  }

  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getStoredTheme () {
  return localStorage.getItem(THEME_KEY) || 'dark'
}

export function setStoredTheme (theme) {
  localStorage.setItem(THEME_KEY, theme)
}
