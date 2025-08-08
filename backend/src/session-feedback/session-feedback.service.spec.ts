import { Test, TestingModule } from '@nestjs/testing';
import { SessionFeedbackService } from './session-feedback.service';

describe('SessionFeedbackService', () => {
  let service: SessionFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionFeedbackService],
    }).compile();

    service = module.get<SessionFeedbackService>(SessionFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
