const db = require('../../data/connection')


async function getDinerFavorites(id) {
  const favorites = await db('favorites AS f')
    .join('trucks as t', 't.id', 'f.truckId')
    .join('photos as p', 't.photoId', 'p.id')
    .where({ 'f.userId': id })
  //.select('t.id', 't.name', 't.location', 't.departureTime', 't.cuisineId', 't.photoId', 'p.url as photoUrl')
  return favorites
}

async function getDinerRatings(id) {
  let truckRatings = await db('trucks_ratings as r')
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
  const pictures = await db('photos')
    .where({ userId: id })
    .select('id', 'url')
  return pictures
}

async function getTruck(id) {
  return await db('trucks')
    .where({ id })
    .first()
}

async function addNewFavorite(userId, truckId) {
  const exists = await db('favorites')
    .where({ userId, truckId })
    .first()
  if (exists) {
    return null
  }
  const id = await db('favorites')
    .insert({ truckId, userId })
  return getDinerFavorites(userId)
}

async function removeFavorite(userId, truckId) {
  return await db('favorites')
    .del()
    .where({ userId, truckId })
}

module.exports = {
  getTruck,
  getDinerFavorites,
  getDinerPictures,
  getDinerRatings,
  addNewFavorite,
  removeFavorite,
}