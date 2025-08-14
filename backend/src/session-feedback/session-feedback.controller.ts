import {
  Controller,
  Get,
  Param,
  BadRequestException,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SessionFeedbackService } from './session-feedback.service';
import { CreateSessionFeedbackDto } from './dto/create-session-feedback.dto';

@Controller('feedback/session')
export class SessionFeedbackController {
  constructor(private readonly sessionFeedbackService: SessionFeedbackService) {}

  @Get('feedbacklist/:sessionId')
  async getSessionFeedbackList(@Param('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }
    return this.sessionFeedbackService.getSessionFeedbacks(+sessionId);
  }

  @Get('list/:sessionId')
  async getSessionFeedbackListV2(@Param('sessionId') sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException('sessionId is required');
    }
    return this.sessionFeedbackService.getSessionFeedbackList(+sessionId);
  }

  @Get(':sessionId/student/:userId')
  async getStudentFeedbacks(
    @Param('sessionId') sessionId: string,
    @Param('userId') userId: string,
  ) {
    if (!sessionId || !userId) {
      throw new BadRequestException('sessionId and userId are required');
    }
    return this.sessionFeedbackService.getStudentFeedbacks(+sessionId, +userId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createSessionFeedback(@Body() createSessionFeedbackDto: CreateSessionFeedbackDto) {
    return this.sessionFeedbackService.create(createSessionFeedbackDto);
  }
}
