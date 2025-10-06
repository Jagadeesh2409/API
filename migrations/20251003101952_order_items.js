
exports.up = function(knex) {
    return knex.schema.createTable('order_items',(table)=>{
        table.increments('id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products').onDelete('CASCADE');
        table.integer('quantity').notNullable()
        table.decimal('price').notNullable()
        table.decimal('total',8,2).notNullable()
        table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('CASCADE')
         table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};


exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_items');
};


