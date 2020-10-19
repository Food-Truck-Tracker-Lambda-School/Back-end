
exports.seed = function (knex) {
  return knex('photos').insert([
    { id: 1, url: 'https://cdn2.lamag.com/wp-content/uploads/sites/6/2017/03/foodtruck.jpg', userId: 1 },
  ]);
};
