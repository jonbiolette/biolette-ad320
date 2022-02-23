import mongoose from 'mongoose'

const UserIdSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    userName: {
        type: String
    },
    password: {
        type: String
    },
    emailAddress: {
        type: String
    },
    decks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

export const UserId = mongoose.model('UserId', UserIdSchema)