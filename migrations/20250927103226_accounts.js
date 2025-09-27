exports.up = function(knex) {
  return knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable().unique();
    table.string('phno')
    table.string('password').notNullable();
    table.string('role').defaultTo('client'); 
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('accounts'); 
};
