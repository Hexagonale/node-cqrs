import { CommandHandler } from '../../interfaces';
import { ProductsRepository } from '../../repositories';
import { RestockProductCommand } from './restock_product.command';

export class RestockProductProductNotFoundError extends Error {
	constructor() {
		super('Product not found');
	}
}

interface Dependencies {
	readonly productsRepository: ProductsRepository;
}

export class RestockProductCommandHandler implements CommandHandler<RestockProductCommand> {
	constructor(private readonly dependencies: Dependencies) {}

	readonly commandName = RestockProductCommand.name;

	async handle(command: RestockProductCommand) {
		const product = await this.dependencies.productsRepository.getProductById(command.params.productId);
		if (!product) {
			throw new RestockProductProductNotFoundError();
		}

		const newStock = product.stock + command.params.quantity;
		await this.dependencies.productsRepository.modifyProduct(command.params.productId, {
			stock: newStock,
		});

		return newStock;
	}
}
