const db = require('../../data/connection')
const jwt = require('jsonwebtoken')

async function getUserByUsername(username) {
  const user = await db('users')
    .where({ username })
    .first()
  if (user)
    return { ...user, token: generateToken(user) }
  else
    return null
}

async function registerUser(user) {
  try {
    const users = await db('users')
      .insert(user)
    return getUserByUsername(user.username)
  } catch (err) {
    return err
  }
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