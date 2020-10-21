const router = require('express').Router()

const db = require('./truck-model')
const idCheck = require('../../api/id-check-middleware-factory')
const geolib = require('geolib')

router.use(require('../../api/restricted-middleware'))
router.use('/:id', idCheck('id', 'truck', 'trucks', 'id'))
router.use('/:id/menu/:mId', idCheck('id', 'menuItem', 'menuItems', 'id'))



router.get('/', async (req, res, next) => {
  const trucks = await db.getTrucks()
  let { latitude, longitude, radius = 50 } = req.query
  latitude = parseFloat(latitude)
  longitude = parseFloat(longitude)
  radius = parseFloat(radius)
  if (latitude && longitude) {
    const closeTrucks = []
    trucks.forEach(truck => {
      const truckLoc = truck.location.split(' ')
      if (truckLoc[1]) {
        const distance = geolib.getDistance(
          { latitude, longitude },
          { latitude: truckLoc[0], longitude: truckLoc[1] }
        ) * .000621371192
        if (distance < radius) {
          closeTrucks.push({ ...truck, distance })
        }
      }

    });
    res.status(200).json(closeTrucks)
  } else {
    res.status(200).json(trucks)
  }
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const truck = await db.getTruckById(id)


    res.status(200).json(truck)


  } catch (err) {
    next(err)
  }
})

router.get('/:id/ratings', async (req, res, next) => {
  const { id } = req.params
  try {
    const ratings = await db.getTruckRatings(id)
    res.status(200).json(ratings)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/ratings', async (req, res, next) => {
  const { id } = req.params
  const { rating, userId, ...rest } = req.body

  try {
    if (rating && userId) {
      const index = await db.addTruckRating({ truckId: id, userId, rating })
      if (rating) {
        res.status(201).json({ rating, id: index[0], truckId: id })
      }
    }
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id/menu', async (req, res, next) => {
  const { id } = req.params
  try {
    const menu = await db.getTruckMenu(id)
    res.status(200).json(menu)
  }
  catch (err) {
    next(err)
  }
})

router.post('/:id/menu/:mId', async (req, res, next) => {
  const { id, mId } = req.params
  const { userId, rating, ...rest } = req.body
  try {
    const menuRating = {
      truckId: id,
      menuItemId: mId,
      rating,
      userId
    }
    const success = await db.addMenuItemRating(menuRating)
    res.status(201).json(menuRating)
  } catch (err) {
    next(err)

  }
})


module.exports = router