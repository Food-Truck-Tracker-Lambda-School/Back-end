
exports.up = function (knex) {
  return knex.schema.createTable('roles', tbl => {
    tbl.increments('id')
    tbl.text('name')
      .unique()
      .notNullable()
  })
    .createTable('users', tbl => {
      tbl.increments('id')
      tbl.text('username')
        .notNullable()
        .unique()
      tbl.text('password')
        .notNullable()
        .unique()
      tbl.integer('roleId')
        .notNullable()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
    })
};

exports.down = function (knex) {
  return knex.schema.dropTable('users')
    .dropTable('roles')

};
