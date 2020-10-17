
exports.up = function (knex) {

  return knex.schema.alterTable('trucks', tbl => {
    if (process.env.NODE_ENV === 'production') {
      tbl.dateTime('departureTime')
        .alter()
    }
    else {
      tbl.dropColumn('departureTime')
    }
  })
    .alterTable('trucks', tbl => {
      if (knex.connection().client.config.client === 'sqlite3') {
        tbl.dateTime('departureTime')
      }
    })
};

exports.down = function (knex) {
  return
};
