import { z } from 'zod';

export const restockProductDtoSchema = z.object({
	quantity: z.number().int().positive(),
});

export type RestockProductDto = z.infer<typeof restockProductDtoSchema>;
