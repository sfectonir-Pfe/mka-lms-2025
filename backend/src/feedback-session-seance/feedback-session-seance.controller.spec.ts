import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackSessionSeanceController } from './feedback-session-seance.controller';
import { FeedbackSessionSeanceService } from './feedback-session-seance.service';

describe('FeedbackSessionSeanceController', () => {
  let controller: FeedbackSessionSeanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackSessionSeanceController],
      providers: [FeedbackSessionSeanceService],
    }).compile();

    controller = module.get<FeedbackSessionSeanceController>(FeedbackSessionSeanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
