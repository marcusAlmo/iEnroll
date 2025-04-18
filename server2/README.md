<p align="center">
  <img src="./docs/face-smile-wink-solid.svg" width="120" alt="IEnroll Logo" />
</p>

<h1 align="center">
  IEnroll Backend
</h1>

<p align="center">
  <a href="https://prisma.io" target="_blank">
    <img src="https://img.shields.io/badge/Made%20with-Prisma-3982CE?style=flat&logo=prisma&logoColor=white" alt="Made with Prisma" />
  </a>
  <a href="https://nestjs.com/" target="_blank">
    <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  </a>
</p>

<p align="center">
By Uppend
</p>

<p align="center">
  Welcome to the <strong>IEnroll Backend</strong>! This project is powered by <strong>NestJS</strong> and serves as the core backend for the IEnroll application. It exposes a robust and scalable RESTful API that handles enrollment processes, user management, and other core features.
  <br />
  This backend also supports a microservices architecture using <strong>RabbitMQ</strong> as a message broker, enabling efficient asynchronous communication across services.
</p>

## Prerequisites

Before setting up the project, make sure the following software is installed on your machine:

- **Erlang** – Required by RabbitMQ  
  👉 [Download Erlang](https://www.erlang.org/downloads)

- **RabbitMQ** – Message broker used for microservices communication  
  👉 [Install RabbitMQ (Windows Guide)](https://www.rabbitmq.com/docs/install-windows#installer)

> ⚠️ Make sure to install Erlang **before** RabbitMQ to avoid setup issues.

## Installation

Ensure you have Node.js (v14 or above) and npm installed on your system.

1. **Install all dependencies:**

   ```bash
   npm install
   ```

## Initialization

Before running the server, you'll need to initialize and configure your **Prisma** setup.

### Initialize Prisma

1. **Initialize Prisma schema:**

   This step applies any schema changes to your database. It will run migrations or set up your database based on the defined schema in your project.

   ```bash
   npm run prisma:schema
   ```

2. **Update Prisma Client Types**

   Generate Prisma Client Types:
   After making schema changes (e.g., adding models or changing data types), update the Prisma client types to reflect the changes. This ensures the Prisma client is in sync with your schema.

   ```bash
   npm run prisma:generate
   ```

   > ⚠️ It’s important to run `prisma:generate` whenever the schema changes to ensure type safety when interacting with your database.

## Running the Server

### Start a Single Service in Development

You can run individual services using:

```bash
npm run start:dev:<service-name>
```

For example:

```bash
npm run start:dev:api-gateway
npm run start:dev:auth
```

### Start All Services in Development

```bash
npm run start:dev:all
```

## Running Tests

### Unit Tests

```bash
npm run test
```

### End-to-End (E2E) Tests

```bash
npm run test:e2e
```

## Code Formatting

To format the project using Prettier:

```bash
npm run format
```

## Production Build & Start

To build and start the server in production mode:

```bash
npm run build
npm run start:prod
```

## Configuration

You can customize the app behavior by editing the `.env` file. Remember that you must specify the required variables. Below are the key environment variables.:

| Variable Name          | Description                        | Required                                 | Example                                       |
| ---------------------- | ---------------------------------- | ---------------------------------------- | --------------------------------------------- |
| `PORT`                 | Port number the app will listen on | No                                       | `3000`                                        |
| `HOST`                 | Host IP to bind the server to      | No, but advisable in prod                | `192.168.1.43`                                |
| `CORS_ORIGIN`          | Allowed origins for CORS requests  | No, but advisable in prod                | `http://localhost:5173,http://localhost:5174` |
| `DATABASE_URL`         | Database connection string         | Yes                                      | `postgres://...`                              |
| `JWT_SECRET_KEY`       | Secret key for signing JWTs        | No (must be specified for auth to work)  | `your_jwt_secret`                             |
| `JWT_EXPIRATION`       | JWT token expiration time          | No (must be specified for auth to work)  | `1d`, `7d`                                    |
| `RABBITMQ_URL`         | RabbitMQ connection string         | No (required in production environments) | `amqp://localhost`                            |
| `GOOGLE_CLIENT_ID`     | Google client ID                   | Yes                                      | `djbetdf45t...`                               |
| `GOOGLE_CLIENT_SECRET` | Google client secret               | Yes                                      | `GOCS-wwdewr...`                              |

> 🛡️ Keep sensitive values like `JWT_SECRET_KEY` secure and never commit them to version control.

## Contributors

<p align="center">
  <div align="center" style="display: flex; justify-content: center; gap: 40px; flex-wrap: wrap;">
    <div align="center">
      <a href="https://github.com/kntgio-z">
        <img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/112701322?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d" width="100" alt="@kntgio-z" />
        <br />
        <sub><b>@kntgio-z</b></sub>
      </a>
      <br />
      <i>Backend Lead</i>
    </div>
    <div align="center">
      <a href="https://github.com/Mark-cyber-lab">
        <img src="https://images.weserv.nl/?url=avatars.githubusercontent.com/u/156742215?v=4&h=100&w=100&fit=cover&mask=circle&maxage=7d" width="100" alt="@Mark-cyber-lab" />
        <br />
        <sub><b>@Mark-cyber-lab</b></sub>
      </a>
      <br />
      <i>System Architect & Microservices Lead</i>
    </div>
  </div>
</p>
