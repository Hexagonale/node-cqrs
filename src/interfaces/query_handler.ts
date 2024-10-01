import { Query } from './query';

export interface QueryHandler<Q extends Query = Query> {
	readonly queryName: string;

	handle(query: Q): Promise<Q['result']>;
}
