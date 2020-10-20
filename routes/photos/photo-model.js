const db = require('../../data/connection')

async function addPhoto(url, userId) {
  const index = await db('photos')
    .insert({ userId, url })
    .returning('id')
  return await getPhotoById(index[0])
}

async function getPhotoById(id) {
  const photo = await db('photos')
    .where({ id })
    .first()
  return photo
}

module.exports = {
  addPhoto,
  getPhotoById
}