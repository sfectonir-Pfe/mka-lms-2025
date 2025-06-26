import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';
import { QueryFeedbackDto } from './dto/query-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
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
  update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(+id, updateFeedbackDto);
  }

  @Post(':id/respond')
  respond(
    @Param('id') id: string,
    @Body() createResponseDto: CreateFeedbackResponseDto,
  ) {
    return this.feedbackService.createResponse(+id, createResponseDto);
  }

  @Post(':id/like')
  like(@Param('id') id: string) {
    return this.feedbackService.like(+id);
  }

  @Post(':id/dislike')
  dislike(@Param('id') id: string) {
    return this.feedbackService.dislike(+id);
  }

  @Post(':id/report')
  report(@Param('id') id: string) {
    // For now, just return the feedback
    return this.feedbackService.findOne(+id);
  }
  
  @Post(':id/delete')
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(+id);
  }
}