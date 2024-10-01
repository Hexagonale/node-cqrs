import { Query } from './query';

export interface QueryBus {
	execute<Q extends Query>(query: Q): Promise<Q['result']>;
}
