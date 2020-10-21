const request = require('supertest')
const server = require('../../api/server')
const db = require('../../data/connection')

describe('auth router', () => {
  describe('registration', () => {
    beforeEach(async () => {
      await db('users').truncate()
    })
    it('should register a new user with a post to /api/auth/register', async () => {

      const response = await register('merry', 'pippen', 1)

      const users = await db('users')
      expect(users).toHaveLength(1)
    });
    it('should not register a new user if missing a roleId', async () => {
      const response = await register('merry', 'pippen')

      const users = await db('users')
      expect(users).toHaveLength(0)
    });
    it('should not register a user if a user with that username already exists', async () => {
      db('users')
        .insert({
          username: 'merry',
          password: 'pippen',
          roleId: 1
        })

      const response = await register('merry', 'pippen', 1)
      const users = await db('users')
      expect(users).toHaveLength(1)
    })
    it('should respond with "invalid roleId" if given a roleId other than 1 or 2', async () => {
      const response = await register('merry', 'pippen', 3)
      expect(response.body.message).toMatch('invalid roleId')
    });
  });
  describe('login', () => {
    beforeEach(async () => {
      await db('users')
        .truncate()
      await db('users')
        .insert({
          username: 'merry',
          password: require('bcrypt').hashSync('pippen', 10),
          roleId: 1
        })
    })
    it('should log in a user that exists in the system, and return a token', async () => {
      const response = await login('merry', 'pippen')
      expect(response.body.token).toBeTruthy()
    });
    it('should say invalid username if user does not exist', async () => {
      const response = await login('gandalf', 'pippen')
      expect(response.body.message).toMatch('invalid username')
    });
    it('should say invalid password if given an incorrect password', async () => {
      const response = await login('merry', 'gandalf')
      expect(response.body.message).toMatch('invalid password')
    });
    it('should say missing password if not given a password', async () => {
      const response = await login('merry')
      expect(response.body.message).toMatch('missing password')
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