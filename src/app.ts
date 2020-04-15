import Knex from 'knex';
import express, {
  json, Request, Response, NextFunction,
} from 'express';
import cors from './middleware/cors';

import * as recipeController from './controllers/recipe';

/**
 * Wraps async handlers. If a handler throws (promise rejection), we catch the error
 * and pass it to Express' error changer using next function. Errors that don't contain
 * statusCode property are treated as non-business errors and are logged to the console.
 */
function safe(handler: (req: Request, res: Response) => Promise<void>) {
  return function sandboxInternal(req: Request, res: Response, next: NextFunction) {
    handler(req, res).catch((err) => {
      if (typeof err === 'object' && !Object.hasOwnProperty.call(err, 'statusCode')) {
        console.error(err);
      }
      next(err);
    });
  };
}

export default function makeApp(db: Knex) {
  // store db connection with the app
  const app = express().set('db', db);

  // in test/development env allow cross origin requests
  if (process.env.NODE_ENV !== 'production') {
    console.log('Allowing all origins');
    app.use(cors('*'));
  }

  // automatically parse incoming json data
  app.use(json());

  app.get('/recipes', safe(async (req, res) => {
    res.status(200).json(await recipeController.index(req.app.get('db')));
  }));

  app.post('/recipes', safe(async (req, res) => {
    res.status(201).json(await recipeController.create(req.body, req.app.get('db')));
  }));

  app.get('/recipes/:id', safe(async (req, res) => {
    const id = Number(req.params.id);
    const recipe = await recipeController.read(id, req.app.get('db'));
    if (recipe) res.status(200).json(recipe);
    else res.status(404).send();
  }));

  app.put('/recipes/:id', safe(async (req, res) => {
    const id = Number(req.params.id);
    const recipe = await recipeController.update(id, req.body, req.app.get('db'));
    if (recipe) res.status(200).json(recipe);
    else res.status(404).send();
  }));

  app.delete('/recipes/:id', safe(async (req, res) => {
    const id = Number(req.params.id);
    const recipe = await recipeController.del(id, req.app.get('db'));
    if (recipe) res.status(204).send();
    else res.status(404).send();
  }));

  return app;
}
