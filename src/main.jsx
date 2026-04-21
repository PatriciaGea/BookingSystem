import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Componente principal que gerencia autenticação e navegação
function App() {
  const [currentView, setCurrentView] = useState('login') // 'login', 'register', 'dashboard'
  const [user, setUser] = useState(null)
  const [authMessage, setAuthMessage] = useState('')

  // Verifica se há um usuário logado ao carregar a aplicação
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

    // Fluxo de retorno do OAuth: persiste token e limpa querystring.
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
        console.error('Erro ao processar OAuth:', error)
        setAuthMessage('Nao foi possivel concluir o login com Google')
        cleanLocation()
      }
    }

    if (oauthError) {
      setAuthMessage('Nao foi possivel concluir o login com Google')
      cleanLocation()
    }

    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
        setCurrentView('dashboard')
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        handleLogout()
      }
    }
  }, [])

  // Função chamada após login bem-sucedido
  function handleLoginSuccess(userData) {
    setUser(userData)
    setCurrentView('dashboard')
  }

  // Função chamada após registro bem-sucedido (redireciona para login)
  function handleRegisterSuccess() {
    setCurrentView('login')
  }

  // Função para fazer logout
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setCurrentView('login')
  }

  // Renderiza o componente apropriado baseado no estado
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
