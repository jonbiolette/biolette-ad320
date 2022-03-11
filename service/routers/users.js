import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

function santizeUsers(users) {
    const sanitizedUser = users.map((user) => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        decks: user.decks,
        active: user.active
    }))
    return sanitizedUser
}


const getUsers = async (req, res) => {
    const { userId } = req.user
    const requestor = await User.findById(userId)
    if (requestor.role[0] === "admin" || requestor.role[0] === 'superuser') {
        const users = await User.find({})
        res.send(santizeUsers(users))
    } else {
        res.status(403).send('Forbidden')
    }
}

//const getUsersById = async (req, res) => {
//    const user = await User.findById(req.params.id)
//    res.send(user)
//}

const getUsersById = async (req, res) => {
    const { userId } = req.user
    //res.send(userId) return requestor id
    //res.send(req.params) return users id
    const requestor = await User.findById(userId)
    if (requestor.role[0] === 'admin' || requestor.role[0] === 'superuser') {
        const user = await User.findById(req.params.id)
        res.send(user)
    } else {
        res.status(403).send('Forbidden')
    }
}

//const updateUser = async (req, res) => {
//    const result = await User.findByIdAndUpdate(req.params.id, req.body)
//    console.log('result ', result)
//    res.sendStatus(503)
//}

const updateUser = async (req, res) => {
    const { userId } = req.user
    const requestor = await User.findById(userId)
    if (requestor.role[0] === 'admin') {
        const result = await User.findByIdAndUpdate(req.params.id, req.body)
        console.log('result ', result)
        res.sendStatus(503)
    } else if (requestor.role[0] === 'superuser' || requestor.role[0] === 'user' && requestor.id === req.params[0]){
        const result = await User.findByIdAndUpdate(req.params.id, req.body)
        console.log('result ', result)
        res.sendStatus(503)
    } else {
        res.status(403).send('Forbidden')
    }
}

//const deleteUser = async (req, res) => {
//    const result = await User.findByIdAndUpdate(req.params.id, { active: false })
//    console.log('result ', result)
//    res.sendStatus(503)
//}

const deleteUser = async (req, res) => {
    const { userId } = req.user
    const requestor = await User.findById(userId)
    if (requestor.role[0] === 'admin' || (requestor.role[0] === 'superuser' && requestor.id === req.params[0])) {
        const result = await User.findByIdAndUpdate(req.params.id, { active: false })
        console.log('result ', result)
        res.sendStatus(503)
    } else {
        res.status(403).send('Forbidden')
    }
}

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter