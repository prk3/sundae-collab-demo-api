/* eslint-disable import/prefer-default-export */
import Knex from 'knex';
import Recipe, { Type } from '../src/models/recipe';

export async function seed(knex: Knex) {
  await knex(Recipe.tableName).del();
  await Recipe.query(knex).insert({
    name: 'Lasagne',
    description: 'An Italian dish made of stacked layers of this flat pasta alternating with fillings such as ragù and other vegetables, cheese, and seasonings and spices such as garlic, oregano and basil.',
    type: Type.Main,
    time: 120,
    alcohol: false,
  });
}
