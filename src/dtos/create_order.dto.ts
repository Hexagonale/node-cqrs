import { z } from 'zod';

export const createOrderDtoSchema = z.object({
	customerId: z.string().min(1),
	products: z.record(z.number().int().positive()),
});

export type CreateOrderDto = z.infer<typeof createOrderDtoSchema>;
