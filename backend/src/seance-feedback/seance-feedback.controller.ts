import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { SeanceFeedbackService } from './seance-feedback.service';

@Controller('feedback/seance')
export class SeanceFeedbackController {
  constructor(private readonly seanceFeedbackService: SeanceFeedbackService) {}

  @Post()
  async createSeanceFeedback(@Body() dto: any) {
    return this.seanceFeedbackService.createSeanceFeedback(dto);
  }

  @Get('feedbacklist/:seanceId')
  async getFeedbackList(@Param('seanceId') seanceId: string) {
    if (!seanceId) {
      throw new BadRequestException('seanceId is required');
    }
    return this.seanceFeedbackService.getFeedbackList(+seanceId);
  }

  @Get(':seanceId')
  async getFeedbacksBySeance(@Param('seanceId') seanceId: string) {
    if (!seanceId) {
      throw new BadRequestException('seanceId is required');
    }
    return this.seanceFeedbackService.getFeedbackList(+seanceId);
  }

  @Get('details/:seanceId/:userId')
  async getFeedbackDetails(
    @Param('seanceId') seanceId: string,
    @Param('userId') userId: string,
  ) {
    if (!seanceId || !userId) {
      throw new BadRequestException('seanceId and userId are required');
    }
    return this.seanceFeedbackService.getFeedbackDetails(+seanceId, +userId);
  }

  @Delete('cleanup-old/:seanceId')
  async cleanupOldFeedbackList(@Param('seanceId') seanceId: string) {
    if (!seanceId) {
      throw new BadRequestException('seanceId is required');
    }
    return this.seanceFeedbackService.cleanupOldFeedbacks(+seanceId);
  }

  @Delete('cleanup/:seanceId')
  async cleanupFeedbackList(
    @Param('seanceId') seanceId: string,
    @Body('emailsToKeep') emailsToKeep: string[],
  ) {
    if (!seanceId) {
      throw new BadRequestException('seanceId is required');
    }
    if (!Array.isArray(emailsToKeep)) {
      throw new BadRequestException('emailsToKeep must be an array of strings');
    }
    return this.seanceFeedbackService.deleteFeedbackListNotInEmails(+seanceId, emailsToKeep);
  }
}
