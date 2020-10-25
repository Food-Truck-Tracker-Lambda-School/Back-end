const axios = require('axios')
const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})
const db = require('./photo-model')
const streamifier = require('streamifier')

const router = require('express').Router()
const url = `http://api/cloudinary.com/v1_1/${process.env.CDN_URL}/image/upload`

router.post('/:id', async (req, res, next) => {
  console.log(cloudinary.v2.cloudinary_js_config())
  cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })
  const userId = req.params.id
  const file = req.files.photo.data
  try {
    const cld_stream = cloudinary.v2.uploader.upload_stream({
      folder: "food-truck"
    }, async (error, result) => {
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
    streamifier.createReadStream(file).pipe(cld_stream)
  }
  catch (err) {
    next(err)
  }

})


module.exports = router