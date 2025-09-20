import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Environment } from '../../env.validation';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === Environment.Production;

  const baseConfig = {
    type: 'postgres' as const,
    autoLoadEntities: true,
    synchronize: false,
    migrationsTableName: 'migrations',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/**/*.ts'],
  };

  if (isProduction) {
    return {
      ...baseConfig,
      url: configService.get('DATABASE_URL'),
      ssl: { rejectUnauthorized: false }, // Common for cloud providers
    };
  }

  return {
    ...baseConfig,
    host: configService.get<string>('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get<string>('DATABASE_USERNAME'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
  };
};
