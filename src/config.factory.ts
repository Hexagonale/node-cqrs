import z from 'zod';

const configSchema = z.object({
	port: z.coerce.number().min(1).max(65535),
	mongoUrl: z.string().url(),
	mongoDb: z.string(),
	allowedOrigin: z.string(),
	openApiSpecPath: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

type Intermediate = Record<keyof Config, string | undefined>;

export const configFactory = (): Config => {
	const config: Intermediate = {
		port: process.env.PORT,
		mongoUrl: process.env.MONGO_URL,
		mongoDb: process.env.MONGO_DB,
		allowedOrigin: process.env.ALLOWED_ORIGIN,
		openApiSpecPath: process.env.OPEN_API_SPEC_PATH,
	};

	return configSchema.parse(config);
};
