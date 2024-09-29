import 'source-map-support/register';
import cors from 'cors';
import express from 'express';
import { configFactory } from './config.factory';
import pino from 'pino';
import { MongoClient } from 'mongodb';

const main = async () => {
	const logger = pino(
		pino.transport({
			level: 'debug',
			target: 'pino-pretty',
			options: { colorize: true },
		})
	);

	const config = configFactory();

	const mongo = await MongoClient.connect(config.mongoUrl);

	logger.info(`Connected to MongoDB on "${config.mongoUrl}"`);

	const app = express();
	app.use(express.json());
	app.use(cors());

	app.listen(config.port, () => {
		logger.info(`Server listening on port ${config.port}`);
	});
};

main();
