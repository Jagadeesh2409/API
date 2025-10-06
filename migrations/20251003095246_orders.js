//id | user_id | total_price | shipping_address | status | created_at

exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();           // Order ID
    table.string('inovoice_no').notNullable().unique()
    table.integer('user_id').references('id').inTable('accounts').unsigned().notNullable(); // Reference to user
    table.integer('quantity').notNullable()
    table.decimal('total_price', 10, 2).notNullable(); // Total order amount
    table.enum('status', ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'])
         .defaultTo('Pending');                         // Order status
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders');
};
