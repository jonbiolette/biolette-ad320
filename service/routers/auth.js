import { Router } from 'express'
import { body,validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

const authRouter = Router()

const register = async (req, res) => {
    const validationResults = validationResult(req)
    if (!validationResults.isEmpty()) {
        console.log(`Validation failed ${validationResult}`)
        res.status(400).send('Payload invalid')
    }

    try {
        const existingUser = await User.findOne({ email: req.body.email.toString().toLowercase })
        console.log(`Existing user ${existingUser}`)
        if (existingUser) {
            res.status(400).send('That email is already registered')
        } else {
            const newUser = req.body
            // We create an encrypted string that represents the password but
            // is not the same as the password. This may only be decoded
            // here with these tools
            newUser.password = await bcrypt.hash(req.body.password, 10)
            const savedUser = await User.create(newUser)
            res.status(200).send(savedUser._id)
        }
    } catch (err) {
        console.log(`User creation failed: ${err}`)
        res.status(502).send('User creation failed')
    }
}

async function login(req, res) {
    const validationResults = validationResult(req)
    if (!validationResults.isEmpty()) {
        console.log(`Validation failed ${validationResult}`)
        res.status(400).send('Payload invalid')
    }

    const creds = req.body

    try {
        const existingUser = await User.findOne({ email: creds.email })

        if (!existingUser) {
            res.status(404).send('No user found')
        } else {
            const passwordComparison = await bcrypt.compare(creds.password, existingUser.password)
            if (!passwordComparison) {
                res.status(401).send('Username or password are invalid')
            } else {
                const payload = {
                    user: existingUser._id,
                    otherData: 'for-example'
                }
                const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 86400 })
                res.status(200).send({
                    expiresIn: 86400,
                    token: `Bearer ${token}`
                })
            }
        }
    } catch (err) {
        console.log(`User login failed: ${err}`)
        res.status(502).send('There was an error in login')
    }
}

authRouter.post('/login', login)
authRouter.post('/register', body('email').isEmail(),body('password').notEmpty(),register)

export default authRouter

export const verifyToken = async (req, res, next) => {
    const authParts = req.headers.authorization.split(' ')
    if (authParts[0] !== 'Bearer' || authParts.length < 2) {
        res.status(400).send('Bad authentication token')
    } else if (authParts[1]) {
        try {
            const decoded = await jwt.verify(authParts[1], process.env.JWT_SECRET)
            req.user = {
                userId: decoded.user,
                other: decoded.otherData
            }
            next()
        } catch (error) {
            res.status(401).send('Authentication failed')
        }
    }
    else {
        res.status(400).send('Bad Token')
    }
}