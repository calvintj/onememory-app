import { ApiProperty } from '@nestjs/swagger';
import { MemoryTag } from '@prisma/client';

export class Memory {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: MemoryTag })
  tag: MemoryTag;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
