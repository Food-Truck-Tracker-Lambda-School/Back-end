const db = require('../data/connection')

async function getMenuItem(id) {
  return await db('menuItems')
    .where({ id })
    .first()
}
async function addNewMenuItem(menuItem) {
  const index = await db('menuItems')
    .insert(menuItem)
  return await getMenuItem(index[0])
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false
  }
  return true
}

module.exports = {
  getMenuItem,
  addNewMenuItem
}