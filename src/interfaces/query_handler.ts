import { Query } from './query';

export interface QueryHandler<Q extends Query = Query<any>> {
	readonly queryName: string;

	handle(query: Q): Promise<Q['result']>;
}
