import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/users/entities/user.entity';

export class AuthorDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    example: UserRole.USER,
    description: 'Role of the author',
  })
  role: UserRole;

  @ApiProperty()
  email: string;

  @ApiProperty()
  displayName: string;
}
