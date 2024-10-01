import { Command } from '../../interfaces';

interface Params {
	readonly customerId: string;
	readonly products: {
		[productId: string]: number;
	};
}

export class CreateOrderCommand implements Command<string> {
	constructor(readonly params: Params) {}

	readonly result?: string;
}
