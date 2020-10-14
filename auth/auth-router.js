const router = require('express').Router()
const bcrypt = require('bcrypt')

const db = require('./auth-model')

router.use('/', getUser)

router.post('/login', async (req, res, next) => {
  const { user } = req
  if (!user) {
    res.status(404).json({ message: 'invalid username' })
  }
  const { password } = req.body
  try {
    if (bcrypt.compareSync(password, req.password)) {
      res.status(200).json(user)
    }
    else {
      res.status(403).json({ message: 'invalid password' })
    }
  }
  catch (err) {
    next(err)
  }
})

router.post('/register', async (req, res, next) => {
  if (req.user) {
    res.status(400).json({ message: 'username already exists' })
  }
  const user = req.body
  try {
    const hashed = bcrypt.hashSync(user.password, 10)
    user.password = hashed
    const newUser = await db.registerUser(user)
    res.status(201).json(newUser)
  }
  catch (err) {
    next(err)
  }
})


async function getUser(req, res, next) {
  try {
    const { password, ...user } = await db.getUserByUsername(user.username)
    if (user) {
      req.password = password
      req.user = user
    }
    next()
  }
  catch (err) {
    next(err)
  }

}

module.exports = router