import { ClientSession, Db } from 'mongodb';

import { Order } from '../entities';
import { Repository } from '../interfaces';

interface Dependencies {
	database: Db;
	session: ClientSession;
}

export class OrdersRepository implements Repository {
	constructor(private readonly dependencies: Dependencies) {}

	private readonly collection = this.dependencies.database.collection<Order>('orders');

	async init() {
		await this.dependencies.database
			.collection<Order>('orders')
			.createIndex({ customerId: 1 }, { session: this.dependencies.session });
	}

	getOrders({ limit, offset, customerId }: { limit: number; offset: number; customerId?: string }): Promise<Order[]> {
		const query: Record<string, string> = {};
		if (customerId) {
			query.customerId = customerId;
		}

		return this.collection.find(query, { session: this.dependencies.session }).skip(offset).limit(limit).toArray();
	}

	getOrderById(orderId: string): Promise<Order | null> {
		return this.collection.findOne({ _id: orderId }, { session: this.dependencies.session });
	}

	async createOrder(order: Order): Promise<string> {
		const result = await this.collection.insertOne(order, { session: this.dependencies.session });

		return result.insertedId;
	}
}
