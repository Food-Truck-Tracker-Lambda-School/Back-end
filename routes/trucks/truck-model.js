db = require('../../data/connection')


async function getTrucks() {
  let trucks = await db('trucks as t')
    .join('photos as p', 't.photoId', 'p.id')
    .select('t.id', 't.name', 't.location', 't.departureTime', 't.cuisineId', 't.photoId', 'p.url as photoUrl')
  for (let i = 0; i < trucks.length; i++) {

    const ratings = await db('trucks_ratings')
      .where({ truckId: trucks[i].id })
    trucks[i].ratings = ratings.map(rating => rating.rating)
  }

  return trucks
}

async function getTruckById(id) {
  console.log(Date.now())
  const truck = await db('trucks as t')
    .join('photos as p', 't.photoId', 'p.id')
    .where({ 't.id': id })
    .select('t.id', 't.name', 't.location', 't.departureTime', 't.cuisineId', 't.photoId', 'p.url as photoUrl')
    .first()
  const ratings = await db('trucks_ratings')
    .where({ truckId: truck.id })

  truck.ratings = ratings
  return truck
}

async function getTruckRatings(truckId) {
  let ratings = await db('trucks_ratings as r')
    .select('rating')
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
    menu[i].price = parseFloat(menu[i].price)
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

async function addTruckRating(rating) {
  try {
    console.log(rating)
    const exists = await db('trucks_ratings')
      .where({ userId: rating.userId, truckId: rating.truckId })
      .first()
    if (exists) {
      return await db('trucks_ratings')
        .update(rating)
        .where({ userId: rating.userId })

    }
    else {
      return await db('trucks_ratings')
        .insert(rating)
        .returning('rating')

    }
  } catch (error) {
    console.log(error)
  }


}

async function getMenuItemInTruck(menuItemId, truckId) {
  return await db('trucks-menuItems')
    .where({ truckId, menuItemId })
    .first()
}

async function addMenuItemRating(rating) {
  return await db('menuItemRatings')
    .insert(rating)
    .returning('rating')
}

module.exports = {
  getTrucks,
  getTruckById,
  getTruckRatings,
  getTruckMenu,
  addTruckRating,
  addMenuItemRating,
  getMenuItemInTruck
}