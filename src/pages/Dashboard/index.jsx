import { useState } from 'react'
import './style.css'
import BookingForm from '../BookingForm'
import MyBookings from '../MyBookings'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' ou 'new'

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Sistema de Agendamento</h1>
        <div className="user-info">
          <span>Bem-vindo, {user?.name || 'Usuário'}</span>
          <button className="logout-btn" onClick={onLogout}>
            Sair
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'new' ? 'active' : ''}
          onClick={() => setActiveTab('new')}
        >
          Novo Agendamento
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Meus Agendamentos
        </button>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'new' && <BookingForm />}
        {activeTab === 'bookings' && <MyBookings />}
      </div>
    </div>
  )
}

export default Dashboard
