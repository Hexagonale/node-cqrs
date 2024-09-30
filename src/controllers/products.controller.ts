import { Request, Response } from 'express';

import { CreateProductCommand } from '../commands';
import { createProductDtoSchema, getProductsDtoSchema } from '../dtos';
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

	postProduct: async (req: Request, res: Response) => {
		const result = createProductDtoSchema.safeParse(req.body);
		if (!result.success) {
			throw new HttpError(400, 'Invalid request body', result.error.issues);
		}

		const productId = await req.context.commandBus.execute(
			new CreateProductCommand({
				product: result.data,
			})
		);

		res.status(201).send({
			productId,
		});
	},
};

