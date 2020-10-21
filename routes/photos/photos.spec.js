const request = require('supertest')
const server = require('../../api/server')
const db = require('../../data/connection')

const path = require('path')
const { workers } = require('cluster')
const photo = path.join(__dirname, '/testImg.jpg')

describe('photo router', () => {
  it('should return a url when uploading an image', async () => {
    // const response = await request(server)
    //   .post('/api/photos')
    //   .send({
    //     file: photo,
    //     userId: 1
    //   })
    // expect(response.body.url).toBeTruthy()
    /** Test works, but I don't want to leave it and use up all the upload data**/
  });
});