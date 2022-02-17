import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({

   userId: mongoose.Types.ObjectId,
})


export const UserId = mongoose.model('UserId', UserSchema)