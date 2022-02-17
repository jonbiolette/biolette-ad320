import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'

const app = express()
const port = 8000
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@deck.j6ajd.mongodb.net/Deck?retryWrites=true&w=majority`
try {
    await mongoose.connect(connectionString)
} catch (err) {
    console.log('error ', err)
}

// Middleware

const exampleMiddleware = (req, res, next) => {
    console.log('example middleware')
    next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)

// Routes

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

//Get a deck by id -- DONE

const deckById = async (req, res) => {
    const deck = await Deck.findOne({
        _id : req.params.id
    })
    res.status(200).send(deck)
}

app.get('/deck/:id', deckById)


//Get a deck by user -- DONE
const userById = async (req, res) => {
    const user = await Deck.findOne({
        userId : req.params.id
    })
    res.status(200).send(user)
}

app.get('/userId/:id', userById)

//Create a deck

//Creat a card 

app.post('/cards', async (req, res) => {
    const cardRequest = req.body
    console.log(cardRequest)

    if ((!cardRequest.frontImage && !cardRequest.frontText) ||
        (!cardRequest.backImage && !cardRequest.backText)) {
        res.status(400).send('Card data incomplete')
    }

    if ((cardRequest.frontImage && !isUrl(cardRequest.frontImage)) || (cardRequest.backImage && !isUrl(cardRequest.backImage))) {
        res.status(400).send('Image fields must be valid URLs')
    }

    if (!cardRequest.deckId) {
        res.status(400).send('Deck ID is required')
    }


    try {
        const deck = await Deck.findById(cardRequest.deckId)
        if (deck) {
            deck.cards.push({
                frontImage: cardRequest.frontImage,
                frontText: cardRequest.frontText,
                backImage: cardRequest.backImage,
                backText: cardRequest.backText
            })
            await deck.save()
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    } catch (err) {
        console.log(`error in creating card ${err}`)
        res.sendStatus(502)
    }
})



//Create a user -- NEEDS WORK 



//Update a card -- NEEDS WORK 

app.post('/cards/:id/update', async (req, res) => {
    const updateRequest = req.body
    console.log(req.params.id)
    if ((!updateRequest.frontImage && !updateRequest.frontText) ||
        (!updateRequest.backImage && !updateRequest.backText)) {
        res.status(400).send('Card data incomplete')
    }

    if ((updateRequest.frontImage && !isUrl(updateRequest.frontImage)) || (updateRequest.backImage && !isUrl(updateRequest.backImage))) {
        res.status(400).send('Image fields must be valid URLs')
    }

    if (!updateRequest.deckId) {
        res.status(400).send('Deck ID is required')
    }

    try {
        const deck = await Deck.findById(updateRequest.deckId)
        if (deck) {
            const card = await Deck.findById({
                'cards._id': req.params.id
            })
            if (card) {
                cards.push({
                    frontImage: updateRequest.frontImage,
                    frontText: updateRequest.frontText,
                    backImage: updateRequest.backImage,
                    backText: updateRequest.backText,
                    deckId: updateRequest.deckId
                })
                await deck.save()
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        }
    } catch (err) {
        console.log(`error in creating card ${err}`)
        res.sendStatus(502)
    }
})


//Update a deck -- DONE?

app.post('/deck/:id/update', async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id)
        console.log(deck.name)
        if (deck) {
            await deck.updateOne({
                name: req.body.name
            }, {
                userId: req.body.userId
            });
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
    } catch (err) {
        console.log(`error in creating card ${err}`)
        res.sendStatus(502)
    }
})

//Update a user

app.post('/user/:id/update', async (req, res) => {
    console.log(req.body)

    try {
        const user = await Deck.findById(req.params.id)
        console.log(user.userId)
        if (user) {
            await user.updateOne({
                userId: req.body.userId
            }, {
                deck: req.body.deck
            });
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    } catch (err) {
        console.log(`error in creating card ${err}`)
        res.sendStatus(502)
    }
})

//Delete a card -- NEEDS WORK 






//Delete a deck and all associated cards -- DONE

const deleteDeck = async (req, res) => {
    const deleteDeck = await Deck.deleteOne({
        _id : req.params.id
    });
    res.status(200).send(deleteDeck)
}

app.delete('/deck/:id', deleteDeck)





//Delete a user -- -- NEEDS WORK 
//change user to null
const deleteUsersDeck = async (req, res) => {
    const deleteDeck = await Deck.deleteOne({
        _id: req.params.id
    });
    res.status(200).send(deleteDeck)
}

app.delete('/deck/:id', deleteUsersDeck)

app.get('/decks/:id/cards', async (req, res) => {
    const limit = req.query.limit
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.send(deck.cards.slice(0, 5))
    } else {
        res.sendStatus(404)
    }
})









const cardsById = async (req, res) => {
    const card = await Deck.findOne({
        'cards._id': req.params.id
    })
    res.status(200).send(card)
}

app.get('/cards/:id', cardsById)

const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
}









app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})