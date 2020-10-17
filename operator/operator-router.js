const router = require('express').Router()

const db = require('./operator-model')
const menuItemDb = require('../menuItem/menuItem-model')

router.use(require('../api/restricted-middleware'))

router.use('/:id', userVerification)
router.use('/:id/trucks/:tId', truckVerification)
router.use('/:id/trucks/:tId/menu/:mId', menuItemVerification)

router.get('/:id/trucks', async (req, res, next) => {
  const { id } = req.params
  try {
    const trucks = await db.getOperatorTrucks(id)
    res.status(200).json(trucks)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/trucks', async (req, res, next) => {
  const { id } = req.params
  const { name, location, cuisineId, photoId, departureTime, ...rest } = req.body
  if (!isEmpty(rest)) {
    res.status(400).json({ message: 'please only submit a truck with {name, location, cuisineId, photoId, [departureTime]}' })
  }
  else if (name && location && cuisineId && photoId) {
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
  res.status(200).json(req.truck)
})

router.put('/:id/trucks/:tId', async (req, res, next) => {
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

router.delete('/:id/trucks/:tId', async (req, res, next) => {
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

router.post('/:id/trucks/:tId/menu', async (req, res, next) => {
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

router.delete('/:id/trucks/:tId/menu/:mId', async (req, res, next) => {
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

async function userVerification(req, res, next) {
  const { id } = req.params
  let message = ' '
  if (id) {
    const operator = await db.getOperator(id)
    if (!operator) {

      res.status(404).json({ message: 'invalid [operatorId]' })
    }
    else {
      req.operator = operator
      next()
    }
  }
}
async function truckVerification(req, res, next) {
  const { tId } = req.params
  if (tId) {
    const truck = await db.getTruck(tId)
    if (!truck) {
      res.status(404).json({ message: 'invalid [truckId]' })
    }
    else {
      req.truck = truck
      next()
    }
  }
}
async function menuItemVerification(req, res, next) {
  const { mId } = req.params
  if (mId) {
    const menuItem = await db.getMenuItem(mId)
    if (!menuItem) {
      res.status(404).json({ message: 'invalid [menuItemId]' })
    }
    else {
      req.menuItem = menuItem
      next()
    }
  }
}
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false
  }
  return true
}


module.exports = router