// src/feedback-session-seance/feedback-session-seance.controller.ts

import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { FeedbackSessionSeanceService } from './feedback-session-seance.service';

@Controller('feedback')
export class FeedbackSessionSeanceController {
  constructor(private readonly feedbackSessionSeanceService: FeedbackSessionSeanceService) {}

  @Post('seance')
  createSeanceFeedback(@Body() body: any) {
    return this.feedbackSessionSeanceService.createSeanceFeedback(body);
  }

  @Get('seance/:seanceId')
  getSeanceFeedbacks(@Param('seanceId') seanceId: string) {
    return this.feedbackSessionSeanceService.getSeanceFeedbacks(Number(seanceId));
  }
}
