import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MemoriesService } from './memories.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { MemoryTag } from '@prisma/client';

@Controller('memories')
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Post()
  create(@Body() createMemoryDto: CreateMemoryDto) {
    return this.memoriesService.create(createMemoryDto);
  }

  @Get()
  findAll() {
    return this.memoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memoriesService.findOne(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.memoriesService.findByUser(userId);
  }

  @Get('date/:date')
  findByDate(@Param('date') date: string) {
    return this.memoriesService.findByDate(new Date(date));
  }

  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.memoriesService.findByTag(tag as MemoryTag);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemoryDto: UpdateMemoryDto) {
    return this.memoriesService.update(id, updateMemoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memoriesService.remove(id);
  }
}
