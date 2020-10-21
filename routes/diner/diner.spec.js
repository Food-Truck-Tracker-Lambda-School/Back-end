const request = require('supertest')
const server = require('../../api/server')
const db = require('../../data/connection')

describe('diner router', () => {
  it('should reject any call made without an authorization token', async () => {

  });
  describe('/:id', () => {
    it('should respond with a 404 if given an invalid userId', async () => {

    });
    describe('GET', () => {
      it('should contain favorites, ratings, and photos when provided a valid userID', async () => {

      });
    });
    describe('/:id/favorites', () => {
      describe('GET', () => {
        it('should respond with a list of favorites when provided a valid id', async () => {

        });
      });
      describe('POST', () => {
        it('should respond with a 404 when given an invalid truckId', async () => {

        });
        it('should respond with a 400 when the truck already exists in the user\'s favorites', async () => {

        });
        it('should respond with a list of all the user\'s favorites when given a valid truck', async () => {

        });
      });
      describe('/:fid', () => {
        it('should respond with a 404 if truck is not in user\'s favorites', async () => {

        });
        it('should respond with a 204 when successfully removing favorite', async () => {

        });
      });
    });
    describe('/:id/photos', () => {
      it('should return an array of photos', async () => {

      });
    });
    describe('/:id/ratings', () => {
      it('should return an array of ratings', async () => {

      });
    });
  });



});