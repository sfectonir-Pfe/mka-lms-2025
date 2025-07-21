import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackformateurController } from './feedbackformateur.controller';
import { FeedbackformateurService } from './feedbackformateur.service';

describe('FeedbackformateurController', () => {
  let controller: FeedbackformateurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackformateurController],
      providers: [FeedbackformateurService],
    }).compile();

    controller = module.get<FeedbackformateurController>(FeedbackformateurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
