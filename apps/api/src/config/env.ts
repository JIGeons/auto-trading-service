export const env = { 
	PORT: +(process.env.PORT || 3100),
	DB: {
		host: process.env.DB_HOST || '127.0.0.1',
		port: +(process.env.DB_PORT || 5432),
		user: process.env.DB_USER || 'postgres',
		pass: process.env.DB_PASS || 'postgres',
		name: process.env.DB_NAME || 'quant',
		ssl: (process.env.DB_SSL || 'false') === 'true',
	},
};