import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { body } from 'express-validator'

import {
  deckById,
  getDecks,
  createDeck,
  createCard,
  deleteDeck,
  updateDeck
} from './handlers/decks.js'

import {
  getUsers
} from './handlers/users.js'

const app = express()
const port = 8000

// Connect to MongoDB

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@crit-cluster.bpw1p.mongodb.net/notoriety?retryWrites=true&w=majority`
try {
  await mongoose.connect(connectionString)
} catch (err) {
  console.log('error ', err)
}

// Middleware

app.use(cors())
app.use(express.json())

// Routes

const notImplemented = (req, res) => {
  res.status(503).send(`Route not defined for ${req.url}`)
}

// Deck Routes
app.get('/decks', getDecks)
app.get('/decks/:id', deckById)
app.post('/decks', body('name').not().isEmpty(), createDeck)
app.put(
  '/decks/:id',
  body('name').not().isEmpty(),
  updateDeck
)
app.delete('/decks/:id', deleteDeck)

app.post(
  '/decks/:id/cards',
  body('frontImage').isURL(),
  body('frontText').not().isEmpty(),
  createCard
)

// User Routes
app.get('/users', getUsers)
app.get('/users/:id', notImplemented)
app.post('/users', notImplemented)
app.put('/users/:id', notImplemented)
app.delete('/users/:id', notImplemented)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
