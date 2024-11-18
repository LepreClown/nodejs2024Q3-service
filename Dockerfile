FROM node:22 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app /app

EXPOSE $PORT

CMD ["npm", "run", "start:dev:migrate"]