import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackSessionSeanceService } from './feedback-session-seance.service';

describe('FeedbackSessionSeanceService', () => {
  let service: FeedbackSessionSeanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackSessionSeanceService],
    }).compile();

    service = module.get<FeedbackSessionSeanceService>(FeedbackSessionSeanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
