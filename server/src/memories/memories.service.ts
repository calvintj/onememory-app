import { Injectable } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemoryTag } from '@prisma/client';

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {}

  create(createMemoryDto: CreateMemoryDto) {
    return this.prisma.memoryEntry.create({
      data: createMemoryDto,
    });
  }

  findAll() {
    return this.prisma.memoryEntry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.memoryEntry.findUnique({
      where: { id },
    });
  }

  findByUser(userId: string) {
    return this.prisma.memoryEntry.findMany({
      where: { userId },
    });
  }

  findByDate(date: Date) {
    return this.prisma.memoryEntry.findMany({
      where: { date },
    });
  }

  findByTag(tag: MemoryTag) {
    return this.prisma.memoryEntry.findMany({
      where: { tag },
    });
  }

  update(id: string, updateMemoryDto: UpdateMemoryDto) {
    return this.prisma.memoryEntry.update({
      where: { id },
      data: updateMemoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.memoryEntry.delete({
      where: { id },
    });
  }
}
