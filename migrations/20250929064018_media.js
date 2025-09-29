
exports.up = async(knex) =>{
    return await knex.schema.createTable('media',(table)=>{
        table.increments('id').primary()
        table.integer('user_id').unsigned()
         .references('id')
         .inTable('accounts')
         .onDelete('CASCADE')
        table.string('type')
        table.string('url')
    }) 
};

exports.down = async(knex) =>{
     return await knex.schema.dropTableIfExists('user_profile'); 
};
