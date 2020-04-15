import request from 'supertest';
import './utils/app';

const defaultRecipe = Object.freeze({
  name: 'Lasagne',
  description: 'An Italian dish made of stacked layers of this flat pasta alternating with fillings such as ragù and other vegetables, cheese, and seasonings and spices such as garlic, oregano and basil.',
  type: 'main',
  time: 120,
  alcohol: false,
});

function resolveInSequence(promises: (() => Promise<any>)[]): Promise<void> {
  return promises.reduce((acc, next) => acc.then(next), Promise.resolve());
}

describe('recipe', () => {
  describe('index', () => {
    it('is empty initially', async () => {
      const response = await request(getApp()).get('/recipes');

      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(0);
    });

    it('grows after adding recipes', async () => {
      await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'first',
      });

      {
        const index = await request(getApp()).get('/recipes');

        expect(index.status).toEqual(200);
        expect(Array.isArray(index.body)).toBeTruthy();
        expect(index.body.length).toEqual(1);
        expect(index.body[0].name).toEqual('first');
      }

      await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'second',
      });

      {
        const index = await request(getApp()).get('/recipes');

        expect(index.status).toEqual(200);
        expect(Array.isArray(index.body)).toBeTruthy();
        expect(index.body.length).toEqual(2);
        expect(index.body[0].name).toEqual('first');
        expect(index.body[1].name).toEqual('second');
      }
    });

    it('shrinks after removing recipes', async () => {
      const first = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'first',
      });

      {
        const index = await request(getApp()).get('/recipes');

        expect(index.status).toEqual(200);
        expect(Array.isArray(index.body)).toBeTruthy();
        expect(index.body.length).toEqual(1);
        expect(index.body[0].name).toEqual('first');
      }

      await request(getApp()).delete(`/recipes/${first.body.id}`);

      {
        const index = await request(getApp()).get('/recipes');

        expect(index.status).toEqual(200);
        expect(Array.isArray(index.body)).toBeTruthy();
        expect(index.body.length).toEqual(0);
      }
    });
  });

  describe('creation', () => {
    it('fails when sending no data', async () => {
      const response = await request(getApp()).post('/recipes').send();
      expect(response.status).toEqual(400);
    });

    it('fails when sending empty map', async () => {
      const response = await request(getApp()).post('/recipes').send({});
      expect(response.status).toEqual(400);
    });

    it('works when sending valid data', async () => {
      const response = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'test1',
        description: 'this is my super description',
      });

      expect(response.status).toEqual(201);
      expect(response.body.name).toEqual('test1');
      expect(response.body.description).toEqual('this is my super description');
    });

    it("does not override an existing model's id", async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'hello',
        description: 'one',
      });

      expect(created.body.id).toBeTruthy();

      const override = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        id: created.body.id,
        name: 'world',
        description: 'two',
      });

      expect(override.status).toEqual(201);
      expect(override.body.id).not.toEqual(created.body.id);
      expect(override.body.name).toEqual('world');
      expect(override.body.description).toEqual('two');
    });
  });

  describe('reading', () => {
    it('fails when model does not exist', async () => {
      const response = await request(getApp()).get('/recipes/1');
      expect(response.status).toEqual(404);
    });

    it('works and returns correct response when model exists', async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
      });

      const read = await request(getApp()).get(`/recipes/${created.body.id}`);

      expect(read.status).toEqual(200);
      expect(read.body).toMatchObject({
        ...defaultRecipe,
        id: created.body.id,
      });
    });
  });

  describe('updating', () => {
    it('fails when model does not exist', async () => {
      const response = await request(getApp()).put('/recipes/1');
      expect(response.status).toEqual(404);
    });

    it('fails when sending invalid data', async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'foo',
        description: 'one two three',
      });

      const updated = await request(getApp()).put(`/recipes/${created.body.id}`).send({
        ...defaultRecipe,
        name: 100,
        description: { foo: 'bar' },
      });

      expect(updated.status).toEqual(400);
    });

    it('works when sending valid data', async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'foo',
        description: 'one two three',
      });

      const updated = await request(getApp()).put(`/recipes/${created.body.id}`).send({
        ...defaultRecipe,
        name: 'bar',
        description: 'new content',
      });

      expect(updated.status).toEqual(200);
      expect(updated.body.id).toEqual(created.body.id);
      expect(updated.body.name).toEqual('bar');
      expect(updated.body.description).toEqual('new content');
    });

    it('does not create new recipes', async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'tom',
        description: 'one',
      });

      expect(created.body.id).toBeTruthy();

      const override = await request(getApp()).put('/recipes/999999999').send({
        ...defaultRecipe,
        name: 'alice',
        description: 'two',
      });

      expect(override.status).toEqual(404);
    });

    it('does not override ids', async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'tom',
        description: 'one',
      });

      expect(created.body.id).toBeTruthy();

      const override = await request(getApp()).put(`/recipes/${created.body.id}`).send({
        ...defaultRecipe,
        id: 9999999,
        name: 'alice',
        description: 'two',
      });

      expect(override.status).toEqual(200);
      expect(override.body.id).toEqual(created.body.id);
      expect(override.body.name).toEqual('alice');
      expect(override.body.description).toEqual('two');
    });
  });

  describe('deletion', () => {
    it('fails when model does not exist', async () => {
      const response = await request(getApp()).delete('/recipes/1');
      expect(response.status).toEqual(404);
    });

    it('works when model exists', async () => {
      const created = await request(getApp()).post('/recipes').send({
        ...defaultRecipe,
        name: 'hello',
        description: 'one',
      });

      const deleted = await request(getApp()).delete(`/recipes/${created.body.id}`);
      expect(deleted.status).toEqual(204);

      const second = await request(getApp()).get(`/recipes/${created.body.id}`);
      expect(second.status).toEqual(404);
    });
  });

  describe('validation', () => {
    it('fails with invalid recipe input', async () => {
      const invalid = [
        { ...defaultRecipe, name: 'one '.repeat(500 / 4 + 1) },
        { ...defaultRecipe, name: null },
        { ...defaultRecipe, description: 'one '.repeat(2000 / 4 + 1) },
        { ...defaultRecipe, description: null },
        { ...defaultRecipe, type: 'something_weird' },
        { ...defaultRecipe, type: null },
        { ...defaultRecipe, time: 0 },
        { ...defaultRecipe, time: 19 },
        { ...defaultRecipe, time: -5 },
        { ...defaultRecipe, time: null },
        { ...defaultRecipe, alcohol: 'true' },
        { ...defaultRecipe, alcohol: null },
      ];

      await resolveInSequence(invalid.map((recipe, i) => async () => {
        const res = await request(getApp()).post('/recipes').send(recipe);
        if (res.status !== 400) {
          console.error('case', i, res.status, recipe);
        }
        expect(res.status).toEqual(400);
      }));
    });

    it('passes with valid recipe input', async () => {
      const valid = [
        { ...defaultRecipe, name: '' },
        { ...defaultRecipe, description: '' },
        { ...defaultRecipe, type: 'appetizer' },
        { ...defaultRecipe, type: 'main' },
        { ...defaultRecipe, type: 'soup' },
        { ...defaultRecipe, type: 'drink' },
        { ...defaultRecipe, time: 5 },
        { ...defaultRecipe, time: 10 },
        { ...defaultRecipe, time: 15 },
        { ...defaultRecipe, alcohol: true },
        { ...defaultRecipe, alcohol: false },
      ];

      await resolveInSequence(valid.map((recipe, i) => async () => {
        const res = await request(getApp()).post('/recipes').send(recipe);
        if (res.status !== 201) {
          console.error('case', i, res.status, recipe);
        }
        expect(res.status).toEqual(201);
      }));
    });
  });
});
