const axios = require('axios')
const cloudinary = require('cloudinary')
const db = require('./photo-model')

const router = require('express').Router()
const url = `http://api/cloudinary.com/v1_1/${process.env.CDN_URL}/image/upload`

router.post('/', async (req, res, next) => {
  const { file, userId } = req.body
  await cloudinary.v2.uploader.upload(file, async (error, result) => {
    if (error) {
      next(error)
    }
    else {
      const { url } = result
      try {
        const photo = await db.addPhoto(url, userId)
        res.status(201).json(photo)
      }
      catch (err) {
        next(err)

      }

    }

  })
})


module.exports = router