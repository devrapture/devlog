import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') as string,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    try {
      const user = await this.userService.findById(payload.sub);
      return {
        id: user?.id,
        displayName: user?.displayName,
        email: user?.email,
        role: user?.role,
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
