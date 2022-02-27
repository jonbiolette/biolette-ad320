import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import './App.css'
import Topbar from './components/Topbar/Topbar'
import DeckProvider from './components/Deck/DeckProvider'
import axios from 'axios'

function App() {
  const [createMode, setCreateMode] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get('http://localhost:8000/users').then((response) => {
      console.log(`response from users ${response.data[0].firstName}`)
      setUser(response.data[0])
    })
  }, [])

  return (
    <React.Fragment>
      <Topbar createMode={createMode} createCardHandler={() => { setCreateMode(!createMode) }} />
      <Container width="lg">
        {user === null ? <span>Loading...</span> :
          <DeckProvider userId={user._id} decks={user.decks} createMode={createMode} /> }
      </Container>
    </React.Fragment>
  )
}

export default App;
