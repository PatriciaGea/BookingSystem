import { useState } from 'react'
import './style.css'
import Trash from '../../assets/trash.svg'
import api from '../../services/api'

function Home() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [message, setMessage] = useState('')

  async function getUsers() {
    try {
      const usersFromApi = await api.get('/users')
      setUsers(usersFromApi.data)
    } catch (error) {
      console.error('Error loading users:', error)
      showMessage('Error loading users')
    }
  }

  function showMessage(text) {
    setMessage(text)
    setTimeout(() => setMessage(''), 3000)
  }

  async function createUser() {
    if (!name || !email || !age) {
      showMessage('Please fill in all fields to add a user')
      return
    }

    try {
      await api.post('/users', {
        name,
        email,
        age: Number(age)
      })

      showMessage('User added successfully')
      setName('')
      setEmail('')
      setAge('')
      setUsers([])
    } catch (error) {
      showMessage('Error adding user')
    }
  }

  async function searchUsers() {
    if (!name && !email && !age) {
      showMessage('Please fill in at least one field to search')
      return
    }

    try {
      const params = {}
      if (name) params.name = name
      if (email) params.email = email
      if (age) params.age = age

      const response = await api.get('/users', { params })
      setUsers(response.data)
      
      if (response.data.length === 0) {
        showMessage('No users found with the search criteria')
      } else {
        showMessage(`Found ${response.data.length} user(s)`)
      }
    } catch (error) {
      showMessage('Error searching users')
    }
  }

  function clearSearch() {
    setName('')
    setEmail('')
    setAge('')
    setUsers([])
    showMessage('Search cleared')
  }

  async function showAllUsers() {
    try {
      const response = await api.get('/users')
      setUsers(response.data)
      showMessage(`Showing all users: ${response.data.length} total`)
    } catch (error) {
      showMessage('Error loading users')
    }
  }

  async function deleteUser(id) {
    try {
      await api.delete(`/users/${id}`)
      setUsers(users.filter(user => (user._id || user.id) !== id))
      showMessage('User deleted successfully')
    } catch (error) {
      showMessage('Error deleting user')
    }
  }

  function UserField({ label, value }) {
    return (
      <p>
        <span className="label">{label}</span> {value}
      </p>
    )
  }

  return (
    <div className='container'>
      <form onSubmit={(event) => event.preventDefault()} aria-label='User registration form'>
        <h1>User Registration</h1>
        <label htmlFor='name' className='visually-hidden'>Name</label>
        <input
          id='name'
          name='name'
          type='text'
          placeholder='Name'
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-required='true'
        />
        <label htmlFor='email' className='visually-hidden'>Email</label>
        <input
          id='email'
          name='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-required='true'
        />
        <label htmlFor='age' className='visually-hidden'>Age</label>
        <input
          id='age'
          name='age'
          type='number'
          placeholder='Age'
          value={age}
          onChange={(event) => setAge(event.target.value)}
          aria-required='true'
          min='1'
          max='120'
        />
        <div className='button-group'>
          <button type='button' onClick={createUser} aria-label='Add new user'>Add User</button>
          <button type='button' onClick={searchUsers} className='btn-search' aria-label='Search users'>Search</button>
          <button type='button' onClick={showAllUsers} className='btn-show-all' aria-label='Show all users'>Show All</button>
          <button type='button' onClick={clearSearch} className='btn-clear' aria-label='Clear search'>Clear</button>
        </div>
      </form>

      {message && <div className='message' role='status' aria-live='polite'>{message}</div>}

      {users.length > 0 && (
        <section className='users-section' aria-label='User list' role='region'>
          {users.map((user) => (
            <article key={user._id || user.id} className='user-card'>
              <div>
                <UserField label="Nome:" value={user.name} />
                <UserField label="Email:" value={user.email} />
                <UserField label="Age:" value={user.age} />
              </div>

              <button 
                className='btn-trash' 
                onClick={() => deleteUser(user._id || user.id)}
                aria-label={`Delete user ${user.name}`}
              >
                <img src={Trash} alt='Delete user icon' className='icon' />
              </button>
            </article>
          ))}
        </section>
      )}

      <section className='info-section'>
        <div className='info-container'>
          <h2>About This Project</h2>
          <p className='subtitle'>Full-stack user management system | React | Node.js | MongoDB | Express</p>
          
          <div className='info-grid'>
            <article className='info-card'>
              <h3>Features</h3>
              <ul>
                <li>Create, search, display, and delete user records</li>
                <li>Real-time notifications with visual feedback</li>
                <li>Form validation with error handling</li>
                <li>Fully responsive (desktop, tablet, mobile)</li>
                <li>RESTful API with CRUD operations</li>
              </ul>
            </article>

            <article className='info-card'>
              <h3>Technologies</h3>
              <div className='tech-list'>
                <span className='tech-badge'>React 19.2.0</span>
                <span className='tech-badge'>JavaScript ES6+</span>
                <span className='tech-badge'>Vite 7.3.1</span>
                <span className='tech-badge'>Node.js</span>
                <span className='tech-badge'>Express 4.22.1</span>
                <span className='tech-badge'>MongoDB</span>
                <span className='tech-badge'>Mongoose 8.22.1</span>
                <span className='tech-badge'>Axios</span>
                <span className='tech-badge'>CSS3 + HTML5</span>
              </div>
            </article>

            <article className='info-card'>
              <h3>API Documentation</h3>
              <div className='api-docs'>
                <p><strong>Base URL:</strong> http://localhost:3000</p>
                <div className='api-endpoint'>
                  <strong>GET</strong> <code>/users</code> - Get all users
                </div>
                <div className='api-endpoint'>
                  <strong>GET</strong> <code>/users?name=X&email=Y&age=Z</code> - Search users
                </div>
                <div className='api-endpoint'>
                  <strong>POST</strong> <code>/users</code> - Create new user
                </div>
                <div className='api-endpoint'>
                  <strong>DELETE</strong> <code>/users/:id</code> - Delete user
                </div>
              </div>
            </article>

            <article className='info-card'>
              <h3>Accessibility & SEO</h3>
              <ul>
                <li>WCAG 2.1 AA compliant</li>
                <li>Semantic HTML structure</li>
                <li>ARIA labels and live regions</li>
                <li>Full keyboard navigation</li>
                <li>Screen reader optimized</li>
                <li>Mobile-friendly responsive design</li>
              </ul>
            </article>
          </div>

          <div className='info-footer'>
            <p>
              Developed by <strong>Patricia Gea</strong> at <strong>Hyper Island, Stockholm</strong>
            </p>
            <div className='social-links'>
              <a href='https://github.com/PatriciaGea' target='_blank' rel='noopener noreferrer' className='social-link'>
                GitHub →
              </a>
              <a href='https://www.linkedin.com/in/patriciageafrontend/' target='_blank' rel='noopener noreferrer' className='social-link'>
                LinkedIn →
              </a>
              <a href='https://github.com/PatriciaGea/devClubCadastrouser' target='_blank' rel='noopener noreferrer' className='social-link'>
                Project Repo →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home