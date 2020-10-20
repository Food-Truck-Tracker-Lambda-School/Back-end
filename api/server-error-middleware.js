const { json } = require('express')
const db = require('../data/connection')

module.exports = async function (err, req, res, next) {
  if (err) {
    try {
      await db('errors').insert({
        errorDate: new Date(Date.now()).toISOString(),
        error: err.message
      })
    } catch (error) {
      console.log(error)
    }
    res.status(500).json({ message: 'a server error has occured' })
  }
}