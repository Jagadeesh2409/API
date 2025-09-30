
exports.up = function(knex) {
    return knex.schema.createTable('products',(table)=>{
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.double('price',12,2).notNullable();
        table.string('description').notNullable();
        table.integer('categories').references('id').inTable('categories').onDelete('CASCADE').unsigned(); 
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
     return knex.schema.dropTableIfExists('products') 
};
