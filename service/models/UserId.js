import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({

   userId: [DeckSchema].userId,
   deck:[DeckSchema]
})


export const Deck = mongoose.model('Deck', UserSchema)