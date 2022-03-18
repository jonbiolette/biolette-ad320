import { Router } from 'express'
import { body } from 'express-validator'
import { User } from '../models/User.js'
import { validator } from '../middlewares/validation.js'

const decksRouter = Router()

const getDecks = async (req, res) => {
  const { userId } = req.user
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
  const userId = ''
  const newDeck = req.body
  try {
    const user = await User.findById(userId)
    user.decks.push({
      name: newDeck.name,
      cards: []
    })
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${createDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}

const createCard = async (req, res) => {
  const userId = ''
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
  const userId = ''
  const deckId = req.params.id
  try {
    const user = await User.findById(userId)
    const removedDeck = user.decks.id(deckId).remove()
    console.log(removedDeck)
    user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${deleteDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}

const updateDeck = async (req, res) => {
  const userId = ''
  const deckId = req.params.id
  const newDeck = req.body
  try {
    const user = await User.findById(userId)
    const deck = user.decks.id(deckId)
    deck.name = newDeck.name
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${updateDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}

decksRouter.get('/', getDecks)
decksRouter.post('/', body('name').not().isEmpty(), validator, createDeck)
decksRouter.put(
  '/:id',
  body('name').not().isEmpty(),
  validator,
  updateDeck
)
decksRouter.delete('/:id', deleteDeck)

decksRouter.post(
  '/:id/cards',
  body('frontImage').isURL(),
  body('frontText').not().isEmpty(),
  body('backImage').isURL(),
  body('backText').not().isEmpty(),
  validator,
  createCard
)

export default decksRouter
