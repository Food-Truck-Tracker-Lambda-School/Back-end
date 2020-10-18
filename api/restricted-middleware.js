const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    res.status(403).json({ message: 'missing Authorization header' })
  }
  else {
    const split = authorization.split(' ')[1]
    jwt.verify(split, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'invalid authorization token' })
      }
      else {
        req.decoded = decoded
        console.log(decoded)
        next()
      }

    })
  }
}