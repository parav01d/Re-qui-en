---
date: 2020-03-18
title: "Configuration"
cover: "/images/empty.png"
categories:
    - Development
tags:
    - clean code
    - architecture
---

## About the Pattern

I highly recommend to use a environment specific configuration for your application. Here is an example how you inject this environment variables in your docker environment (environment section):


```
version: "3"
volumes:
  node_modules_thalamus:
  node_modules_console:
services:
  db_host:
    build:
      context: ./
      dockerfile: ./container/postgres.Dockerfile
    ports:
      - "5432:5432"
    networks:
      - backend
  thalamus:
    build:
      context: ./src/thalamus
      dockerfile: ../../container/thalamus.Dockerfile
      args:
        IS_WATCHMODE: "true"
    ports:
      - "3090:3000"
    depends_on:
      - db_host
    networks:
      - backend
    volumes:
      - ./src/thalamus/:/bindmount:rw
      - ./resources/uploads/:/uploads:rw
      - node_modules_thalamus:/bindmount/node_modules/:rw
    environment:
      DB_HOST: db_host
      DB_USERNAME: spdbuser
      DB_PASSWORD: DB_PASSWORD
      DB_DATABASE: thalamus
      NODE_ENV: docker
      SMTP_HOST: mail1.hosting.ntag.de
      SMTP_PORT: 587
      SMTP_USER: SMTP_USER
      SMTP_PASSWORD: SMTP_PASSWORD
  console:
    build:
      context: ./src/provider
      dockerfile: ../../container/console.Dockerfile
      args:
        IS_WATCHMODE: "true"
    ports:
      - "3086:3000"
    depends_on:
      - thalamus
    networks:
      - frontend
    volumes:
      - ./src/provider/:/bindmount:rw
      - node_modules_console:/bindmount/node_modules/:rw
    environment:
      NODE_ENV: docker
      REACT_APP_SP_API_BASEURL: http://localhost:3090
      REACT_APP_GOOGLE_API_KEY: GOOGLE_API_SECRET_KEY
networks:
  frontend:
  backend:
```

Creating a .env.exmaple file can help your developers to make their own configurations. The structure of this file looks like this:

```
## General
BASEURL=http://localhost:3090
UPLOADS_PATH=../uploads
PORT=3000
```

A configuration for an ORM for example can be look like this:

```javascript
export const ORMConfig = {
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT as unknown as number,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  type: "postgres",
  logging: true,
  entities: [
      path.resolve(__dirname, "../api/Model/**/*.ts"),
      path.resolve(__dirname, "../api/Model/**/*.js"),
  ],
  migrations: [
    path.resolve(__dirname, "../database/migration/*.ts"),
    path.resolve(__dirname, "../database/migration/*.js"),
    path.resolve(__dirname, "../database/seed/*.ts"),
    path.resolve(__dirname, "../database/seed/*.js"),
  ],
  subscribers: [],
  namingStrategy: new nameingStrategies.SnakeNamingStrategy(),
} as ConnectionOptions;
```
