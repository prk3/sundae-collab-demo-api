import http from 'http';
import { Application } from 'express';
import makeApp from '../../src/app';
import connect from '../../src/db';

declare global {
  namespace NodeJS {
    interface Global {
      getApp: () => Application;
    }
  }
  const getApp: () => Application;
}

// This file creates a demo-api instance in each test suite.
// Application's db is replaced with a transaction that gets
// rolled back after each test, so that we don't have to care
// about clearing db after tests.

const db = connect();
const app = makeApp(db);
const server = http.createServer(app);

beforeAll(async () => {
  await new Promise((res) => server.listen(0, () => res()));
});

beforeEach(async () => {
  const transaction = await db.transaction();
  app.set('db', transaction);
});

afterEach(async () => {
  await app.get('db').rollback().catch(() => {});
});

afterAll(async () => {
  await db.destroy();
  await new Promise((res) => server.close(() => res()));
});

global.getApp = () => app;
