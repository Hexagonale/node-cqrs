import { Product } from '../../entities';
import { QueryHandler } from '../../interfaces';
import { ProductsRepository } from '../../repositories';
import { GetProductsQuery } from './get_products.query';

interface Dependencies {
	productsRepository: ProductsRepository;
}

export class GetProductsQueryHandler implements QueryHandler<GetProductsQuery> {
	constructor(private readonly dependencies: Dependencies) {}

	readonly queryName = GetProductsQuery.name;

	async handle(query: GetProductsQuery): Promise<Product[]> {
		return await this.dependencies.productsRepository.getProducts({
			limit: query.params.limit,
			offset: query.params.offset,
		});
	}
}
