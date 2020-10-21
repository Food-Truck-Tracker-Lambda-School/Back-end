const router = require('express').Router()

const db = require('./operator-model')
const menuItemDb = require('../menuItem/menuItem-model')

const idCheck = require('../../api/id-check-middleware-factory')
const validateUser = require('../../api/validateUser-middleware')

router.use(require('../../api/restricted-middleware'))

router.use('/:id', idCheck('id', 'user', 'users', 'id'))
router.use('/:id/trucks/:tId', idCheck('tId', 'truck', 'trucks', 'id'))
router.use('/:id/trucks/:tId/menu/:mId', idCheck('mId', 'menuItem', 'menuItems', 'id'))

router.get('/:id', async (req, res, next) => {
  const { password, ...operator } = req.user
  res.status(200).json(operator)
})

router.get('/:id/trucks', async (req, res, next) => {
  const { id } = req.params
  try {
    const trucks = await db.getOperatorTrucks(id)
    res.status(200).json(trucks)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/trucks', validateUser, async (req, res, next) => {
  const { id } = req.params
  const { name, location, cuisineId, photoId = 1, departureTime, ...rest } = req.body
  if (!isEmpty(rest)) {
    res.status(400).json({ message: 'please only submit a truck with {name, location, cuisineId, photoId, [departureTime]}' })
  }
  else if (name && location && cuisineId !== undefined && photoId) {
    try {
      const trucks = await db.addTruck({ ...req.body, userId: id })
      res.status(201).json(trucks)
    } catch (err) {
      next(err)
    }
  }
  else {
    res.status(400).json({ message: 'missing required field {name, location, cuisineId, or photoId}' })
  }
})

router.get('/:id/trucks/:tId', (req, res, next) => {
  if (truck.userId === req.params.id) {
    res.status(200).json(req.truck)
  }
  else {
    res.status(404).json({ message: `no truck found for user ${req.params.id} with that id` })
  }
})

router.put('/:id/trucks/:tId', validateUser, async (req, res, next) => {
  const { tId } = req.params
  const truck = { ...req.truck, ...req.body }
  const { name, location, cuisineId, photoId, departureTime, id, userId, ...rest } = truck
  if (!isEmpty(rest)) {
    res.status(400).json({ message: 'please only submit a truck with {name, location, cuisineId, photoId, [departureTime]}' })
  }
  else {
    try {
      const adjustedTruck = await db.editTruck(tId, truck)
      res.status(200).json(adjustedTruck)
    } catch (err) {
      next(err)
    }
  }
})

router.delete('/:id/trucks/:tId', validateUser, async (req, res, next) => {
  const { tId } = req.params
  try {
    const count = await db.delTruck(tId)
    if (count > 0) {
      res.status(204).end()
    }
    else {
      next(`failed to delete tId: ${tId}`)
    }

  } catch (err) {
    next(err)
  }
})

router.get('/:id/trucks/:tId/menu', async (req, res, next) => {
  const { tId } = req.params
  try {
    const menu = await db.getTruckMenu(tId)
    res.status(200).json(menu)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/trucks/:tId/menu', validateUser, async (req, res, next) => {
  const { tId } = req.params
  const menuItem = req.body
  try {
    if (!menuItem.id) {
      const newMenuItem = await menuItemDb.addNewMenuItem({ name: menuItem.name })
      menuItem.id = newMenuItem.id
    }
    const menu = await db.addItemToMenu(tId, menuItem)
    res.status(201).json(menu)
  }
  catch (err) {
    next(err)
  }
})

router.delete('/:id/trucks/:tId/menu/:mId', validateUser, async (req, res, next) => {
  let { tId, mId } = req.params
  try {
    const count = await db.removeItemFromMenu(tId, mId)
    if (count > 0) {
      res.status(204).end()
    }
    else {
      next(`failed to delete mId ${mId} from tId ${tId}`)
    }
  } catch (err) {
    next(err)
  }
})
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false
  }
  return true
}


module.exports = router