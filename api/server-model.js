const db = require('../data/connection')


function getRoles() {
  return db('roles')
}

function getCuisines() {
  return db('cuisines')
}

module.exports = {
  getRoles,
  getCuisines
}