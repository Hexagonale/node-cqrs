import { Request, Response } from 'express';

import { getOrdersDtoSchema } from '../dtos';
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
};

