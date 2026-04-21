import { useState } from 'react'
import './style.css'
import api from '../../services/api'

function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function showMessage(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleRegister(e) {
    e.preventDefault()
    
    if (!name || !email || !password || !confirmPassword) {
      showMessage('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match')
      return
    }

    if (password.length < 6) {
      showMessage('Password must have at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      await api.post('/auth/register', {
        name,
        email,
        password
      })

      showMessage('Account created successfully! Redirecting to login...')
      
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      setTimeout(() => {
        onSwitchToLogin()
      }, 1500)
      
    } catch (error) {
      console.error('Error while registering:', error)
      const errorMsg = error.response?.data?.message || 'Could not create account'
      showMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleRegister}>
        <h1>Create Account</h1>

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Password (minimum 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>

        <button 
          type="button" 
          className="secondary-btn"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Already have an account? Sign in
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}

export default Register
