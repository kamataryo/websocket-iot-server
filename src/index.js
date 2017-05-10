import express  from 'express'
import http     from 'http'
import mongoose from 'mongoose'
import socketIO from 'socket.io'
import { yellow, red, blue, green } from 'chalk'
import authenticate from './authenticate'
import config from './config'
import hooks from './hooks/index'

/**
 * log headers
 * @type {string}
 */
const UPSTREAM      = blue('UPSTREAM')
const DOWNSTREAM    = green('DOWNSTREAM')
const CONNECTION    = yellow('CONNECTION')
const AUTHORIZATION = red('AUTHORIZATION')
const PORT = process.env.PORT || config.server.port


/**
 * data store
 * @type {Object}
 */
const store = { data: {} }

// web server
const app = express()
const server = http.createServer(app)

/**
 * Start server
 */
server
  .listen(PORT, () => process.stdout.write(`WebSocket Server is listening on *:${PORT}\n`))

/**
 * in case access to websocket URL via browser
 */
app
  .use((req, res, next) => {
    process.stdout.write('error')
    next()
  })

// connect db
try {
  mongoose.connect(`mongodb://${config.mongo.dbhost}:${config.mongo.dbport}/${config.mongo.dbname}`)
} catch (e) {
  process.stderr.write('Error in DB connection.')
  process.stderr.write(e)
  process.exit(1)
}

/**
 * number who connects
 * @type {number}
 */
let connectCount = 0

// socket IO handling
socketIO
  .listen(server)
  .sockets.on('connection', socket => {

    // authenticate on connection
    socket.on('auth', data => {

      let username = data.username || 'unknown'

      process.stdout.write(`[${CONNECTION}][${Date()}] ${username} is connected.\n`)

      authenticate(data)
        .then(({ token, authuser }) => {

          // overwrite
          username = authuser || username

          socket.emit('permit', { permission: true, token })
          // sync the connecting client
          socket.emit('downstream', store.data)
          process.stdout.write(`[${AUTHORIZATION}][${Date()}] ${username} is authorized.\n`)
          // exec init hook
          if (connectCount++ + 1) { // check if you are the first
            hooks.init()
          }

          // reflect the connecting client's state to all
          socket.on('upstream', data => {
            process.stdout.write(`[${UPSTREAM}][${Date()}] ${username} upload ${JSON.stringify(data)}.\n`)
            store.data = Object.assign(store.data, data)
            socket.broadcast.emit('downstream', data)
            process.stdout.write(`[${DOWNSTREAM}][${Date()}] system is broadcasting ${JSON.stringify(data)}\n`)
            // exec change hook
            Object.keys(data).forEach(key => hooks.changeOn(key, data[key])())
          })

          socket.on('disconnect', () => {
            process.stdout.write(`[${CONNECTION}][${Date()}] ${username} is disconnected.\n`)
            // exec terminated hook
            if (connectCount-- - 1) { // check if you are the last
              hooks.terminate()
            }
          })
        })
        .catch(e => {
          socket.emit('permit', false)
          socket.disconnect()
          process.stdout.write(`[${AUTHORIZATION}][${Date()}] ${username} is not authorized.\n`)
          process.stdout.write(`[${CONNECTION}][${Date()}] ${username} is disconnected.\n`)
          if (e) {
            process.sterr.write(e)
          }
        })
    })
  })
