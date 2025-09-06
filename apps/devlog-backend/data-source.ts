import { DataSource } from 'typeorm';
import { config } from 'dotenv';

// Load environment variables
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'devlog',
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Matches autoLoadEntities
  migrations: [__dirname + '/src/migrations/**/*.ts'], // Migration files location
  synchronize: false, // Set to false to prevent auto-schema changes
});
