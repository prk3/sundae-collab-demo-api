FROM node:12-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=8000
ENV DB_TYPE=pg
ENV DB_HOST=127.0.0.1
ENV DB_PORT=5432
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_DATABASE=postgres

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE $PORT
CMD sleep 5 \
    && npx knex --knexfile=knexfile.prod.js migrate:latest \
    && npx knex --knexfile=knexfile.prod.js seed:run \
    && npm run start
