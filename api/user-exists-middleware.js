const db = require('./server-model')

module.exports = async function (req, res, next) {
  const { id } = req.params
  try {
    const user = await db.getUser(id)
    if (user) {
      next()
    }
    else {
      res.status(404).json({ message: 'user does not exist' })
    }
  } catch (err) {
    next(err)
  }
}