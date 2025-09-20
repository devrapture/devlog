import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsString,
  ValidateIf,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.NODE_ENV !== Environment.Production)
  @IsString()
  DATABASE_HOST: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.NODE_ENV !== Environment.Production)
  @IsInt()
  DATABASE_PORT: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.NODE_ENV !== Environment.Production)
  @IsString()
  DATABASE_USERNAME: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.NODE_ENV !== Environment.Production)
  @IsString()
  DATABASE_PASSWORD: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.NODE_ENV !== Environment.Production)
  @IsString()
  DATABASE_NAME: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  @ValidateIf((o) => o.NODE_ENV === Environment.Production)
  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  CLOUDINARY_CLOUD_NAME: string;
  @IsString()
  CLOUDINARY_API_KEY: string;
  @IsString()
  CLOUDINARY_API_SECRET: string;

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString()
  HEALTH_CHECK_DOCS_URL: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
