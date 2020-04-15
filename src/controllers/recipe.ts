import Knex from 'knex';
import Recipe from '../models/recipe';

export async function index(trx: Knex) {
  return Recipe.query(trx).select('*').orderBy('id', 'ASC');
}

export async function create(data: object, trx: Knex) {
  const recipe = Recipe.fromJson(data).$omit(Recipe.idColumn);
  return Recipe.query(trx).insert(recipe).returning('*');
}

export async function read(id: number, trx: Knex) {
  return Recipe.query(trx).findById(id);
}

export async function update(id: number, data: object, trx: Knex) {
  const recipe = Recipe.fromJson(data, { patch: true }).$omit(Recipe.idColumn);
  return Recipe.query(trx)
    .findById(id)
    .update(recipe)
    .returning('*');
}

export async function del(id: number, trx: Knex) {
  return Recipe.query(trx).deleteById(id).returning('*');
}
