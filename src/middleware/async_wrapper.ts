import { RequestHandler } from 'express';

export const asyncWrapper = (handler: RequestHandler): RequestHandler => {
	return async (req, res, next) => {
		try {
			req.context.mongoSession.startTransaction();

			await handler(req, res, next);

			await req.context.mongoSession.commitTransaction();
		} catch (error) {
			await req.context.mongoSession.abortTransaction();

			next(error);
		} finally {
			await req.context.mongoSession.endSession();
		}
	};
};
