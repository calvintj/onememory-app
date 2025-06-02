import { Module } from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { MemoriesController } from './memories.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MemoriesController],
  providers: [MemoriesService],
  imports: [PrismaModule],
})
export class MemoriesModule {}
