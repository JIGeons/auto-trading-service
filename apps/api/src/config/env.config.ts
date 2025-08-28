export default () => ({ 
	PORT: parseInt(process.env.PORT ?? '3100', 10),
	DB: {
		host: process.env.DB_HOST ?? '127.0.0.1',
		port: parseInt(process.env.DB_PORT ?? '5432', 10),
		user: process.env.DB_USER ?? 'postgres',
		pass: process.env.DB_PASS ?? 'postgres',
		name: process.env.DB_NAME ?? 'auto-trading',
		ssl: process.env.DB_SSL === 'true',
	},
	engineBase: process.env.ENGINE_BASE_URL ?? 'http://localhost:8080',
});