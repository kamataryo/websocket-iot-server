import mongoose from 'mongoose'
import User     from '../models/User'
import config   from '../config'

const DB_HOST = process.env.DB_HOST || config.mongo.default.dbhost
const DB_PORT = process.env.DB_PORT || config.mongo.default.dbport
const DB_NAME = process.env.DB_NAME || config.mongo.default.dbname

mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`)

config.users.forEach(({ username, password }) => {
  const user    = new User()
  user.email    = `${username}@example.com`
  user.username = username
  user.password = password
  user.isAdmin  = true
  user.save()
})


mongoose.disconnect()
