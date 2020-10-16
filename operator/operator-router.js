const router = require('express').Router()

router.use(require('../api/restricted-middleware'))

module.exports = router