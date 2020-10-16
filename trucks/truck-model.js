db = require('../data/connection')


async function getTrucks() {
  return await db('trucks')

}

async function getTruckById(id) {
  console.log(Date.now())
  return await db('trucks as t')
    .join('photos as p', 't.photoId', 'p.id')
    .where({ 't.id': id })
    .select('t.id', 't.name', 't.location', 't.departureTime', 't.cuisineId', 't.photoId', 'p.url as photoUrl')
    .first()

}

async function getTruckRatings(truckId) {
  let ratings = await db('truckRatings as r')
    .select('id', 'rating')
    .where({ truckId })
  ratings = ratings.map(r => r.rating)
  return ratings
}

async function getTruckMenu(id) {
  let menu = await db('trucks-menuItems as r')
    .join('menuItems as i', 'r.menuItemId', 'i.id')
    .where({ 'r.truckId': id })
    .select('i.id', 'i.name', 'r.price', 'r.description')
  for (let i = 0; i < menu.length; i++) {
    menu[i].photos = await db('menuItems-photos as r')
      .join('photos as p', 'r.photoId', 'p.id')
      .select('p.id as id', 'p.url')
      .where({ 'r.menuItemId': menu[i].id })
    const ratings = await db('menuItemRatings')
      .where({ truckId: id, menuItemId: menu[i].id })
      .select('rating')
    menu[i].ratings = ratings.map(r => r.rating)
  }

  return menu
}

module.exports = {
  getTrucks,
  getTruckById,
  getTruckRatings,
  getTruckMenu
}