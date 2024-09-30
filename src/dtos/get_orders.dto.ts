import { z } from 'zod';

export const getOrdersDtoSchema = z.object({
	limit: z.coerce.number().int().positive(),
	offset: z.coerce.number().int().min(0),
	customerId: z.string().min(1).optional(),
});

export type GetOrdersDto = z.infer<typeof getOrdersDtoSchema>;
