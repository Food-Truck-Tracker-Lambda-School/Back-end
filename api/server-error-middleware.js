const { json } = require('express')
const db = require('../data/connection')

module.exports = async function (err, req, res, next) {
  if (err) {
    try {
      console.log(err)
      await db.insert({
        errorDate: Date.now(),
        error: JSON.stringify(err)
      })
    } catch (error) {
      console.log(error)
    }
    res.status(500).json({ message: 'a server error has occured' })
  }
}