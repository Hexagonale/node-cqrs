import { RequestContext } from './request_context';

declare global {
	namespace Express {
		interface Request {
			context: RequestContext;
		}
	}
}

export default global;
