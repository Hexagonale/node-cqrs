import 'source-map-support/register';

import fs from 'node:fs';

import cors from 'cors';
import express from 'express';
import { Db, MongoClient } from 'mongodb';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

import { Config, configFactory } from './config.factory';
import { logger } from './logger';
import { contextInjector, errorHandler } from './middleware';
import { OrdersRepository, ProductsRepository } from './repositories';
import { setupRoutes } from './setup_routes';

const initRepositories = async (mongoClient: MongoClient, database: Db) => {
	const session = mongoClient.startSession();
	const productsRepository = new ProductsRepository({
		database,
		session,
	});
	const ordersRepository = new OrdersRepository({
		database,
		session,
	});

	await session.withTransaction(async () => {
		await productsRepository.init();
		await ordersRepository.init();
	});

	await session.endSession();
};

const appFactory = async (config: Config, mongoClient: MongoClient, database: Db) => {
	const app = express();
	app.use(express.json());
	app.use(
		cors({
			origin: config.allowedOrigin,
		})
	);
	app.use(
		contextInjector({
			mongoClient,
			database,
		})
	);

	setupRoutes(app);
	if (config.openApiSpecPath) {
		const openApiSpecFile = fs.readFileSync(config.openApiSpecPath, 'utf-8');
		const openApiSpec = yaml.parse(openApiSpecFile);

		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
	} else {
		logger.warn('OpenAPI spec path not provided, skipping OpenAPI documentation setup');
	}

	app.use(errorHandler());

	return app;
};

const main = async () => {
	const config = configFactory();
	logger.info('Configuration loaded');

	const mongoClient = await MongoClient.connect(config.mongoUrl);
	const database = mongoClient.db(config.mongoDb);
	logger.info(`Connected to MongoDB on "${config.mongoUrl}"`);

	await initRepositories(mongoClient, database);
	logger.info('Repositories initialized');

	const app = await appFactory(config, mongoClient, database);
	logger.info('App configured, starting server');

	app.listen(config.port, () => {
		logger.info(`Server listening on port ${config.port}`);
	});
};

main();
