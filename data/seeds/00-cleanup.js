const cleaner = require('knex-cleaner')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return cleaner.clean(knex, {
    mode: 'truncate',
    ignoreTables: ['migrations', 'migrations_lock']
  })
    .then(function () {
    });
};
