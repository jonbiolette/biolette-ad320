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

/**
 * AS ALWAYS you will create a week9 branch to work on. You may work from the
 * current state of main in my repo. Incorrect submissions will lose points this
 * week.
 *
 * Each user should be assigned a role, and each role should be allowed to do
 * different things. There are many ways to handle roles and permissions, but
 * we'll keep it as simple as possible. Every call that should be restricted
 * should check the user and their role before allowing them to complete the
 * operation.
 *
 * Every call that needs to be restricted to certain users should require a
 * token to be authorized. Add a 'role' property to the user model limited to
 * one of three values: Admin, SuperUser, User.
 * 
 * - An admin should be able to call every route and without being rejected.
 * 
 * - A superuser should be able to get all users and users by id, add, update
 * and delete other users' decks and cards, but should not have permission to
 * update or delete OTHER user objects. They may update and delete their own
 * user profile.
 * 
 * - A user should only have access to create, update and delete their own cards
 * and decks. They should be able to update their own user data but NOT to
 * delete their own user account. They can choose to deactivate their own
 * account, but cannot reactivate it without admin assistance
 *
 * Based on these rules, you should restrict each route in the app that would be
 * affected by permissions
 */