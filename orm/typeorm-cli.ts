import { AppDataSource } from './datasource';

AppDataSource.initialize().then(async () => {
	console.log('TypeORM CLI ready');
}).catch(console.error);