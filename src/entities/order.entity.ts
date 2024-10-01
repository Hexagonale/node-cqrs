export interface Order {
	_id: string;
	customerId: string;
	products: {
		[productId: string]: number;
	};
}
