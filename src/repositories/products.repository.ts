import { ClientSession, Db } from 'mongodb';

import { Product } from '../entities';
import { Repository } from '../interfaces';

interface Dependencies {
	database: Db;
	session: ClientSession;
}

export class ProductsRepository implements Repository {
	constructor(private readonly dependencies: Dependencies) {}

	private readonly collection = this.dependencies.database.collection<Product>('products');

	async init() {}

	getProducts({ limit, offset }: { limit: number; offset: number }): Promise<Product[]> {
		return this.collection.find({}, { session: this.dependencies.session }).skip(offset).limit(limit).toArray();
	}

	getProductById(productId: string): Promise<Product | null> {
		return this.collection.findOne({ _id: productId }, { session: this.dependencies.session });
	}

	async createProduct(product: Product): Promise<string> {
		const result = await this.collection.insertOne(product, {
			session: this.dependencies.session,
		});

		return result.insertedId;
	}

	async modifyProduct(productId: string, product: Partial<Omit<Product, '_id'>>): Promise<void> {
		await this.collection.updateOne({ _id: productId }, { $set: product }, { session: this.dependencies.session });
	}
}
