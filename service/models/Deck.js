import mongoose from 'mongoose'

const CardSchema = new mongoose.Schema({
    frontImage: String,
    frontText: String,
    backImage: String,
    backText: String

})

const DeckSchema = new mongoose.Schema({
    name: String,
    cards: [CardSchema],
    size: Number,
    userId: mongoose.Types.ObjectId
})

export const Deck = mongoose.model('Deck', DeckSchema)