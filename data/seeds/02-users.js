const bcrypt = require('bcrypt')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { username: 'test', password: bcrypt.hashSync('hunter2', 10), roleId: 1 }
      ]);
    });
};
