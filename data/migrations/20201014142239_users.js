
exports.up = function (knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments('id')
    tbl.text('username')
      .notNullable()
      .unique()
    tbl.text('password')
      .notNullable()
      .unique()
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('users')
};
