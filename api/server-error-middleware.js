const { json } = require('express')
const db = require('../data/connection')

module.exports = function (err, req, res, next) {
  if (err) {
    try {
      db.insert({
        errorDate: Date.now(),
        error: JSON.stringify(err)
      })
    } catch (error) {

    }
    res.status(500).json({ message: 'a server error has occured' })
  }
}