import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { RéclamationService } from './réclamation.service';
import { CreateRéclamationDto } from './dto/create-réclamation.dto';
import { UpdateRéclamationDto } from './dto/update-réclamation.dto';

@Controller('reclamation')
export class RéclamationController {
  constructor(private readonly réclamationService: RéclamationService) {}

  @Post()
  async create(@Body() createRéclamationDto: CreateRéclamationDto) {
    try {
      return await this.réclamationService.create(createRéclamationDto);
    } catch (error) {
      throw new HttpException('Failed to create réclamation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list')
  async findAll() {
    try {
      return await this.réclamationService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch réclamations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    try {
      return await this.réclamationService.findByUserId(+userId);
    } catch (error) {
      throw new HttpException('Failed to fetch user réclamations', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('status/:status')
  async findByStatus(@Param('status') status: string) {
    try {
      return await this.réclamationService.findByStatus(status);
    } catch (error) {
      throw new HttpException('Failed to fetch réclamations by status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.réclamationService.findOne(+id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException('Failed to fetch réclamation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRéclamationDto: UpdateRéclamationDto) {
    try {
      return await this.réclamationService.update(+id, updateRéclamationDto);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException('Failed to update réclamation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.réclamationService.remove(+id);
    } catch (error) {
      if (error.status === 404) {
        throw error;
      }
      throw new HttpException('Failed to delete réclamation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
