const express = require('express')
const helmet = require('helmet')
const cors = require('cors')

const server = express()

server.use(express.json())
server.use(helmet())
server.use(cors())

server.use('/api/auth', require('../auth/auth-router'))
server.use('/api/diner', require('../diner/diner-router'))
server.use('/api/operator', require('../operator/operator-router'))
server.use('/api/trucks', require('../trucks/truck-router'))

server.get('/', (req, res) => {
  res.send('<h1>Welcome!</h1>')
})

module.exports = server