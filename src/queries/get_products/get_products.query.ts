import { Product } from '../../entities';
import { Query } from '../../interfaces';

interface Params {
	readonly limit: number;
	readonly offset: number;
}

export class GetProductsQuery implements Query<Product[]> {
	constructor(readonly params: Params) {}

	readonly result?: Product[];
}
