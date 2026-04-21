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
      showMessage('Por favor, preencha email e senha')
      return
    }

    setIsLoading(true)
    try {
      // Faz requisição POST para /auth/login
      const response = await api.post('/auth/login', {
        email,
        password
      })

      // Salva o token JWT no localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      showMessage('Login realizado com sucesso!')
      
      // Chama callback de sucesso após 500ms
      setTimeout(() => {
        onLoginSuccess(response.data.user)
      }, 500)
      
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      const errorMsg = error.response?.data?.message || 'Erro ao fazer login'
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
    <div className="container">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Entrar com Google
        </button>

        <button 
          type="button" 
          className="secondary-btn"
          onClick={onSwitchToRegister}
          disabled={isLoading}
        >
          Não tem conta? Cadastre-se
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}

export default Login
