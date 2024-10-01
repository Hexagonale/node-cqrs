import { z } from 'zod';

export const createProductDtoSchema = z.object({
	name: z.string().min(1).max(50),
	description: z.string().min(1).max(50),
	price: z.number().int().positive(),
	stock: z.number().int().positive(),
});

export type CreateProductDto = z.infer<typeof createProductDtoSchema>;
