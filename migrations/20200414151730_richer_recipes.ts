import Knex from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('recipes', (table) => {
    table.enum('type', ['drink', 'appetizer', 'soup', 'main', 'dessert']).defaultTo('main').notNullable();
    table.integer('time').defaultTo(60).notNullable();
    table.boolean('alcohol').defaultTo(false).notNullable();
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('recipes', (table) => {
    table.dropColumns('type', 'time', 'alcohol');
  });
}
