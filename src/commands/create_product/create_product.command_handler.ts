import { UUID } from 'mongodb';

import { CommandHandler } from '../../interfaces';
import { ProductsRepository } from '../../repositories';
import { CreateProductCommand } from './create_product.command';

interface Dependencies {
	readonly productsRepository: ProductsRepository;
}

export class CreateProductCommandHandler implements CommandHandler<CreateProductCommand> {
	constructor(private readonly dependencies: Dependencies) {}

	readonly commandName = CreateProductCommand.name;

	async handle(command: CreateProductCommand) {
		const productId = await this.dependencies.productsRepository.createProduct({
			...command.params.product,
			_id: new UUID().toHexString(),
		});

		return productId;
	}
}
