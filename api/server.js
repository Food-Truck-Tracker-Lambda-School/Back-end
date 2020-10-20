const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const db = require('./server-model')

const error = require('./server-error-middleware')

const server = express()

server.use(express.json())
server.use(helmet())
server.use(cors())

server.use('/api/auth', require('../routes/auth/auth-router'))
server.use('/api/diner', require('../routes/diner/diner-router'))
server.use('/api/operator', require('../routes/operator/operator-router'))
server.use('/api/trucks', require('../routes/trucks/truck-router'))
server.use('/api/photos', require('../routes/photos/photo-router'))

server.get('/api/roles', async (req, res, next) => {
  try {
    const roles = await db.getRoles()
    res.status(200).json(roles)
  } catch (err) {
    next(err)
  }
})

server.get('/api/cuisines', async (req, res, next) => {
  try {
    const cuisines = await db.getCuisines()
    res.status(200).json(cuisines)
  } catch (err) {
    next(err)
  }
})

server.get('/', (req, res) => {
  res.send('<h1>Welcome!</h1>')
})

server.get('/api/menuItems', async (req, res, next) => {
  try {
    const menuItems = await db.getMenuItems()
    res.status(200).json(menuItems)

  } catch (err) {
    next(err)
  }
})

server.use(error)





module.exports = server