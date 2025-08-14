import { Test, TestingModule } from '@nestjs/testing';
import { SeanceFeedbackService } from './seance-feedback.service';

describe('SeanceFeedbackService', () => {
  let service: SeanceFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeanceFeedbackService],
    }).compile();

    service = module.get<SeanceFeedbackService>(SeanceFeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
