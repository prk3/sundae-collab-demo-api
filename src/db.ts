import Knex from 'knex';

/**
 * Creates a knex database connection using env variables.
 */
export default function connect() {
  return Knex({
    client: process.env.DB_TYPE,
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
  });
}
