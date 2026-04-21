import { useState, useEffect } from 'react'
import './style.css'
import api from '../../services/api'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  function showMessage(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  // Carrega os agendamentos ao montar o componente
  useEffect(() => {
    loadMyBookings()
  }, [])

  // Busca os agendamentos do usuário logado
  async function loadMyBookings() {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Faz GET para /bookings/my (rota que retorna apenas do usuário logado)
      const response = await api.get('/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBookings(response.data)
      
      if (response.data.length === 0) {
        showMessage('Você ainda não tem agendamentos')
      }
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      showMessage('Erro ao carregar agendamentos')
    } finally {
      setIsLoading(false)
    }
  }

  // Cancela um agendamento
  async function handleCancelBooking(bookingId) {
    if (!window.confirm('Deseja realmente cancelar este agendamento?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      await api.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Remove o agendamento da lista
      setBookings(bookings.filter(b => b._id !== bookingId))
      showMessage('Agendamento cancelado com sucesso')
      
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error)
      showMessage('Erro ao cancelar agendamento')
    }
  }

  // Formata a data para exibição (YYYY-MM-DD para DD/MM/YYYY)
  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  // Traduz o tamanho do serviço para exibição
  function translateServiceSize(size) {
    const translations = {
      'pequeno': 'Pequeno',
      'medio': 'Médio',
      'grande': 'Grande'
    }
    return translations[size] || size
  }

  return (
    <div className="my-bookings-container">
      <h2>Meus Agendamentos</h2>

      {isLoading ? (
        <p className="loading">Carregando...</p>
      ) : bookings.length === 0 ? (
        <p className="no-bookings">Você ainda não tem agendamentos</p>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-info">
                <div className="info-row">
                  <span className="label">Data:</span>
                  <span className="value">{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Horário:</span>
                  <span className="value">{booking.bookingTime}</span>
                </div>
                <div className="info-row">
                  <span className="label">Serviço:</span>
                  <span className="value">{translateServiceSize(booking.serviceSize)}</span>
                </div>
              </div>
              <button 
                className="cancel-btn"
                onClick={() => handleCancelBooking(booking._id)}
              >
                Cancelar
              </button>
            </div>
          ))}
        </div>
      )}

      {message && <p className="message">{message}</p>}
      
      <button 
        className="refresh-btn"
        onClick={loadMyBookings}
        disabled={isLoading}
      >
        Atualizar Lista
      </button>
    </div>
  )
}

export default MyBookings
