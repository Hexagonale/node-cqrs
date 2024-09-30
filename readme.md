# CQRS NodeJS App

This is a simple NodeJS app that demonstrates the CQRS pattern. It allows you to manage a simple warehouse inventory.

## Technologies

App is written in typescript and uses NodeJS as the runtime.
The database used is MongoDB.
The app is containerized using Docker.

## Requirements for running the app locally

- NodeJS
- NPM
- Docker
- .env file with configuration

## Configuration

App uses the environment variables for the configuration.

> [!INFO]
> You can use the `.env.example` file as a template for the `.env` file.

| Variable Name      | Description                    | Type                | Default Value |
| ------------------ | ------------------------------ | ------------------- | ------------- |
| PORT               | Port on which the app will run | Integer [1 - 65535] | 80            |
| MONGO_URL          | MongoDB connection string      | String (valid URL)  |               |
| MONGO_DB           | MongoDB database name          | String              |               |
| ALLOWED_ORIGIN     | Allowed origin for CORS        | String              |               |
| OPEN_API_SPEC_PATH | Path to the OpenAPI spec file  | String (optional)   |               |

## Running app locally

1. Start the docker containers

```bash
docker-compose up
```

### Local development Setup

1. Install dependencies

```bash
npm install
```

2. Start the compilation in the watch mode

```bash
npm run build:watch
```

3. Start the docker in the watch mode

```bash
docker compose watch
```

## API Definition

API definition can be found at [http://localhost:8080/api-docs](http://localhost:8080/api-docs)
