const router = require('express').Router()

const db = require('./truck-model')

router.use(require('../api/restricted-middleware'))

router.get('/', async (req, res, next) => {
  const trucks = await db.getTrucks()
  res.status(200).json(trucks)
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


module.exports = router