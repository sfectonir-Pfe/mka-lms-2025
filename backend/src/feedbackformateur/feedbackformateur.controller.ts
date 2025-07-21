import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { FeedbackFormateurService } from './feedbackformateur.service';
import { CreateFeedbackFormateurDto } from './dto/create-feedbackformateur.dto';

@Controller('feedback-formateur')
export class FeedbackFormateurController {
  constructor(private readonly service: FeedbackFormateurService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateFeedbackFormateurDto) {
    return this.service.create(dto);
  }

  @Get()
  async findAll(@Query('formateurId') formateurId?: string) {
    if (formateurId) {
      return this.service.findAllByFormateur(Number(formateurId));
    }
    return this.service.findAll();
  }

  @Get('seance/:seanceId')
  async findAllBySeance(@Param('seanceId') seanceId: string) {
    return this.service.findAllBySeance(Number(seanceId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
