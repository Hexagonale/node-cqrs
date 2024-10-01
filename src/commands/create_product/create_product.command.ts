import { Product } from '../../entities';
import { Command } from '../../interfaces';

interface Params {
	readonly product: Omit<Product, '_id'>;
}

export class CreateProductCommand implements Command<string> {
	constructor(readonly params: Params) {}

	readonly result?: string;
}
