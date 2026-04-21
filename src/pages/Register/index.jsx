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
    
    // Validações
    if (!name || !email || !password || !confirmPassword) {
      showMessage('Por favor, preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      showMessage('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      showMessage('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)
    try {
      // Faz requisição POST para /auth/register
      await api.post('/auth/register', {
        name,
        email,
        password
      })

      showMessage('Cadastro realizado com sucesso! Redirecionando para login...')
      
      // Limpa os campos
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redireciona para login após 1.5s
      setTimeout(() => {
        onSwitchToLogin()
      }, 1500)
      
    } catch (error) {
      console.error('Erro ao registrar:', error)
      const errorMsg = error.response?.data?.message || 'Erro ao criar conta'
      showMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleRegister}>
        <h1>Criar Conta</h1>

        <input
          type="text"
          placeholder="Nome completo"
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
          placeholder="Senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <button 
          type="button" 
          className="secondary-btn"
          onClick={onSwitchToLogin}
          disabled={isLoading}
        >
          Já tem conta? Faça login
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}

export default Register
