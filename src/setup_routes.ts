import { Express } from 'express';

import { ordersController, productsController } from './controllers';
import { asyncWrapper } from './middleware';

export const setupRoutes = (app: Express) => {
	app.get('/v1/products', asyncWrapper(productsController.getProducts));
	app.post('/v1/products', asyncWrapper(productsController.postProduct));
	app.post('/v1/products/:productId/restock', asyncWrapper(productsController.postProductRestock));
	app.post('/v1/products/:productId/sell', asyncWrapper(productsController.postProductSell));

	app.get('/v1/orders', asyncWrapper(ordersController.getOrders));
};
