# Popcorn Palace Instructions

## Prerequisites

- **PostgreSQL** - The backend uses PosgreSQL as its database. Ensure you have a running PostgreSQL instance.
- **Node.js** - The project uses Node.js for it's platform. Make sure that Node.js is installed (as well as npm).

## Installation
Clone the repository and install the dependencies
```sh
git clone https://github.com/NubPaws/Popcorn-Palace.git
cd Popcorn-Palace
npm install
```

To avoid configuration, this project provides a `compose.yml` file can use to host your own PostgreSQL server using the default settings by just running the command:
```sh
docker-compose up --build
```

## Configuration
The project uses default settings for connecting to PostgreSQL:
- Database Name: `popcorn-palace`
- Username: `popcorn-palace`
- Password: `popcorn-palace`
- Host: `localhost`
- Port: `5432`

If you want to use different settings, create or modify the `.env` file in the project root with your custom environment variables. For example:
```py
# Database configurations
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=popcorn-palace
DATABASE_PASSWORD=popcorn-palace
DATABASE_NAME=popcorn-palace

# Application configuration
PORT=3000
```
When the project starts, it will use these values instead of the defaults.

## Build and Run
To compile the project, run:
```sh
npm run build
```
To run the project in production mode use:
```sh
npm run start:prod
```
By default, the server will run on http://localhost:3000 (unless you override the port in your .env file).

## Testing
There are two levels of tests provided:
1. **Unit Tests (Repository, Service, and Controller Tests)**:

   Run these tests with:
   ```sh
   npm run test
   ```
2. **End-to-End (e2e) Tests:**

   Run module-based e2e tests with:
   ```sh
   npm run test:e2e
   ```
