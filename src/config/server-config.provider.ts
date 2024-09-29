import z from 'zod';

const serverConfigSchema = z.object({
	port: z.coerce.number().min(1).max(65535),
	mongoUrl: z.string().url(),
});

export type ServerConfig = z.infer<typeof serverConfigSchema>;

type Intermediate = Record<keyof ServerConfig, string | undefined>;

export const serverConfigFactory = (): ServerConfig => {
	const config: Intermediate = {
		port: process.env.PORT,
		mongoUrl: process.env.MONGO_URL,
	};

	return serverConfigSchema.parse(config);
};
