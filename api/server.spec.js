const request = require('supertest')
const server = require('./server')
const db = require('../data/connection')
let token
const truck = {
  id: 1,
  name: 'Gerard\s Paella',
  userId: 1,
  location: '37.780454 -122.310074',
  cuisineId: 5,
  photoId: 1
}
const user = {
  username: "merry"
}

const path = require('path')
const { stat } = require('fs')
const photo = path.join(__dirname, '../routes/photos/testImg.jpg')

describe('server', () => {
  describe('auth router', () => {
    describe('registration', () => {
      beforeAll(async (done) => {
        await db('users').truncate()
        done()
      })
      afterEach(async (done) => {
        await db('users').truncate()
        done()
      })
      it('should register a new user with a post to /api/auth/register', async (done) => {

        const response = await register('merry', 'pippen', 1)

        const users = await db('users')
        expect(users).toHaveLength(1)
        done()
      });
      it('should not register a new user if missing a roleId', async (done) => {
        const response = await register('merry', 'pippen')

        const users = await db('users')
        expect(users).toHaveLength(0)
        done()
      });
      it('should not register a user if a user with that username already exists', async (done) => {
        await db('users')
          .insert({
            username: 'merry',
            password: 'pippen',
            roleId: 1
          })

        const response = await register('merry', 'pippen', 1)
        const users = await db('users')
        expect(users).toHaveLength(1)
        done()
      })
      it('should respond with "invalid roleId" if given a roleId other than 1 or 2', async (done) => {
        const response = await register('merry', 'pippen', 3)
        expect(response.body.message).toMatch('invalid roleId')
        done()
      });

    });
    describe('login', () => {
      beforeAll(async (done) => {
        await db('users')
          .insert({
            username: 'merry',
            password: require('bcrypt').hashSync('pippen', 10),
            roleId: 1
          })
        done()
      })
      it('should log in a user that exists in the system, and return a token', async (done) => {
        const response = await login('merry', 'pippen')
        expect(response.body.token).toBeTruthy()
        done()
      });
      it('should say invalid username if user does not exist', async (done) => {
        const response = await login('gandalf', 'pippen')
        expect(response.body.message).toMatch('invalid username')
        done()
      });
      it('should say invalid password if given an incorrect password', async (done) => {
        const response = await login('merry', 'gandalf')
        expect(response.body.message).toMatch('invalid password')
        done()
      });
      it('should say missing password if not given a password', async (done) => {
        const response = await login('merry')
        expect(response.body.message).toMatch('missing password')
        done()
      });
    });
  });

  describe('diner router', () => {
    beforeAll(async (done) => {
      await db('users').truncate()
      const diner = await request(server)
        .post('/api/auth/register')
        .send({
          username: 'merry',
          password: 'pippen',
          roleId: 1
        })
      token = { Authorization: `bearer ${diner.body.token}` }
      done()
    });
    it('should reject any call made without an authorization token', async (done) => {
      const diner = await request(server)
        .get('/api/diner/1')
      expect(diner.body.message).toBe('missing Authorization header')
      done()
    });
    describe('/:id', () => {
      it('should respond with a 404 if given an invalid userId', async (done) => {
        const diner = await request(server)
          .get('/api/diner/2')
          .set(token)

        expect(diner.status).toBe(404)
        done()
      });
      describe('GET', () => {
        it('should contain favorites, ratings, and photos when provided a valid userID', async (done) => {
          const { body } = await request(server)
            .get('/api/diner/1')
            .set(token)
          expect(body.favorites).toBeTruthy()
          expect(body.ratings).toBeTruthy()
          expect(body.photos).toBeTruthy()
          done()
        });
      });
      describe('/:id/favorites', () => {
        beforeAll(async done => {
          await db('trucks')
            .truncate()
          await db('favorites')
            .truncate()
          await db('trucks')
            .insert(truck)
          await db('favorites')
            .insert({
              truckId: 1,
              userId: 1
            })
          done()
        })
        describe('GET', () => {
          it('should respond with a list of favorites when provided a valid id', async (done) => {
            const { body } = await request(server)
              .get('/api/diner/1/favorites')
              .set(token)
            expect(body).toHaveLength(1)
            done()
          });
        });
        describe('POST', () => {
          it('should respond with a 404 when given an invalid truckId', async (done) => {
            const { status } = await request(server)
              .post('/api/diner/1/favorites')
              .send({
                truckId: 2
              })
              .set(token)
            expect(status).toBe(404)
            done()
          });
          it('should respond with a 400 when the truck already exists in the user\'s favorites', async (done) => {

            const { status } = await request(server)
              .post('/api/diner/1/favorites')
              .send({
                truckId: 1
              })
              .set(token)
            expect(status).toBe(400)
            done()
          });
          it('should respond with a list of all the user\'s favorites when given a valid truck', async (done) => {
            await db('trucks')
              .insert({
                id: 2,
                name: 'Gerard\s Paella',
                userId: 1,
                location: '37.780454 -122.310074',
                cuisineId: 5,
                photoId: 1
              })
            const { body } = await request(server)
              .post('/api/diner/1/favorites')
              .send({
                truckId: 2
              })
              .set(token)

            expect(body).toHaveLength(2)
            done()
          });
        });
        describe('/:fid', () => {
          it('should respond with a 404 if truck is not in user\'s favorites', async (done) => {
            const { status } = await request(server)
              .del('/api/diner/1/favorites/4')
              .set(token)
            expect(status).toBe(404)
            done()
          });
          it('should respond with a 204 when successfully removing favorite', async (done) => {
            const { status } = await request(server)
              .del('/api/diner/1/favorites/1')
              .set(token)
            expect(status).toBe(204)
            done()
          });
        });
      });
      describe('/:id/photos', () => {
        beforeAll(async done => {
          await db('photos').truncate()
          for (let i = 0; i < 5; i++) {
            await db('photos')
              .insert({
                userId: 1,
                url: i
              })
          }
          done()
        })
        it('should return an array of photos', async (done) => {
          const { body } = await request(server)
            .get('/api/diner/1/photos')
            .set(token)
          expect(body).toHaveLength(5)
          done()
        });
      });
      describe('/:id/ratings', () => {
        beforeAll(async done => {
          await db('trucks')
            .truncate()
          await db('trucks_ratings')
            .truncate()
          await db('trucks')
            .insert(truck)
          await db('trucks_ratings')
            .insert({
              truckId: 1,
              userId: 1,
              rating: 5
            })
          done()
        })
        it('should return an array of ratings', async (done) => {

          const { body } = await request(server)
            .get('/api/diner/1/ratings')
            .set(token)
          expect(body).toHaveLength(1)
          done()
        });
      });
    });
  });

  describe('operator router', () => {
    it('should reject any call without an authorization header', async (done) => {
      const { status } = await request(server)
        .get('/api/operator/1')

      expect(status).toBe(403)
      done()
    });
    describe('/:id', () => {
      beforeAll(async done => {
        await db('users').truncate()
        const diner = await request(server)
          .post('/api/auth/register')
          .send({
            username: 'merry',
            password: 'pippen',
            roleId: 1
          })
        token = { Authorization: `bearer ${diner.body.token}` }
        done()
      })
      describe('/:id/trucks', () => {
        it('should respond with a 404 if given an invalid userId', async (done) => {
          const { status } = await request(server)
            .get('/api/operator/2/trucks')
            .set(token)

          expect(status).toBe(404)
          done()
        });
        describe('GET', () => {
          beforeAll(async done => {
            await db('trucks')
              .truncate()
            await db('trucks')
              .insert(truck)
            done()
          })
          it('should provide a list of trucks when given a valid userID', async (done) => {
            const { body } = await request(server)
              .get('/api/operator/1/trucks')
              .set(token)
            expect(body).toHaveLength(1)
            done()
          });
        });
        describe('POST', () => {
          beforeAll(async done => {
            await db('trucks')
              .truncate()
            done()
          })
          it('should respond with a 400 if given anything unexpected', async (done) => {
            const { status } = await request(server)
              .post('/api/operator/1/trucks')
              .set(token)
              .send({
                ...truck,
                other: 'hello'
              })
            expect(status).toBe(400)
            done()
          });
          it('should respond with a 400 if missing any required fields', async (done) => {
            const { status } = await request(server)
              .post('/api/operator/1/trucks')
              .set(token)
              .send({
                name: "truck of errors"
              })
            expect(status).toBe(400)
            done()
          });
          it('should respond with a 201 and a list of all operator\'s trucks when given valid information', async (done) => {
            const { body } = await request(server)
              .post('/api/operator/1/trucks')
              .set(token)
              .send({
                name: 'Gerard\s Paella',
                location: '37.780454 -122.310074',
                cuisineId: 5,
                photoId: 1
              })

            expect(body).toHaveLength(1)
            done()
          });
        });
        describe('/:tId', () => {
          describe('GET', () => {
            it('should respond with a 404 if given an invalid truckId', async (done) => {
              const { status } = await request(server)
                .get('/api/operator/1/trucks/2')
                .set(token)

              expect(status).toBe(404)
              done()
            });
            it('should respond with a trucks info when given a valid user and truck id', async (done) => {
              const { body } = await request(server)
                .get('/api/operator/1/trucks/1')
                .set(token)
              expect(body).toBeTruthy()
              done()
            });
            it('should respond with a 404 if truckId does not belong to user', async (done) => {
              await db('users')
                .insert({
                  username: 'gandalf',
                  password: 'the white',
                  roleId: 2
                })
              await db('trucks')
                .insert({ ...truck, id: 2, userId: 2 })

              const { status } = await request(server)
                .get('/api/operator/1/trucks/2')
                .set(token)

              expect(status).toBe(404)
              done()
            });
          });
          describe('PUT', () => {
            it('should respond with a 400 if given any information it didn\'t ask for', async (done) => {
              const { status } = await request(server)
                .put('/api/operator/1/trucks/1')
                .set(token)
                .send({
                  randomThing: 'I\'m random!'
                })
              expect(status).toBe(400)
              done()
            });
            it('should respond with the edited truck when given valid information', async (done) => {
              const departureTime = new Date(Date.now()).toISOString()
              const { body } = await request(server)
                .put('/api/operator/1/trucks/1')
                .set(token)
                .send({
                  name: 'Truck of Editorial',
                  location: 'limbo',
                  cuisineId: 1,
                  photoId: 1,
                  departureTime
                })
              expect(body.name).toMatch('Truck of Editorial')
              expect(body.location).toMatch('limbo')
              expect(body.cuisineId).toBe(1)
              expect(body.photoId).toBe(1)
              expect(body.departureTime).toMatch(departureTime)
              done()
            });
            it('should still edit truck when given only the adjusted information', async (done) => {
              const departureTime = new Date(Date.now()).toISOString()
              const { body } = await request(server)
                .put('/api/operator/1/trucks/1')
                .set(token)
                .send({
                  departureTime
                })
              expect(body.departureTime).toMatch(departureTime)
              done()
            });
          });
          describe('DELETE', () => {
            beforeAll(async done => {
              await db('trucks').truncate()
              await db('trucks')
                .insert(truck)
              done()
            });
            it('should respond with a 204 if truck exists', async (done) => {
              const { status } = await request(server)
                .delete('/api/operator/1/trucks/1')
                .set(token)

              expect(status).toBe(204)
              done()
            });
          });
          describe('/menu', () => {
            describe('GET', () => {
              beforeAll(async (done) => {
                await db('trucks')
                  .truncate()
                await db('trucks')
                  .insert(truck)
                await db('menuItems')
                  .truncate()
                await db('menuItems')
                  .insert({
                    id: 1,
                    name: "pizza"
                  })
                await db('trucks-menuItems')
                  .truncate()
                await db('trucks-menuItems')
                  .insert({
                    truckId: 1,
                    menuItemId: 1,
                    price: 19.99,
                    description: "tasty pizza"
                  })

                done()
              });
              it('should respond with a truck\'s menu when given a valid user and truck id', async (done) => {
                const { body } = await request(server)
                  .get('/api/operator/1/trucks/1/menu')
                  .set(token)

                expect(body).toHaveLength(1)
                done()
              });
            });
            describe('POST', () => {
              beforeAll(async (done) => {
                await db('trucks')
                  .truncate()
                await db('trucks')
                  .insert(truck)
                await db('menuItems')
                  .truncate()
                await db('menuItems')
                  .insert({
                    id: 1,
                    name: "pizza"
                  })
                await db('trucks-menuItems').truncate()
                done()
              });
              it('should give the updated menu when given a valid menuItem', async done => {
                const { body } = await request(server)
                  .post('/api/operator/1/trucks/1/menu')
                  .set(token)
                  .send({
                    truckId: 1,
                    id: 1,
                    price: 19.99,
                    description: 'delicious pizza'
                  })
                done()
              });
              it('should add a new menu item if the item does not already exist', async done => {
                const { body } = await request(server)
                  .post('/api/operator/1/trucks/1/menu')
                  .set(token)
                  .send({
                    name: 'a new menu item',
                    price: 100,
                    description: 'very expensive'
                  })

                expect(body[body.length - 1].name).toMatch('a new menu item')
                done()
              });
              it('should respond with a 400 if menuItem already exists in the menu', async (done) => {
                await db('trucks-menuItems')
                  .truncate()
                await request(server)
                  .post('/api/operator/1/trucks/1/menu')
                  .set(token)
                  .send({
                    truckId: 1,
                    name: 'pizza',
                    price: 19.99,
                    description: 'delicious pizza'
                  })

                const { status } = await request(server)
                  .post('/api/operator/1/trucks/1/menu')
                  .set(token)
                  .send({
                    truckId: 1,
                    name: 'pizza',
                    price: 19.99,
                    description: 'delicious pizza'
                  })

                expect(status).toBe(400)
                done()
              });
            });


            describe('/:mId', () => {
              beforeAll(async done => {
                await db('trucks-menuItems')
                  .truncate()
                await db('trucks')
                  .truncate()
                await db('menuItems')
                  .truncate()

                await db('trucks')
                  .insert(truck)
                await db('menuItems')
                  .insert({
                    name: "pizza",
                    id: 1
                  })
                await db('trucks-menuItems')
                  .insert({
                    truckId: 1,
                    menuItemId: 1,
                    price: 100,
                    description: 'delicious pizza'
                  })

                done()
              });
              it('should respond with a 404 if given an menuItem that isn\'t in the menu', async (done) => {

                const { status } = await request(server)
                  .delete('/api/operator/1/trucks/1/menu/10')
                  .set(token)
                expect(status)
                  .toBe(404)
                done()
              });
              it('should respond with a 204 if given a valid menuItemId to delete', async done => {
                const { status } = await request(server)
                  .delete('/api/operator/1/trucks/1/menu/1')
                  .set(token)

                expect(status).toBe(204)
                done()
              })

            });
          });

        });
      });
    });

  });

  describe('photo router', () => {
    it('should return a url when uploading an image', async (done) => {
      // const response = await request(server)
      //   .post('/api/photos')
      //   .send({
      //     file: photo,
      //     userId: 1
      //   })
      // expect(response.body.url).toBeTruthy()
      /** Test works, but I don't want to leave it and use up all the upload data**/
      done()
    });
  });

  describe('truck router', () => {
    beforeAll(async done => {
      await db('users').truncate()
      const { body } = await register('merry', 'pippen', 1)
      token = { Authorization: `bearer ${body.token}` }
      await db('trucks')
        .truncate()
      await db('trucks')
        .insert(truck)
      done()
    });
    it('should reject any request without an authorization header', async (done) => {
      const { status } = await request(server)
        .get('/api/trucks')

      expect(status).toBe(403)
      done()
    });
    describe('/', () => {

      it('should provide a list of trucks', async (done) => {
        const { body } = await request(server)
          .get('/api/trucks')
          .set(token)

        expect(body).toHaveLength(1)
        done()
      });
      it('should only show trucks within a certain distance when queried', async (done) => {
        db('trucks')
          .insert({
            "id": 3,
            "name": "Taqueria Sinaloa",
            "location": "37.785116 -122.237974",
            "departureTime": null,
            "cuisineId": 6,
            "photoId": 1,
          })
        const { body } = await request(server)
          .get('/api/trucks')
          .query({
            latitude: 37.770147,
            longitude: -122.261033,
            range: 2
          })
          .set(token)

        expect(body).toHaveLength(1)
        done()
      });
      describe('/:id', () => {
        beforeAll(async done => {
          db('trucks')
            .truncate()
          db('trucks')
            .insert(truck)
          done()
        });
        it('should return a specified truck when given an id', async (done) => {
          const { body } = await request(server)
            .get('/api/trucks/1')
            .set(token)

          expect(body.id).toBe(1)
          done()
        });
        it('should respond with a 404 when given an invalid id', async (done) => {
          const { status } = await request(server)
            .get('/api/trucks/2')
            .set(token)

          expect(status).toBe(404)
          done()
        });
        describe('/ratings', () => {
          describe('GET', () => {
            beforeAll(async done => {

              await db('trucks_ratings')
                .truncate()
              await db('trucks')
                .truncate()
              await db('trucks')
                .insert(truck)
              await db('trucks_ratings')
                .insert({
                  truckId: 1,
                  userId: 1,
                  rating: 5
                })
              done()
            });
            it('should give all ratings for a specified truck', async (done) => {
              const { body } = await request(server)
                .get('/api/trucks/1/ratings')
                .set(token)

              expect(body).toHaveLength(1)
              done()
            });
          });
          describe('POST', () => {
            it('should return a 404 for any call made to a truck that doesn\'t exist', async done => {
              const { status } = await request(server)
                .post('/api/trucks/3/ratings')
                .set(token)
                .send({
                  userId: 1,
                  rating: 5
                })
              expect(status).toBe(404)
              done()
            });

            it('should return a 400 for a missing userId or rating', async done => {
              const { status } = await request(server)
                .post('/api/trucks/1/ratings')
                .set(token)
                .send({
                  rating: 5
                })
              expect(status).toBe(400)
              done()
            });
            it('should return a rating and a truckId on a successful call', async done => {
              done()
            });
          });
        });
        describe('menu', () => {
          describe('GET', () => {
            it('should return a 404 for an invalid truck', async done => {
              done()
            });
            it('should return an array of menu items', async done => {
              done()
            });
          });
          describe('/:mId', () => {
            beforeAll(async done => {
              await db('menuItemRatings')
                .truncate()
              await db('trucks-menuItems')
                .truncate()
              await db('menuItems')
                .truncate()
              await db('trucks')
                .truncate()
              await db('trucks')
                .insert(truck)

              await db('menuItems')
                .insert({
                  id: 1,
                  name: 'pizza'
                })
              await db('menuItems')
                .insert({
                  id: 2,
                  name: 'tacos'
                })
              await db('trucks-menuItems')
                .insert({
                  truckId: 1,
                  menuItemId: 1,
                  price: 19.99,
                  description: 'it\'s pizza!'
                })
              done()
            });
            it('should return a 404 if the menu item is not in the truck', async done => {
              const { status } = await request(server)
                .post('/api/trucks/1/menu/2')
                .set(token)
                .send({
                  userId: 1,
                  rating: 5
                })
              expect(status)
                .toBe(404)
              done()
            });
            it('should return an object containing a rating', async done => {
              const { body } = await request(server)
                .post('/api/trucks/1/menu/1')
                .set(token)
                .send({
                  userId: 1,
                  rating: 5
                })
              expect(body.rating).toBe(5)
              done()
            });
          });
        });
      });
    });
  });
  afterAll(async done => {
    await db('users')
      .truncate()
    await db('trucks_ratings')
      .truncate()
    await db('trucks-menuItems')
      .truncate()
    await db('menuItems-photos')
      .truncate()
    await db('menuItems')
      .truncate()
    await db('menuItemRatings')
      .truncate()
    await db('favorites')
      .truncate()
    await db('errors')
      .truncate()
    done()
  });

});



async function register(username, password, roleId) {
  return await request(server)
    .post('/api/auth/register')
    .send({
      username,
      password,
      roleId
    })
}

async function login(username, password) {
  return await request(server)
    .post('/api/auth/login')
    .send({
      username,
      password
    })
}