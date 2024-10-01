import { Command } from '../../interfaces';

interface Params {
	readonly productId: string;
	readonly quantity: number;
}

export class SellProductCommand implements Command<number> {
	constructor(readonly params: Params) {}

	readonly result?: number;
}
