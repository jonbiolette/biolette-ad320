import mongoose from 'mongoose'
import { Deck } from '../models/Deck.js'

const sleepAndQuit = new Promise((resolve) => {
    setTimeout(() => {
        mongoose.connection.close()
        resolve()
    }, 5000)
})

const deinitDB = async () => {
    const connectionString = 'mongodb+srv://jonbiolette:4AQUbQfB5cS4UPn@deck.j6ajd.mongodb.net/Deck?retryWrites=true&w=majority'
    try {
        await mongoose.connect(connectionString)
    } catch (err) {
        console.log('error ', err)
    }

    await Deck.deleteMany({})

    await sleepAndQuit

    console.log('finished deleting decks')
}

deinitDB()