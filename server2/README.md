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

To get started, you'll need to have Node.js (v14 or above) and npm installed.

1. **Install dependencies:**

   ```bash
    npm i
   ```

2. **Start the Development Server**:

   ```bash
     npm run start:dev
   ```

4. **Running All Services**:

   ```bash
     npm run start:dev:all
   ```

5. **Running All Tests**:

   ```bash
     npm run test
   ```

6. **Running all E2E Tests**:

   ```bash
     npm run test:e2e
   ```

7. **Prettier Format**:

   ```bash
     npm run format
   ```

8. **Start the Deployment Server**:

   ```bash
     npm run build; npm run start:prod
   ```

## Configuration

You can customize the app behavior by editing the `.env` file. Remember that you must specify the required variables. Below are the key environment variables.:

| Variable Name                | Description                     | Required                                 | Example            |
| ---------------------------- | ------------------------------- | ---------------------------------------- | ------------------ |
| `DATABASE_URL`               | Database connection string      | Yes                                      | `postgres://...`   |
| `API_GATEWAY_PORT`           | Port for the API Gateway        | No                                       | `3000`             |
| `CHAT_API_PORT`              | Port for the Chat service       | No                                       | `3001`             |
| `ENROLLMENT_API_PORT`        | Port for the Enrollment service | No                                       | `3002`             |
| `SYSTEM_MANAGEMENT_API_PORT` | Port for the System Management  | No                                       | `3003`             |
| `METRICS_API_PORT`           | Port for the Metrics service    | No                                       | `3004`             |
| `AUTH_API_PORT`              | Port for the Auth service       | No                                       | `3005`             |
| `JWT_SECRET_KEY`             | Secret key for signing JWTs     | No (must be specified for auth to work)  | `your_jwt_secret`  |
| `JWT_EXPIRATION`             | JWT token expiration time       | No (must be specified for auth to work)  | `1d`, `7d`         |
| `RABBITMQ_URL`               | RabbitMQ connection string      | No (required in production environments) | `amqp://localhost` |
| `GOOGLE_CLIENT_ID`               | Google client ID      | Yes                                      | `djbetdf45t...`   |
| `GOOGLE_CLIENT_SECRET`               | Google client secret      | Yes                                      | `GOCS-wwdewr...`   |

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

---

### Additional Tips

- Ensure you have the latest version of Node.js and npm.

---

### Getting Help

For any questions or issues, feel free to open a new issue on our GitHub repository or reach out to our community forum.
