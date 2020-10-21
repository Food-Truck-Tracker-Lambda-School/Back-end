const request = require('supertest')
const server = require('../../api/server')
const db = require('../../data/connection')

describe('operator router', () => {
  it('should reject any call without an authorization header', async () => {

  });
  describe('/:id', () => {
    describe('GET', () => {

    });
    describe('/:id/trucks', () => {
      it('should respond with a 404 if given an invalid userId', async () => {

      });
      describe('GET', () => {
        it('should provide a list of trucks when given a valid userID', async () => {

        });
      });
      describe('POST', () => {
        it('should respond with a 400 if given anything unexpected', async () => {

        });
        it('should respond with a 400 if missing any required fields', async () => {

        });
        it('should respond with a 201 and a list of all operator\'s trucks when given valid information', async () => {

        });
      });
      describe('/:tId', () => {
        it('should respond with a 404 if given an invalid truckId', async () => {

        });
        describe('GET', () => {
          it('should respond with a trucks info when given a valid user and truck id', async () => {

          });
          it('should respond with a 404 if truckId does not belong to user', async () => {

          });
        });
        describe('PUT', () => {
          it('should respond with a 400 if given any information it didn\'t ask for', async () => {

          });
          it('should respond with the edited truck when given valid information', async () => {

          });
          it('should still edit truck when given only the adjusted information', async () => {

          });
        });
        describe('DELETE', () => {
          it('should respond with a 204 if truck exists', async () => {

          });
        });
        describe('/menu', () => {
          it('should respond with a truck\'s menu when given a valid user and truck id', async () => {

          });
          describe('/:mId', () => {
            it('should respond with a 404 if given an invalid menuItemId', async () => {

            });
            it('should respond with a list of menuItems if given a valid menuItemId', async () => {

            });
            it('should respond with a 400 if menuItem already exists in the menu', async () => {

            });

          });
        });

      });
    });
  });

});