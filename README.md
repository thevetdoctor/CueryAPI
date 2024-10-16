# Cuery API

Cuery is an API for customer address verification. This project is built with Node.js, Express, Sequelize ORM, and Swagger for API documentation.

## Features

- **Node.js** with **Express** for handling API routes
- **Sequelize** ORM for database management
- **Swagger** for API documentation
- Logging using **Winston**
- Prettier for code formatting
- Hot-reloading with **Nodemon**

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (or another database supported by Sequelize)

## Project Setup

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/cuery-api.git
cd cuery-api

npm install

If you're in development mode and want hot-reloading, run:

npm run dev

Otherwise, to run the production build, use:

npm start


Once the server is running, you can access the API at:

http://localhost:3000/


To view the Swagger API documentation, navigate to:

http://localhost:3000/api-docs


All logs are saved in the logs directory:

Errors are logged in logs/error.log
Combined logs (info and errors) are logged in logs/combined.log
```
