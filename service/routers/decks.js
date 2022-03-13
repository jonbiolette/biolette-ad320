import { Router } from 'express'
import { body } from 'express-validator'
import { User } from '../models/User.js'

const decksRouter = Router()

const getDecks = async (req, res) => {
    const { userId, other } = req.user
    console.log(`Other data from the token ${other}`)
    try {
        const user = await User.findById(userId)
        if (user) {
            res.send(user.decks)
        } else {
            res.sendStatus(404)
        }
    } catch (err) {
        console.log(`${getDecks.name}: ${err}`)
        res.sendStatus(500)
    }
}

const createDeck = async (req, res) => {
    const { userId } = req.user
    const requestor = await User.findById(userId)
    const newDeck = req.body
    try {
        requestor.decks.push({
            name: newDeck.name,
            cards: []
        })
        await requestor.save()
        res.sendStatus(204)
    } catch (err) {
        console.log(`${createDeck.name}: ${err}`)
        res.sendStatus(500)
    }
}

const createCard = async (req, res) => {
    const userId = req.user.userId
    const deckId = req.params.id
    const newCard = req.body
    try {
        const user = await User.findById(userId)
        const deck = user.decks.id(deckId)
        deck.cards.push(newCard)
        await user.save()
        const newId = deck.cards[deck.cards.length - 1]
        res.status(200).send(newId._id)
    } catch (err) {
        console.log(`${createCard.name}: ${err}`)
        res.sendStatus(500)
    }
}

const deleteDeck = async (req, res) => {
    const requestor = await User.findById(req.user.userId)
    const decksUser = await User.find({ 'decks._id': req.params.id })
    const user = decksUser[0]

    if (requestor.id === user.id || requestor.role === "admin" ||
        requestor.role === "superuser") {
    try {
        const removedDeck = user.decks.id(req.params.id).remove()
        console.log(removedDeck)
        user.save()
        res.sendStatus(204)
    } catch (err) {
        console.log(`${deleteDeck.name}: ${err}`)
        res.sendStatus(500)
        }
    } else {
        res.send("Forbidden")
    }
}

const updateDeck = async (req, res) => {
    const requestor = await User.findById(req.user.userId)
    const decksUser = await User.find({ 'decks._id': req.params.id })
    const user = decksUser[0]
    const newDeck = req.body

    if (requestor.id === user.id || requestor.role === "admin" ||
        requestor.role === "superuser") {

        try {
            const deck = user.decks.id(req.params.id)
            deck.name = newDeck.name
            await user.save()
            res.sendStatus(204)
        } catch (err) {
            console.log(`${updateDeck.name}: ${err}`)
            res.sendStatus(500)
        }
    } else {
        res.send("Forbidden")
    }
}

decksRouter.get('/', getDecks)
decksRouter.post('/', body('name').not().isEmpty(), createDeck)
decksRouter.put(
    '/:id',
    body('name').not().isEmpty(),
    updateDeck
)
decksRouter.delete('/:id', deleteDeck)

decksRouter.post(
    '/:id/cards',
    body('frontImage').isURL(),
    body('frontText').not().isEmpty(),
    body('backImage').isURL(),
    body('backText').not().isEmpty(),
    createCard
)

export default decksRouter