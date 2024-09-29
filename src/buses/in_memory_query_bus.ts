import { Query, QueryBus, QueryHandler } from '../interfaces';

export class InMemoryQueryBus implements QueryBus {
	private handlers = new Map<string, QueryHandler>();

	registerHandler(handler: QueryHandler) {
		this.handlers.set(handler.queryName, handler);
	}

	async execute(query: Query) {
		const handler = this.handlers.get(query.constructor.name);
		if (!handler) {
			throw new Error(`No handler registered for query: ${query.constructor.name}`);
		}

		return await handler.handle(query);
	}
}
