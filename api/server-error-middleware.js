module.exports = function (err, req, res, next) {
  if (err) {
    res.status(500).json({ message: 'a server error has occured' })
  }
}