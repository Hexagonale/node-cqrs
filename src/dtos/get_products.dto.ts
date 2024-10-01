import { z } from 'zod';

export const getProductsDtoSchema = z.object({
	limit: z.coerce.number().int().positive(),
	offset: z.coerce.number().int().min(0),
});

export type GetProductsDto = z.infer<typeof getProductsDtoSchema>;
