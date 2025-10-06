
exports.up = function(knex) {
    return knex.schema.createTable('products_img',(table)=>{
        table.increments('id').primary();
        table.integer('product_id').references('id').inTable('products').unsigned().onDelete('CASCADE');
        table.string('url').unique().notNullable();
    })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products') 
};
