ENV NODE_ENV=production
ENV PORT=8000
ENV DB_TYPE=pg
ENV DB_HOST=127.0.0.1
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=postgres

FROM node:12
WORKDIR /usr/src/app

COPY package.json .
RUN npm install

EXPOSE $PORT
CMD sleep 5 && npx knex migrate:latest && npx knex seed:run && npm run server

COPY . .
