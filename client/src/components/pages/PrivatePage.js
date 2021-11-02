import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const PrivatePage = ({ history }) => {
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [privateData, setPrivateData] = useState('')

  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }

      try {
        const { data } = await axios.get('/api/private', config)
        setPrivateData(data.data)
      } catch (error) {
        localStorage.removeItem('authToken')
        setError('You are not authorized please login')
      }
    }
    fetchPrivateDate()
  }, [])

  const getAllUsers = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }
    try {
      const { data } = await axios.get('/api/auth/get-all-users', config)
      setUsers(data.users)
    } catch (error) {
      setError(error.response.data.error)
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  return error ? (
    <span className='error-message'>{error}
      <Link to='/login'>Login</Link>
    </span>
  ) : (
    <>
      <div>{privateData}</div>
      <button
        onClick={() => {
          localStorage.clear()
          history.push('/login')
        }}
      >LogOut
      </button>
      <button
        onClick={getAllUsers}
      >Get All Users
      </button>
      {
        users.length > 0 && users.map(user => (
          <div key={user._id}>
            Username:<span>{user.username}</span><br />
            Email:<span>{user.email}</span>
            <br />
            <br />
          </div>
        ))
      }
    </>
  )
}

export default PrivatePage

