import { Request, Response } from 'express';

import { CreateOrderCommand, CreateOrderNotEnoughStockError, CreateOrderProductNotFoundError } from '../commands';
import { createOrderDtoSchema, getOrdersDtoSchema } from '../dtos';
import { GetOrdersQuery } from '../queries';
import { HttpError } from '../types';

export const ordersController = {
	getOrders: async (req: Request, res: Response) => {
		const result = getOrdersDtoSchema.safeParse(req.query);
		if (!result.success) {
			throw new HttpError(400, 'Invalid query parameters', result.error.issues);
		}

		const { limit, offset, customerId } = result.data;
		const orders = await req.context.queryBus.execute(
			new GetOrdersQuery({
				limit,
				offset,
				customerId,
			})
		);

		res.send({
			orders,
		});
	},

	postOrders: async (req: Request, res: Response) => {
		const result = createOrderDtoSchema.safeParse(req.body);
		if (!result.success) {
			throw new HttpError(400, 'Invalid request body', result.error.issues);
		}

		const { customerId, products } = result.data;
		const orderId = await req.context.commandBus
			.execute(
				new CreateOrderCommand({
					customerId,
					products,
				})
			)
			.catch((error) => {
				if (error instanceof CreateOrderProductNotFoundError) {
					throw new HttpError(400, 'Product not found', {
						productId: error.productId,
					});
				}

				if (error instanceof CreateOrderNotEnoughStockError) {
					throw new HttpError(400, 'Not enough stock', {
						productId: error.productId,
						wanted: error.wanted,
						available: error.available,
					});
				}

				throw error;
			});

		res.status(201).send({
			orderId,
		});
	},
};
