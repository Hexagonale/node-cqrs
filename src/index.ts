import 'source-map-support/register';
import cors from 'cors';
import express from 'express';
import { configFactory } from './config.factory';
import { MongoClient } from 'mongodb';
import { logger } from './logger';

const main = async () => {
	const config = configFactory();

	const mongoClient = await MongoClient.connect(config.mongoUrl);
	logger.info(`Connected to MongoDB on "${config.mongoUrl}"`);

	const app = express();
	app.use(express.json());
	app.use(cors());

	app.listen(config.port, () => {
		logger.info(`Server listening on port ${config.port}`);
	});
};

main();
