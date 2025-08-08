import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackÉtudiantController } from './feedback-étudiant.controller';
import { FeedbackÉtudiantService } from './feedback-étudiant.service';

describe('FeedbackÉtudiantController', () => {
  let controller: FeedbackÉtudiantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackÉtudiantController],
      providers: [FeedbackÉtudiantService],
    }).compile();

    controller = module.get<FeedbackÉtudiantController>(FeedbackÉtudiantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
