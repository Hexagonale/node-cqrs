import { MongoClient } from 'mongodb';
import { RequestHandler } from 'express';
import { RequestContext } from '../types';
import { InMemoryCommandBus, InMemoryQueryBus } from '../buses';
import { Config } from '../config.factory';

interface Dependencies {
	config: Config;
	mongoClient: MongoClient;
}

const contextFactory = async ({ config, mongoClient }: Dependencies): Promise<RequestContext> => {
	const database = mongoClient.db(config.mongoDb);
	const session = mongoClient.startSession();

	const commandBus = new InMemoryCommandBus();
	const queryBus = new InMemoryQueryBus();

	return {
		mongoSession: session,
		commandBus,
		queryBus,
	};
};

export const contextInjector = (dependencies: Dependencies): RequestHandler => {
	return async (req, _, next) => {
		req.context = await contextFactory(dependencies);

		next();
	};
};
