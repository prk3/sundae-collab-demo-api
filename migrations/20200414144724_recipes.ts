import Knex from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary();
    table.string('name', 600).notNullable();
    table.string('description', 2100).notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTableIfExists('recipes');
}
