import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackFormateurController } from './feedbackformateur.controller';
import { FeedbackFormateurService } from './feedbackformateur.service';

describe('FeedbackFormateurController', () => {
  let controller: FeedbackFormateurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackFormateurController],
      providers: [FeedbackFormateurService],
    }).compile();

    controller = module.get<FeedbackFormateurController>(FeedbackFormateurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
