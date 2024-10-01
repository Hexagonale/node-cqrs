import { z } from 'zod';

export const sellProductDtoSchema = z.object({
	quantity: z.number().int().positive(),
});

export type SellProductDto = z.infer<typeof sellProductDtoSchema>;
