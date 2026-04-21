import { useState } from 'react'
import './style.css'
import BookingForm from '../BookingForm'
import MyBookings from '../MyBookings'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('bookings') // 'bookings' or 'new'

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Booking System</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || 'User'}</span>
          <button className="logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'new' ? 'active' : ''}
          onClick={() => setActiveTab('new')}
        >
          New Booking
        </button>
        <button 
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          My Bookings
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
