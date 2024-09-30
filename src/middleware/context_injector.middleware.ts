import { RequestHandler } from 'express';
import { Db, MongoClient } from 'mongodb';

import { InMemoryCommandBus, InMemoryQueryBus } from '../buses';
import {
	CreateOrderCommandHandler,
	CreateProductCommandHandler,
	RestockProductCommandHandler,
	SellProductCommandHandler,
} from '../commands';
import { GetOrdersQueryHandler, GetProductsQueryHandler } from '../queries';
import { OrdersRepository, ProductsRepository } from '../repositories';
import { RequestContext } from '../types';

interface Dependencies {
	mongoClient: MongoClient;
	database: Db;
}

const contextFactory = async ({ mongoClient, database }: Dependencies): Promise<RequestContext> => {
	const session = mongoClient.startSession();

	const productsRepository = new ProductsRepository({
		database,
		session,
	});
	const ordersRepository = new OrdersRepository({
		database,
		session,
	});

	const commandBus = new InMemoryCommandBus();
	commandBus.registerHandler(
		new CreateProductCommandHandler({
			productsRepository,
		})
	);
	commandBus.registerHandler(
		new RestockProductCommandHandler({
			productsRepository,
		})
	);
	commandBus.registerHandler(
		new SellProductCommandHandler({
			productsRepository,
		})
	);
	commandBus.registerHandler(
		new CreateOrderCommandHandler({
			ordersRepository,
			productsRepository,
		})
	);

	const queryBus = new InMemoryQueryBus();
	queryBus.registerHandler(
		new GetProductsQueryHandler({
			productsRepository,
		})
	);
	queryBus.registerHandler(
		new GetOrdersQueryHandler({
			ordersRepository,
		})
	);

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
