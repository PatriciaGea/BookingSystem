import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Main component that handles authentication and navigation
function App() {
  const [currentView, setCurrentView] = useState('login') // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null)
  const [authMessage, setAuthMessage] = useState('')

  // Check if a user session exists when app loads.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const oauthToken = params.get('token')
    const oauthUser = params.get('user')
    const oauthError = params.get('oauthError')

    const cleanLocation = () => {
      const cleanUrl = new URL(window.location.href)
      cleanUrl.search = ''
      cleanUrl.hash = ''
      window.history.replaceState({}, document.title, `${cleanUrl.pathname}${cleanUrl.hash}`)
    }

    // OAuth return flow: save token and clean query params.
    if (oauthToken && oauthUser) {
      try {
        const parsedUser = JSON.parse(oauthUser)
        localStorage.setItem('token', oauthToken)
        localStorage.setItem('user', JSON.stringify(parsedUser))
        setUser(parsedUser)
        setCurrentView('dashboard')
        setAuthMessage('')
        cleanLocation()
        return
      } catch (error) {
        console.error('Error processing OAuth:', error)
        setAuthMessage('Could not complete Google sign-in')
        cleanLocation()
      }
    }

    if (oauthError) {
      setAuthMessage('Could not complete Google sign-in')
      cleanLocation()
    }

    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setCurrentView('dashboard')
      } catch (error) {
        console.error('Error loading user session:', error)
        handleLogout()
      }
    }
  }, [])

  // Called after successful login.
  function handleLoginSuccess(userData) {
    setUser(userData)
    setCurrentView('dashboard')
  }

  // Called after successful register.
  function handleRegisterSuccess() {
    setCurrentView('login')
  }

  // Clears local session and returns to login.
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentView('login')
  }

  // Render the current screen based on app state.
  return (
    <>
      {currentView === 'login' && (
        <Login 
          authMessage={authMessage}
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={() => {
            setAuthMessage('')
            setCurrentView('register')
          }}
        />
      )}
      
      {currentView === 'register' && (
        <Register 
          onRegisterSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => {
            setAuthMessage('')
            setCurrentView('login')
          }}
        />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
