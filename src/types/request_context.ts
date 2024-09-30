import { ClientSession } from 'mongodb';

import { CommandBus, QueryBus } from '../interfaces';

export interface RequestContext {
	mongoSession: ClientSession;
	commandBus: CommandBus;
	queryBus: QueryBus;
}
