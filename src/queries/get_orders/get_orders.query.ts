import { Order } from '../../entities';
import { Query } from '../../interfaces';

interface Params {
	readonly limit: number;
	readonly offset: number;
	readonly customerId?: string;
}

export class GetOrdersQuery implements Query<Order[]> {
	constructor(readonly params: Params) {}

	readonly result?: Order[];
}
