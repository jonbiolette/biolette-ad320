import mongoose from 'mongoose'

const validateEmail = (email) => {
  // This string comes from an internet standard, RFC 2822
  // eslint-disable-next-line no-control-regex
  const re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
  return re.test(email)
}

const CardSchema = new mongoose.Schema({
  frontImage: String,
  frontText: String,
  backImage: String,
  backText: String,
})

const DeckSchema = new mongoose.Schema({
  name: String,
  cards: [CardSchema]
})

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please provide a valid email address'],
  },
  password: { type: String, required: true },
  decks: [DeckSchema],
  active: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'superuser', 'admin'], default: 'user' }
})

export const User = mongoose.model('User', UserSchema)
