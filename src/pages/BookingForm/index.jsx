import { useState, useEffect } from 'react'
import './style.css'
import api from '../../services/api'

function BookingForm() {
  const [serviceSize, setServiceSize] = useState('pequeno')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [occupiedTimes, setOccupiedTimes] = useState([])

  // Horários disponíveis (8h às 18h)
  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  function showMessage(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  // Busca horários ocupados quando a data é selecionada
  useEffect(() => {
    if (bookingDate) {
      loadOccupiedTimes(bookingDate)
    } else {
      setOccupiedTimes([])
    }
  }, [bookingDate])

  // Busca horários já agendados para a data selecionada
  async function loadOccupiedTimes(date) {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get(`/bookings?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      // Extrai apenas os horários ocupados
      const times = response.data.map(booking => booking.bookingTime)
      setOccupiedTimes(times)
      
    } catch (error) {
      console.error('Erro ao carregar horários:', error)
    }
  }

  async function handleCreateBooking(e) {
    e.preventDefault()
    
    if (!serviceSize || !bookingDate || !bookingTime) {
      showMessage('Por favor, preencha todos os campos')
      return
    }

    // Verifica se o horário está ocupado
    if (occupiedTimes.includes(bookingTime)) {
      showMessage('Este horário já está ocupado. Escolha outro.')
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Faz requisição POST para criar agendamento
      await api.post('/bookings', {
        serviceSize,
        bookingDate,
        bookingTime
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Envia JWT no header
        }
      })

      showMessage('Agendamento criado com sucesso! Email de confirmação enviado.')
      
      // Limpa o formulário
      setServiceSize('pequeno')
      setBookingDate('')
      setBookingTime('')
      setOccupiedTimes([])
      
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      const errorMsg = error.response?.data?.message || 'Erro ao criar agendamento'
      showMessage(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Obtém a data mínima (hoje)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="booking-container">
      <form onSubmit={handleCreateBooking}>
        <h2>Novo Agendamento</h2>

        <div className="form-group">
          <label>Tamanho do Serviço:</label>
          <select 
            value={serviceSize} 
            onChange={(e) => setServiceSize(e.target.value)}
            disabled={isLoading}
          >
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
          </select>
        </div>

        <div className="form-group">
          <label>Data:</label>
          <input
            type="date"
            value={bookingDate}
            min={today}
            onChange={(e) => setBookingDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label>Horário:</label>
          <select 
            value={bookingTime} 
            onChange={(e) => setBookingTime(e.target.value)}
            disabled={isLoading || !bookingDate}
          >
            <option value="">Selecione um horário</option>
            {availableTimes.map(time => (
              <option 
                key={time} 
                value={time}
                disabled={occupiedTimes.includes(time)}
              >
                {time} {occupiedTimes.includes(time) ? '(Ocupado)' : ''}
              </option>
            ))}
          </select>
        </div>

        {bookingDate && occupiedTimes.length > 0 && (
          <div className="info-box">
            <p>Horários ocupados neste dia: {occupiedTimes.join(', ')}</p>
          </div>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Agendando...' : 'Agendar'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  )
}

export default BookingForm
