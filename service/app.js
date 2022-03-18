import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import decksRouter from './routers/decks.js'
import usersRouter from './routers/users.js'
import authRouter, { verifyToken } from './routers/auth.js'

const app = express()
const port = 8000

// Connect to MongoDB

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@deck.j6ajd.mongodb.net/Deck?retryWrites=true&w=majority`
try {
  await mongoose.connect(connectionString)
} catch (err) {
  console.log('error ', err)
}

// Middleware

app.use(cors())
app.use(express.json())

// Routes

app.use('/auth', authRouter)
app.use('/decks', verifyToken, decksRouter)
app.use('/users', verifyToken, usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
