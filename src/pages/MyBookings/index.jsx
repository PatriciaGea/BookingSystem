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

  // Load bookings once on mount.
  useEffect(() => {
    loadMyBookings()
  }, [])

  // Fetch bookings for authenticated user.
  async function loadMyBookings() {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      const response = await api.get('/bookings/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBookings(response.data)
      
      if (response.data.length === 0) {
        showMessage('You do not have any bookings yet')
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
      showMessage('Error loading bookings')
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel selected booking.
  async function handleCancelBooking(bookingId) {
    if (!window.confirm('Do you really want to cancel this booking?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      
      await api.delete(`/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setBookings(bookings.filter(b => b._id !== bookingId))
      showMessage('Booking cancelled successfully')
      
    } catch (error) {
      console.error('Error cancelling booking:', error)
      showMessage('Error cancelling booking')
    }
  }

  // Format date as DD/MM/YYYY.
  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-')
    return `${day}/${month}/${year}`
  }

  // Normalize service size for display.
  function translateServiceSize(size) {
    const translations = {
      pequeno: 'Small',
      medio: 'Medium',
      grande: 'Large',
      small: 'Small',
      medium: 'Medium',
      large: 'Large'
    }
    return translations[size] || size
  }

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>

      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="no-bookings">You do not have any bookings yet</p>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking._id} className="booking-card">
              <div className="booking-info">
                <div className="info-row">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(booking.bookingDate)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Time:</span>
                  <span className="value">{booking.bookingTime}</span>
                </div>
                <div className="info-row">
                  <span className="label">Service:</span>
                  <span className="value">{translateServiceSize(booking.serviceSize)}</span>
                </div>
              </div>
              <button 
                className="cancel-btn"
                onClick={() => handleCancelBooking(booking._id)}
              >
                Cancel
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
        Refresh List
      </button>
    </div>
  )
}

export default MyBookings
