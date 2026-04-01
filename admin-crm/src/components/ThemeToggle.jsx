import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getStoredTheme, setStoredTheme } from '../utils/storage'

export function ThemeToggle () {
  const [theme, setTheme] = useState(getStoredTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setStoredTheme(theme)
  }, [theme])

  return (
    <button
      type="button"
      className="btn ghost"
      onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
