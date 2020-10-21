const request = require('supertest')
const server = require('../../api/server')
const db = require('../../data/connection')

describe('truck router', () => {
  it('should reject any request without an authorization header', async () => {

  });
  describe('/', () => {
    it('should provide a list of trucks', async () => {

    });
    it('should only show trucks within a certain distance when queried', async () => {

    });
    describe('/:id', () => {
      it('should return a specified truck when given an id', async () => {

      });
      it('should respond with a 404 when given an invalid id', async () => {

      });
      describe('/ratings', () => {
        describe('GET', () => {
          it('should give all ratings for a specified truck', async () => {

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