import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackÉtudiantService } from './feedback-étudiant.service';

describe('FeedbackÉtudiantService', () => {
  let service: FeedbackÉtudiantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackÉtudiantService],
    }).compile();

    service = module.get<FeedbackÉtudiantService>(FeedbackÉtudiantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
