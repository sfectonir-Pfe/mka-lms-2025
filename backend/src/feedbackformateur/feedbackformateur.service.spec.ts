import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackformateurService } from './feedbackformateur.service';

describe('FeedbackformateurService', () => {
  let service: FeedbackformateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackformateurService],
    }).compile();

    service = module.get<FeedbackformateurService>(FeedbackformateurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
