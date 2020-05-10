require('dotenv').config();

module.exports ={
  client: process.env.DB_TYPE,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  migrations: {
    directory: 'build/migrations',
  },
  seeds: {
    directory: 'build/seeds',
  },
};
