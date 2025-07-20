import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { CreateGeneralFeedbackDto } from './dto/create-general-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() dto: CreateFeedbackDto) {
    return this.feedbackService.create(dto);
  }

  @Post('general')
  createGeneralFeedback(@Body() dto: CreateGeneralFeedbackDto) {
    return this.feedbackService.createGeneralFeedback(dto);
  }

  @Get()
  findAll(@Query() query: QueryFeedbackDto) {
    return this.feedbackService.findAll(query);
  }

  @Get('stats')
  getStats() {
    return this.feedbackService.getStats();
  }

  @Get('analytics')
  getAnalytics(@Query('timeRange') timeRange: string) {
    return this.feedbackService.getAnalytics(timeRange);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(+id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: UpdateFeedbackDto) {
    return this.feedbackService.update(+id, dto);
  }

  @Post(':id/respond')
  respond(@Param('id') id: string, @Body() dto: CreateFeedbackResponseDto) {
    return this.feedbackService.createResponse(+id, dto);
  }

  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.feedbackService.like(+id);
  }

  @Post(':id/dislike')
  dislike(@Param('id') id: string) {
    return this.feedbackService.dislike(+id);
  }

  @Post(':id/delete')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }

  @Post('seance')
  createSeanceFeedback(@Body() dto: any) {
    return this.feedbackService.createSeanceFeedback(dto);
  }

  @Get('seance/:seanceId')
  getSeanceFeedbacks(@Param('seanceId') seanceId: string) {
    return this.feedbackService.getSeanceFeedbacks(Number(seanceId));
  }

  @Post('session')
  createSessionFeedback(@Body() dto: any) {
    return this.feedbackService.createSessionFeedback(dto);
  }

  @Get('session/:sessionId')
  getSessionFeedbacks(@Param('sessionId') sessionId: string) {
    return this.feedbackService.getSessionFeedbacks(Number(sessionId));
  }
}