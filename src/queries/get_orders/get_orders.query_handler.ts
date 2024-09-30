import { Order } from '../../entities';
import { QueryHandler } from '../../interfaces';
import { OrdersRepository } from '../../repositories';
import { GetOrdersQuery } from './get_orders.query';

interface Dependencies {
	ordersRepository: OrdersRepository;
}

export class GetOrdersQueryHandler implements QueryHandler<GetOrdersQuery> {
	constructor(private readonly dependencies: Dependencies) {}

	readonly queryName = GetOrdersQuery.name;

	async handle(query: GetOrdersQuery): Promise<Order[]> {
		return await this.dependencies.ordersRepository.getOrders({
			limit: query.params.limit,
			offset: query.params.offset,
			customerId: query.params.customerId,
		});
	}
}
