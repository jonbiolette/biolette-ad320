import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'
import { UserId } from './models/UserId.js'

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


//-------------------------------------------------------------
//                      CARD
//-------------------------------------------------------------

//Create a card

app.post('/cards', async (req, res) => {
    const cardRequest = req.body

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


//Card by Id
const cardsById = async (req, res) => {
    if (req.params.id === undefined) {
        res.sendStatus(400);
    } else {
        const id = req.params.id;
        try {
            const card = await Deck.findOne({
                'cards._id': req.params.id
            })
            if (card === null) {
                res.sendStatus(404);
            }
            else {
                res.send(card.cards.id(req.params.id))
                res.status(200)
            }
        } catch (error) {
            res.status(400);
            res.send(error);
        }
    }
}

app.get('/cards/:id', cardsById)


//Update a card 
app.post('/cards/:id/update', async (req, res) => {
    try {
        const deck = await Deck.findOne({ 'cards._id': req.params.id })
        const card = await deck.cards.id(req.params.id)
        if (card === null) {
            res.sendStatus(404);
        }
        else {
                card.frontText  = req.body.frontText,
                card.frontImage = req.body.frontImage,
                card.backText   = req.body.backText,
                card.backImage = req.body.backImage

            const updateCard = await deck.save();
            res.send(updateCard);
        }
    } catch (error) {
        res.status(400);
        res.send(error);
        console.log(error)
    }
});

//Delete a card
const deleteCard = async (req, res) => {
    try {
        const deck = await Deck.findOne({ 'cards._id': req.params.id })
        console.log(deck.id)
        const card = await deck.cards.id(req.params.id)
        if (card === null) {
            res.sendStatus(404);
        }
        else {
            Deck.updateOne({deck},{
                $pull: { cards: { _id: { $eq: card.id } } }
            })
            res.send(card);
        }
    } catch (error) {
        res.status(400);
        res.send(error);
        console.log(error)
    }
};
    app.delete('/card/:id', deleteCard)


//-------------------------------------------------------------
//                      DECK
//-------------------------------------------------------------

//Create a Deck
app.post('/deck', async (req, res) => {
    const deckRequest = req.body

    if ((!deckRequest.name) ||
        (!deckRequest.userId)) {
        res.status(400).send('Deck data incomplete')
    }
    if (!deckRequest.userId) {
        res.status(400).send('User ID is required')

    }
    try {
        Deck.create({
            "name":     deckRequest.name,
            "size":     0,
            "userId":   deckRequest.userId,
            "cards":    []
        })
        res.sendStatus(204)
    } catch (err) {
        console.log(`error in creating deck ${err}`)
        res.sendStatus(502)
    }
})

//Deck by Id
const deckById = async (req, res) => {
    const deck = await Deck.findOne({
        _id: req.params.id
    })
    res.status(200).send(deck)
}

app.get('/deck/:id', deckById)

//Deck by User
const userById = async (req, res) => {
    const user = await Deck.findOne({
        userId: req.params.id
    })
    res.status(200).send(user)
}

app.get('/userId/:id', userById)

//Update a deck

app.post('/deck/:id/update', async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.id)
        if (deck) {
            await deck.updateOne({
                name    : req.body.name,
                userId  : req.body.userId
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

//Delete a deck and all associated cards

const deleteDeck = async (req, res) => {
    const deleteDeck = await Deck.deleteOne({
        _id: req.params.id
    });
    res.status(200).send(deleteDeck)
}

app.delete('/deck/:id', deleteDeck)

//-------------------------------------------------------------
//                      USER
//-------------------------------------------------------------

//Create user
app.post('/user', async (req, res) => {
    const user = req.body;
    console.log(user);

    if (!user.firstName || !user.lastName) {
        res.status(400).send('Users full name is required')
    }

    if (!user.userName || !user.password || !user.emailAddress) {
        res.status(400).send('Username, password, and email address is required')
    }

    if (!user.id) {
        user.id = mongoose.Types.ObjectId()
    }

    try {
        UserId.create({
            "firstName"     : user.firstName,
            "lastName"      : user.lastName,
            "userName"      : user.userName,
            "password"      : user.password,
            "emailAddress"  : user.emailAddress,
            "decks"         : user.decks
        })
        res.sendStatus(204)
    } catch (err) {
        console.log(`error in creating user ${err}`)
        res.sendStatus(502)
    }
})

//Update a user

app.post('/user/:id/update', async (req, res) => {
    const update = req.body
    try {
        const user = await UserId.findById(req.params.id)
        if (user) {
            user.updateOne({
                firstName: update.firstName,
                lastName: update.lastName,
                userName: update.userName,
                password: update.password,
                emailAddress: req.body.emailAddress
            },{
                decks: req.body.decks
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

//Delete user

const deleteUser = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    const deleteUser = await UserId.findById(id);
    console.log(deleteUser)
        //userId: req.params.id
    try {
        await deleteUser.remove();
    } catch (error) {
        res.status(400);
        res.send(error);
    }

    res.status(200).send(deleteUser)
}

app.delete('/user/:id', deleteUser)

//-----------------------------------------------------------------------------



const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})