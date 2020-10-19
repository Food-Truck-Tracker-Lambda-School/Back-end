
exports.up = function (knex) {
  return knex.schema.createTable('errors', tbl => {
    tbl.increments('id')
    tbl.dateTime('errorDate')
      .notNullable()
    tbl.text('error')
      .notNullable()
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('errors')
};
