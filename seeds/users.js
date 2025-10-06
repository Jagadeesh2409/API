
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('accounts').del()

  await knex('accounts').insert([
    { name: 'Admin', email: 'admin@example.com', phno:9655975648,role:'admin', password:'Admin@123' },
     { name: 'Jagadeesh', email: 'jagadeesh@example.com', phno:9655975647, password:'Jaga@123'  }
  ]);
};
