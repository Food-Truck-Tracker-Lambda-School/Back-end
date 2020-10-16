const router = require('express').Router()
const db = require('./diner-model')
const validateUser = require('../api/validateUser-middleware')

router.use(require('../api/restricted-middleware'))

router.get('/:id', validateUser, async (req, res, next) => {
  const { id } = req.params
  try {
    const diner = {}
    diner.favorites = await db.getDinerFavorites(id)
    diner.ratings = await db.getDinerRatings(id)
    diner.photos = await db.getDinerPictures(id)

    res.status(200).json(diner)

  }
  catch (err) {
    next(err)
  }

})

router.get('/:id/favorites', async (req, res, next) => {
  const { id } = req.params
  try {
    const favorites = await db.getDinerFavorites(id)
    res.status(200).json(favorites)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id/ratings', async (req, res, next) => {
  const { id } = req.params
  try {
    const ratings = await db.getDinerRatings(id)
    res.status(200).json(ratings)
  }
  catch (err) {
    next(err)
  }
})

router.get('/:id/photos', async (req, res, next) => {
  const { id } = req.params
  try {
    const pictures = await db.getDinerPictures(id)
    res.status(200).json(pictures)
  }
  catch (err) {
    next(err)
  }
})

router.post('/:id/favorites', async (req, res, next) => {
  const { truckId } = req.body
  const { id } = req.params
  try {
    const favorites = await db.addNewFavorite(id, truckId)
    res.status(201).json(favorites)
  } catch (err) {
    next(err)
  }
})

router.delete('/:id/favorites/:fId', async (req, res, next) => {
  const { id, fId } = req.params
  try {
    const count = await db.removeFavorite(id, fId)
    if (count > 0) {
      res.status(204).end()
    }
    else {
      res.status(404).json({ message: 'invalid truck id' })
    }
  } catch (err) {
    next(err)
  }
})





module.exports = router