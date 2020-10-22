
exports.up = function (knex) {
  return knex.schema.dropTable('truckRatings')
    .createTable('truckRatings', tbl => {
      tbl.increments('id')
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
    })
};

exports.down = function (knex) {

};
