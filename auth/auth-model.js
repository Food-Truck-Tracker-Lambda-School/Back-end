const db = require('../data/connection')
const jwt = require('jsonwebtoken')

async function getUserByUsername(username) {
  const user = db('users')
    .where({ username })
    .first()
  return { ...user, token: generateToken(user) }
}

async function registerUser(user) {
  const users = await db('users')
    .insert(user)
  return getUserByUsername(user.username)
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role
  }
  const secret = process.env.JWT_SECRET

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, secret, options)
}

module.exports = {
  getUserByUsername,
  registerUser
}