import { Request, Response } from 'express';

import { getProductsDtoSchema } from '../dtos';
import { GetProductsQuery } from '../queries';
import { HttpError } from '../types';

export const productsController = {
	getProducts: async (req: Request, res: Response) => {
		const result = getProductsDtoSchema.safeParse(req.query);
		if (!result.success) {
			throw new HttpError(400, 'Invalid request query parameters', result.error.issues);
		}

		const { limit, offset } = result.data;
		const products = await req.context.queryBus.execute(
			new GetProductsQuery({
				limit,
				offset,
			})
		);

		res.json({
			products,
		});
	},
};
