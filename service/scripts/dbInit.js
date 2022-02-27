/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import mongoose from 'mongoose'
import { v4 } from 'uuid'
import { User } from '../models/User.js'

import users from './users.json'

const sleepAndQuit = new Promise((resolve) => {
  setTimeout(() => {
    mongoose.connection.close()
    resolve()
  }, 5000)
})

const initDB = async () => {
  const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@crit-cluster.bpw1p.mongodb.net/notoriety?retryWrites=true&w=majority`
  try {
    await mongoose.connect(connectionString)
  } catch (err) {
    console.log('error ', err)
  }

  for (const user of users) {
    await User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      decks: user.decks,
      email: user.email,
      password: v4()
    })
  }

  await sleepAndQuit

  console.log('finished saving users')
}

initDB()
