import { Model } from 'objection';

export enum Type {
  Drink = 'drink',
  Appetizer = 'appetizer',
  Soup = 'soup',
  Main = 'main',
  Dessert = 'dessert',
}

export default class Recipe extends Model {
  static tableName = 'recipes';

  // @ts-ignore no default
  readonly id: number;

  // @ts-ignore no default
  name: string;

  // @ts-ignore no default
  description: string;

  // @ts-ignore no default
  type: Type;

  // @ts-ignore no default
  time: number;

  // @ts-ignore no default
  alcohol: boolean;

  static jsonSchema = {
    type: 'object',
    required: ['description'],
    properties: {
      id: {
        type: 'integer',
      },
      name: {
        type: 'string',
        optional: false,
        maxLength: 500,
      },
      description: {
        type: 'string',
        optional: false,
        maxLength: 2000,
      },
      type: {
        type: 'string',
        optional: false,
        enum: Object.values(Type),
      },
      time: {
        type: 'integer',
        optional: false,
        minimum: 5,
        multipleOf: 5,
      },
      alcohol: {
        type: 'boolean',
        optional: false,
        max: 500,
      },
    },
  };
}
