import { ErrorRequestHandler } from 'express';

import { logger } from '../logger';
import { HttpError } from '../types';

export const errorHandler = (): ErrorRequestHandler => {
	return (err, _, res, next) => {
		if (res.headersSent) {
			logger.trace(err, 'Headers already sent, cannot handle the error');

			return next(err);
		}

		if (err instanceof HttpError) {
			res.status(err.statusCode).send({
				error: err.message,
				details: err.details,
			});

			return;
		}

		logger.trace(err, 'Internal server error');

		res.status(500).send({
			error: 'Internal server error',
		});
	};
};
