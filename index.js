const server = require('./api/server')

const PORT = process.env.PORT || 3333





server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})