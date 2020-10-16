db = require('../data/connection')


async function getTrucks() {
  return await db('trucks')

}

async function getTruckById(id) {
  return await db('trucks')
    .where({ id })
}

async function getTruckRatings(truckId) {
  return await db('truckRatings as r')
    .select('id', 'rating')
    .where({ truckId })
}

async function getTruckMenu(id) {
  let menu = await db('trucks-menuItems as r')
    .join('menuItems as i', 'r.menuItemId', 'i.id')
    .where({ 'r.truckId': id })
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