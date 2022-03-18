import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import './App.css'
import DeckProvider from './components/Deck/DeckProvider'
import axios from 'axios'
import { useAuth } from './components/Auth/AuthProvider'

function App() {
  const [user, setUser] = useState(null)

  const { auth } = useAuth()

  useEffect(() => {
    if (auth) {
      console.log(`[App] useEffect ${auth.token}`) // Don't do this in the real world, obviously
      axios.get(`http://localhost:8000/users/${auth.user}`, { headers: { authorization: `Bearer ${auth.token}` }}).then((response) => {
        console.log(`response from users ${response.data.firstName} `, response.data)
        setUser(response.data)
      })
    }
  }, [auth])

  return (
    <React.Fragment>
      <Container width="lg">
        {user === null ? <span>Loading...</span> :
          <DeckProvider userId={user._id} decks={user.decks} /> }
      </Container>
    </React.Fragment>
  )
}

export default App;
