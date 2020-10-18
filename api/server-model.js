const db = require('../data/connection')


function getRoles() {
  return db('roles')
}

function getCuisines() {
  return db('cuisines')
}

async function getUser(id) {
  return await db('users')
    .where({ id })
    .select('id')
    .first()
}

async function getMenuItems() {
  return await db('menuItems')
}

module.exports = {
  getRoles,
  getCuisines,
  getUser,
  getMenuItems
}