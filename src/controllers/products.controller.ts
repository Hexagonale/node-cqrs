import { Request, Response } from 'express';

import {
	CreateProductCommand,
	RestockProductCommand,
	RestockProductProductNotFoundError,
	SellProductCommand,
	SellProductNotEnoughStockError,
	SellProductProductNotFoundError,
} from '../commands';
import { createProductDtoSchema, getProductsDtoSchema, restockProductDtoSchema, sellProductDtoSchema } from '../dtos';
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

	postProductRestock: async (req: Request, res: Response) => {
		const { productId } = req.params;
		if (!productId) {
			throw new Error('Missing productId');
		}

		const result = restockProductDtoSchema.safeParse(req.body);
		if (!result.success) {
			throw new HttpError(400, 'Invalid request body', result.error.issues);
		}

		const { quantity } = result.data;
		const newStock = await req.context.commandBus
			.execute(
				new RestockProductCommand({
					productId,
					quantity,
				})
			)
			.catch((error) => {
				if (error instanceof RestockProductProductNotFoundError) {
					throw new HttpError(404, 'Product not found');
				}

				throw error;
			});

		res.json({
			newStock,
		});
	},

	postProductSell: async (req: Request, res: Response) => {
		const { productId } = req.params;
		if (!productId) {
			throw new Error('Missing productId');
		}

		const result = sellProductDtoSchema.safeParse(req.body);
		if (!result.success) {
			throw new HttpError(400, 'Invalid request body', result.error.issues);
		}

		const { quantity } = result.data;
		const newStock = await req.context.commandBus
			.execute(
				new SellProductCommand({
					productId,
					quantity,
				})
			)
			.catch((error) => {
				if (error instanceof SellProductProductNotFoundError) {
					throw new HttpError(404, 'Product not found');
				}

				if (error instanceof SellProductNotEnoughStockError) {
					throw new HttpError(400, 'Not enough stock');
				}

				throw error;
			});

		res.json({
			newStock,
		});
	},
};
