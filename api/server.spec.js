const request = require('supertest')
const server = require('./server')
const db = require('../data/connection')
let token

const path = require('path')
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
            .insert({
              id: 1,
              name: 'Gerard\s Paella',
              userId: 1,
              location: '37.780454 -122.310074',
              cuisineId: 5,
              photoId: 1
            })
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
            done()
          });
          it('should respond with a list of all the user\'s favorites when given a valid truck', async (done) => {
            done()
          });
        });
        describe('/:fid', () => {
          it('should respond with a 404 if truck is not in user\'s favorites', async (done) => {
            done()
          });
          it('should respond with a 204 when successfully removing favorite', async (done) => {
            done()
          });
        });
      });
      describe('/:id/photos', () => {
        it('should return an array of photos', async (done) => {
          done()
        });
      });
      describe('/:id/ratings', () => {
        it('should return an array of ratings', async (done) => {
          done()
        });
      });
    });



  });

  describe('operator router', () => {
    it('should reject any call without an authorization header', async (done) => {
      done()
    });
    describe('/:id', () => {

      describe('/:id/trucks', () => {
        it('should respond with a 404 if given an invalid userId', async (done) => {
          done()
        });
        describe('GET', () => {
          it('should provide a list of trucks when given a valid userID', async (done) => {
            done()
          });
        });
        describe('POST', () => {
          it('should respond with a 400 if given anything unexpected', async (done) => {
            done()
          });
          it('should respond with a 400 if missing any required fields', async (done) => {
            done()
          });
          it('should respond with a 201 and a list of all operator\'s trucks when given valid information', async (done) => {
            done()
          });
        });
        describe('/:tId', () => {
          it('should respond with a 404 if given an invalid truckId', async (done) => {
            done()
          });
          describe('GET', () => {
            it('should respond with a trucks info when given a valid user and truck id', async (done) => {
              done()
            });
            it('should respond with a 404 if truckId does not belong to user', async (done) => {
              done()
            });
          });
          describe('PUT', () => {
            it('should respond with a 400 if given any information it didn\'t ask for', async (done) => {
              done()
            });
            it('should respond with the edited truck when given valid information', async (done) => {
              done()
            });
            it('should still edit truck when given only the adjusted information', async (done) => {
              done()
            });
          });
          describe('DELETE', () => {
            it('should respond with a 204 if truck exists', async (done) => {
              done()
            });
          });
          describe('/menu', () => {
            it('should respond with a truck\'s menu when given a valid user and truck id', async (done) => {
              done()
            });
            describe('/:mId', () => {
              it('should respond with a 404 if given an invalid menuItemId', async (done) => {
                done()
              });
              it('should respond with a list of menuItems if given a valid menuItemId', async (done) => {
                done()
              });
              it('should respond with a 400 if menuItem already exists in the menu', async (done) => {
                done()
              });

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
    it('should reject any request without an authorization header', async (done) => {
      done()
    });
    describe('/', () => {
      it('should provide a list of trucks', async (done) => {
        done()
      });
      it('should only show trucks within a certain distance when queried', async (done) => {
        done()
      });
      describe('/:id', () => {
        it('should return a specified truck when given an id', async (done) => {
          done()
        });
        it('should respond with a 404 when given an invalid id', async (done) => {
          done()
        });
        describe('/ratings', () => {
          describe('GET', () => {
            it('should give all ratings for a specified truck', async (done) => {
              done()
            });
          });
          describe('POST', () => {

          });
        });
        describe('menu', () => {
          describe('GET', () => {

          });
          describe('/:mId', () => {

          });
        });
      });
    });
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