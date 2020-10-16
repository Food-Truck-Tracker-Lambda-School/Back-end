const db = require('../data/connection')


async function getDinerFavorites(id) {
  const favorites = await db('favorites AS f')
    .join('trucks as t', 't.id', 'f.truckId')
    .where({ 'f.userId': id })
    .select('t.*')
  return favorites
}

async function getDinerRatings(id) {
  let truckRatings = await db('truckRatings as r')
    .join('trucks as t', 't.id', 'r.truckId')
    .where({ 'r.userId': id })
    .select('t.id as id', 't.name', 'r.rating')

  truckRatings = truckRatings.map(truck => { return { ...truck, menuItemRatings: [] } })

  const menuItemRatings = await db('menuItemRatings as r')
    .join('trucks as t', 't.id', 'r.truckId')
    .join('menuItems as i', 'i.id', 'r.menuItemId')
    .where({ 'r.userId': id })
    .select('r.truckId', 't.name as truckName', 'i.id', 'i.name', 'r.rating')
  menuItemRatings.forEach(item => {
    let found = false
    for (let i = 0; i < truckRatings.length && !found; i++) {
      if (truckRatings[i].id === item.truckId) {
        truckRatings[i].menuItemRatings.push(item)
        found = true
      }
    }
    if (!found) {
      truckRatings.push({ id: item.truckId, name: item.truckName, menuItemRatings: [item] })
    }
  })

  return truckRatings
}

async function getDinerPictures(id) {

}

async function addNewFavorite(userId, truckId) {

}

async function removeFavorite(userId, favoriteId) {

}

module.exports = {
  getDinerFavorites,
  getDinerPictures,
  getDinerRatings,
  addNewFavorite,
  removeFavorite,
}