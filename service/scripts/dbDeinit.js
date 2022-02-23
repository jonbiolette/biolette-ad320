import mongoose from 'mongoose'
import { Deck } from '../models/Deck.js'

const sleepAndQuit = new Promise((resolve) => {
    setTimeout(() => {
        mongoose.connection.close()
        resolve()
    }, 5000)
})

const deinitDB = async () => {
    const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@deck.j6ajd.mongodb.net/Deck?retryWrites=true&w=majority`
    try {
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