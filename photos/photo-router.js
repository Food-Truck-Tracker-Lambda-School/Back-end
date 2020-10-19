const axios = require('axios')

const router = require('express').Router()
const url = `http://api/cloudinary.com/v1_1/${process.env.CDN_URL}/image/upload`

router.post('/', (req, res, next) => {
  const { file } = req.body
})


module.exports = router