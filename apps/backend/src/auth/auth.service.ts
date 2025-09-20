import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon from 'argon2';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findOne(createUserDto.email);

    if (existingUser) throw new ConflictException('Email is already in use');

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const _user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const user = await this.userRepository.save(_user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;
    return {
      user: safeUser,
    };
  }

  async loginUser(loginDto: CreateUserDto) {
    const user = await this.userService.findOne(loginDto.email);

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const passwordMatches = await this.verifyPassword(
      user.password,
      loginDto.password,
    );

    if (!passwordMatches)
      throw new UnauthorizedException('Invalid Credentials');

    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    const tokens = this.generateToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      user: safeUser,
      ...tokens,
    };
  }

  private generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      displayName: user.displayName,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private generateToken(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  private async verifyPassword(
    hashedPassword: string,
    password: string,
  ): Promise<boolean> {
    return await argon.verify(hashedPassword, password);
  }
}
