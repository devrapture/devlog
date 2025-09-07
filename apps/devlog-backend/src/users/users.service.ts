import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async findById(userId: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);

    if (user.id !== userId)
      throw new UnauthorizedException('Not authorized to update this user');

    Object.assign(user, updateUserDto);

    const updatedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = updatedUser;

    return {
      user: safeUser,
    };
  }

  async getUserProfile(userId: string) {
    const user = await this.findById(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user;

    return {
      user: safeUser,
    };
  }
}
