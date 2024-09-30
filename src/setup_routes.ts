import { Express } from 'express';

import { productsController } from './controllers';
import { asyncWrapper } from './middleware';

export const setupRoutes = (app: Express) => {
	app.get('/v1/products', asyncWrapper(productsController.getProducts));
};
