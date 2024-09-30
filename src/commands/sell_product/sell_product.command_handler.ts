import { CommandHandler } from '../../interfaces';
import { ProductsRepository } from '../../repositories';
import { SellProductCommand } from './sell_product.command';

export class SellProductProductNotFoundError extends Error {
	constructor() {
		super('Product not found');
	}
}

export class SellProductNotEnoughStockError extends Error {
	constructor(
		readonly wanted: number,
		readonly available: number
	) {
		super(`Not enough stock (wanted ${wanted}, available ${available})`);
	}
}

interface Dependencies {
	readonly productsRepository: ProductsRepository;
}

export class SellProductCommandHandler implements CommandHandler<SellProductCommand> {
	constructor(private readonly dependencies: Dependencies) {}

	readonly commandName = SellProductCommand.name;

	async handle(command: SellProductCommand) {
		const product = await this.dependencies.productsRepository.getProductById(command.params.productId);
		if (!product) {
			throw new SellProductProductNotFoundError();
		}

		if (product.stock < command.params.quantity) {
			throw new SellProductNotEnoughStockError(product.stock, command.params.quantity);
		}

		const newStock = product.stock - command.params.quantity;
		await this.dependencies.productsRepository.modifyProduct(command.params.productId, {
			stock: product.stock - command.params.quantity,
		});

		return newStock;
	}
}
