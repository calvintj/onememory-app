import { ApiProperty } from '@nestjs/swagger';
import { MemoryTag } from '@prisma/client';

export class CreateMemoryDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  content: string;

  @ApiProperty({ enum: MemoryTag, default: MemoryTag.HAPPY })
  tag: MemoryTag;
}
