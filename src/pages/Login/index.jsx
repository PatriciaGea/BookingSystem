import { useEffect, useState } from 'react'
import './style.css'
import api from '../../services/api'

function Login({ authMessage, onLoginSuccess, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function showMessage(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  useEffect(() => {
    if (authMessage) {
      showMessage(authMessage)
    }
  }, [authMessage])

  async function handleLogin(e) {
    e.preventDefault()
    
    if (!email || !password) {
      showMessage('Please fill in email and password')
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      })

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      showMessage('Login successful!')
      
      setTimeout(() => {
        onLoginSuccess(response.data.user)
      }, 500)
      
    } catch (error) {
      console.error('Error during login:', error)
      const errorMsg = error.response?.data?.message || 'Login failed'
      showMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoogleLogin() {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    window.location.href = `${apiBase}/auth/google`
  }

  return (
    <div className="container login-layout">
      <form onSubmit={handleLogin} className="login-card">
        <h1>Sign In</h1>
        <p className="login-instruction">
          This is a booking system. You need to log in first.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <span className="google-icon" aria-hidden="true">G</span>
          Sign in with Google
        </button>

        <button 
          type="button" 
          className="secondary-btn"
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          No account yet? Create one
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <aside className="project-info">
        <h2>Project Credits</h2>
        <p>
          Booking System project by <strong>Patricia Gea</strong>.
        </p>
        <div className="contact-links">
          <a href="https://github.com/PatriciaGea" target="_blank" rel="noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/patriciageafrontend/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="mailto:patricia.rodrigues@hyperisland.se">Email</a>
        </div>
      </aside>
    </div>
  )
}

export default Login
