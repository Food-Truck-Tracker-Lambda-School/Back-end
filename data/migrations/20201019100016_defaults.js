
exports.up = function (knex) {
  return knex.schema.alterTable('trucks', tbl => {
    if (process.env.NODE_ENV === 'production') {
      tbl.integer('photoId')
        .notNullable()
        .defaultTo(1)
        .alter()
    }
  })
};

exports.down = function (knex) {

};
