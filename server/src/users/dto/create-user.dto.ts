import { ApiProperty } from '@nestjs/swagger';
import { UserProvider, UserRole } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password?: string | null;

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ enum: UserProvider, default: UserProvider.CREDENTIALS })
  provider: UserProvider;
}
