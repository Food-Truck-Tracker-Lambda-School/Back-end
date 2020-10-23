const db = require('../../data/connection')

async function getOperator(id) {
  return await db('users')
    .where({ id })
    .first()
}
async function getTruck(id) {
  const truck = await db('trucks')
    .where({ id })
    .first()


  const ratings = await db('trucks_ratings')
    .where({ truckId: id })

  truck.ratings = ratings.map(r => r.rating) || []

  return truck
}
async function getMenuItem(id) {
  const item = await db('menuItems')
    .where({ id: id })
    .first()
  item.price = parseFloat(item.price)

  return item
}

async function getOperatorTrucks(userId) {
  const trucks = await db('trucks')
    .where({ userId })

  for (let i = 0; i < trucks.length; i++) {
    const ratings = await db('trucks_ratings')
      .where({ truckId: trucks[i].id })
    trucks[i].ratings = ratings.map(r => r.rating)
  }

  return trucks
}

async function addTruck(truck) {
  const id = await db('trucks')
    .insert(truck)
    .returning('id')

  console.log(id)
  return getOperatorTrucks(truck.userId)
}

async function editTruck(id, truck) {
  const count = await db('trucks')
    .update(truck)
    .where({ id })

  return await getTruck(id)
}

async function delTruck(id) {
  return await db('trucks')
    .del()
    .where({ id })
}

async function getTruckMenu(id) {
  const menu = await db('trucks-menuItems as r')
    .join('menuItems as i', 'r.menuItemId', 'i.id')
    .where({ 'r.truckId': id })
    .select('i.id', 'i.name', 'r.price', 'r.description')

  for (let i = 0; i < menu.length; i++) {
    menu[i].price = parseFloat(menu[i].price)
  }
  return menu
}

async function addItemToMenu(truckId, menuItem) {
  const id = await db('trucks-menuItems')
    .insert({
      truckId,
      menuItemId: menuItem.id,
      price: menuItem.price,
      description: menuItem.description
    })
    .returning('menuItemId')

  return await getTruckMenu(truckId)
}

async function removeItemFromMenu(truckId, menuItemId) {
  return await db('trucks-menuItems')
    .del()
    .where({ truckId, menuItemId })
}

async function addPhoto(photo) {
  const exists = await db('photos')
    .where({ url: photo.url })
    .first()
  if (exists) {
    return exists.id
  }
  else {
    const newPhoto = await db('photos')
      .insert(photo)
      .returning('id')
    return newPhoto[0]
  }

}

module.exports = {
  getOperatorTrucks,
  addTruck,
  editTruck,
  delTruck,
  getTruckMenu,
  addItemToMenu,
  removeItemFromMenu,
  getOperator,
  getTruck,
  getMenuItem,
  addPhoto
}