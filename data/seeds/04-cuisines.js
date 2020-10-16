
exports.seed = function (knex) {
  return knex('cuisines').insert([
    { id: 0, name: 'other' },
    { id: 1, name: 'african' },
    { id: 2, name: 'american' },
    { id: 3, name: 'asian' },
    { id: 4, name: 'cuban' },
    { id: 5, name: 'european' },
    { id: 6, name: 'mexican' },
    { id: 7, name: 'middle eastern' },
    { id: 8, name: 'south american' },
    { id: 9, name: 'bakery' },
    { id: 10, name: 'breakfast' },
    { id: 11, name: 'treats' },
  ]);
};
