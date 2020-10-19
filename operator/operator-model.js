const db = require('../data/connection')

async function getOperator(id) {
  return await db('users')
    .where({ id })
    .first()
}
async function getTruck(id) {
  return await db('trucks')
    .where({ id })
    .first()
}
async function getMenuItem(id) {
  return await db('menuItems')
    .where({ id: id })
    .first()
}

async function getOperatorTrucks(userId) {
  return await db('trucks')
    .where({ userId })
}

async function addTruck(truck) {
  const id = await db('trucks')
    .insert(truck)
    .returning('id')

  console.log(id)
  return getTruck(id[0])
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
  return await db('trucks-menuItems as r')
    .join('menuItems as i', 'r.menuItemId', 'i.id')
    .where({ 'r.truckId': id })
    .select('i.id', 'i.name', 'r.price', 'r.description')
}

async function addItemToMenu(truckId, menuItem) {
  const id = await db('trucks-menuItems')
    .insert({
      truckId,
      menuItemId: menuItem.id,
      price: menuItem.price,
      description: menuItem.description
    })

  return await getTruckMenu(truckId)
}

async function removeItemFromMenu(truckId, menuItemId) {
  return await db('trucks-menuItems')
    .del()
    .where({ truckId, menuItemId })
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
  getMenuItem
}