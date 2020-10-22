
exports.up = function (knex) {
  return knex.schema.createTable('trucks-ratings', tbl => {
    tbl.integer('truckId')
      .notNullable()
      .references('id')
      .inTable('trucks')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    tbl.integer('userId')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
    tbl.integer('rating')
      .notNullable()

    tbl.primary('truckId', 'userId')
  })
    .dropTable('truckRatings')
};

exports.down = function (knex) {
  return knex.schema.dropTable('trucks-ratings')
};
