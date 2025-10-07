exports.up = function (knex) {
  return knex.schema.createTable("products", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.double("original_price", 12, 2).notNullable();
    table.string("current_price", 12, 2).notNullable();
    table.double("discount", 5, 2).defaultTo(0.0);
    table.double("tax", 5, 2).defaultTo(0.0);
    table.text("description").notNullable();
    table.string("brand").notNullable();
    table.json("specifications").notNullable();
    table
      .integer("categories")
      .references("id")
      .inTable("categories")
      .onDelete("CASCADE")
      .unsigned();
    table.integer("stock").defaultTo(0).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("products");
};
