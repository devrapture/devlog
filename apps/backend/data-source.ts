import { config } from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables

config();

const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource(
  isProduction
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
        synchronize: false,
        ssl: { rejectUnauthorized: false },
      }
    : {
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432'),
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'devlog',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/src/migrations/**/*{.ts,.js}'],
        synchronize: false,
      },
);
