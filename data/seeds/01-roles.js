
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('roles').insert([
    { name: 'user' },
    { name: 'owner' },
  ]);
};
