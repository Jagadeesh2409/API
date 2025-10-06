
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()

  await knex('accounts').insert([
     { name: 'Jagadeesh', email: 'jagadeesh@example.com', phno:9655975647, password:'Jaga@123'  },
    { name: 'Admin', email: 'admin@example.com', phno:9655975648, password:'Admin@123' }
  ]);
};
