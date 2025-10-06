exports.up = function (knex) {
  return knex.schema.createTable("user_addresses", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("accounts")
      .onDelete("CASCADE"); // If user deleted, delete their addresses too

    table.string("name").notNullable(); // e.g. "Home", "Office"
    table.string("address_line1").notNullable();
    table.string("address_line2");
    table.string("city").notNullable();
    table.string("state").notNullable();
    table.string("postal_code").notNullable();
    table.string("country").notNullable().defaultTo("India");
    table.string("phone_number");

    table.boolean("is_default").defaultTo(false); // To mark default address

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("user_addresses");
};
