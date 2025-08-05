import { Test, TestingModule } from '@nestjs/testing';
import { SessionFeedbackController } from './session-feedback.controller';
import { SessionFeedbackService } from './session-feedback.service';

describe('SessionFeedbackController', () => {
  let controller: SessionFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionFeedbackController],
      providers: [SessionFeedbackService],
    }).compile();

    controller = module.get<SessionFeedbackController>(SessionFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
