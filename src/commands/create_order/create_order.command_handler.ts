import { UUID } from 'mongodb';

import { CommandHandler } from '../../interfaces';
import { OrdersRepository, ProductsRepository } from '../../repositories';
import { CreateOrderCommand } from './create_order.command';

export class CreateOrderProductNotFoundError extends Error {
	constructor(readonly productId: string) {
		super(`Product ${productId} not found`);
	}
}

export class CreateOrderNotEnoughStockError extends Error {
	constructor(
		readonly productId: string,
		readonly wanted: number,
		readonly available: number
	) {
		super(`Not enough stock for product ${productId} (wanted ${wanted}, available ${available})`);
	}
}

interface Dependencies {
	readonly ordersRepository: OrdersRepository;
	readonly productsRepository: ProductsRepository;
}

export class CreateOrderCommandHandler implements CommandHandler<CreateOrderCommand> {
	constructor(private readonly dependencies: Dependencies) {}

	readonly commandName = CreateOrderCommand.name;

	async handle(command: CreateOrderCommand) {
		for (const [productId, quantity] of Object.entries(command.params.products)) {
			const product = await this.dependencies.productsRepository.getProductById(productId);
			if (!product) {
				throw new CreateOrderProductNotFoundError(productId);
			}

			if (product.stock < quantity) {
				throw new CreateOrderNotEnoughStockError(productId, quantity, product.stock);
			}

			await this.dependencies.productsRepository.modifyProduct(productId, {
				stock: product.stock - quantity,
			});
		}

		const orderId = await this.dependencies.ordersRepository.createOrder({
			...command.params,
			_id: new UUID().toHexString(),
		});

		return orderId;
	}
}
