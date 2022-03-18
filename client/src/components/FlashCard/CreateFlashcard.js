import React, {useEffect, useState} from "react"
import { Button, Stack, TextField, Container, MenuItem } from "@mui/material"
import axios from 'axios'
import { useAuth } from "../Auth/AuthProvider"

const CreateFlashcard = ({ userId, deckId }) => {
  const { auth } = useAuth()
  const [formValue, setFormValue] = useState({})
  const [formErrors, setFormErrors] = useState({
    frontImage: false,
    backImage: false,
    frontText: false,
    backText: false
  })
  const [decks, setDecks] = useState(null)

  useEffect(() => {
    if (auth) {
      axios.get(`http://localhost:8000/users/${auth.user}`, { headers: { authorization: `Bearer ${auth.token}` }}).then((response) => {
        const userDecks = response.data.decks.map((deck) => {
          return {
            id: deck._id,
            name: deck.name
          }
        })
        setDecks(userDecks)
        setFormValue(f => f.deck = userDecks[0].id)
      })
    }
  }, [auth])

  const isURL = (value) => {
    const re = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
    return re.test(value)
  }

  const isNotEmpty = (value) => {
    const trimmed = value.trim()
    return trimmed !== ""
  }

  const validate = (field, value) => {
    const validations = {
      frontImage: isURL,
      backImage: isURL,
      frontText: isNotEmpty,
      backText: isNotEmpty,
      deck: (v) => { return true }
    }
    return validations[field](value)
  }

  const handleChange = (event) => {
    // TIL there are ways to use functions to accomplish state change
    setFormValue(f => ({
      ...f,
      [event.target.name]: event.target.value
    }))

    // which isn't much different than this, but is still kind of cool
    setFormErrors({ ...formErrors, [event.target.name]: !validate(event.target.name, event.target.value)})
  }
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formErrors.frontImage && !formErrors.frontText && !formErrors.backImage && !formErrors.backText) {
      try {
        const response = await axios.post(`http://localhost:8000/decks/${deckId}/cards`, formValue, { headers: { authorization: `Bearer ${auth.token}`} })
      } catch (err) {
        alert("Submission failed!")
      }
    }
  }

  if (!decks) {
    return <span>Loading...</span>
  }

  return (
    <Container maxWidth="md">
    <Stack component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
    <TextField
          id="deck"
          name="deck"
          select
          label="Deck"
          value={formValue.deck ?? ''}
          helperText="Please select your currency"
          onChange={handleChange}
          autoFocus
        >
          {decks.map((deck) => (
            <MenuItem key={deck.id} value={deck.id}>
              {deck.name}
            </MenuItem>
          ))}
        </TextField>
      <TextField
        margin="normal"
        required
        fullWidth
        id="frontImage"
        label="Front Image"
        name="frontImage"
        onChange={handleChange}
        error={formErrors.frontImage}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="frontText"
        label="Front Text"
        id="frontText"
        onChange={handleChange}
        error={formErrors.frontText}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="backImage"
        label="Back Image"
        name="backImage"
        onChange={handleChange}
        error={formErrors.backImage}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="backText"
        label="Back Text"
        id="backText"
        onChange={handleChange}
        error={formErrors.backText}
      />
      <Button type="submit" disabled={ Object.values(formErrors).every(value=>value===false) } fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Submit
      </Button>
    </Stack>
    </Container>
  )
}

export default CreateFlashcard
